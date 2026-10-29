import Anthropic from '@anthropic-ai/sdk';

import {
  SYSTEM_PROMPT,
  buildResponseSchema,
  buildUserPrompt,
  parseAssessment,
} from './prompt';
import { LlmError, type LlmProvider } from './types';

type AnthropicOptions = {
  apiKey: string;
  model: string;
  // Reenvia a outra IA, no próprio servidor da Anthropic, um pedido que os
  // filtros de segurança recusaram. Desative com ANTHROPIC_FALLBACKS=off
  // se o modelo escolhido não for compatível.
  fallbacks: boolean;
};

// Thinking adaptativo (padrão dos modelos atuais) consome parte deste limite.
const MAX_TOKENS = 16000;

function toLlmError(error: unknown): LlmError {
  if (error instanceof LlmError) {
    return error;
  }

  if (error instanceof Anthropic.RateLimitError) {
    return new LlmError(
      'rate_limited',
      'O serviço de IA está com muitas solicitações. Tente novamente em instantes.',
      429,
      error,
    );
  }

  if (
    error instanceof Anthropic.AuthenticationError ||
    error instanceof Anthropic.PermissionDeniedError
  ) {
    return new LlmError(
      'not_configured',
      'O servidor não conseguiu acessar o serviço de IA. Confira a chave ANTHROPIC_API_KEY.',
      502,
      error,
    );
  }

  if (error instanceof Anthropic.BadRequestError) {
    return new LlmError(
      'bad_request',
      'O serviço de IA recusou o pedido. Confira o modelo em LLM_MODEL e o PDF enviado.',
      502,
      error,
    );
  }

  if (error instanceof Anthropic.APIConnectionError) {
    return new LlmError(
      'unavailable',
      'Não foi possível conectar ao serviço de IA. Tente novamente.',
      503,
      error,
    );
  }

  if (error instanceof Anthropic.APIError) {
    return new LlmError(
      'llm_error',
      'O serviço de IA está indisponível no momento. Tente novamente.',
      502,
      error,
    );
  }

  return new LlmError(
    'llm_error',
    'Não foi possível concluir a análise. Tente novamente.',
    502,
    error,
  );
}

export function createAnthropicProvider({
  apiKey,
  model,
  fallbacks,
}: AnthropicOptions): LlmProvider {
  const client = new Anthropic({
    apiKey,
    timeout: 90_000,
    maxRetries: 1,
  });

  return {
    id: 'anthropic',
    model,
    kind: 'ia',

    async assess({ job, pdf }) {
      try {
        const response = await client.beta.messages.create({
          model,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: [
            {
              role: 'user',
              content: [
                // A API lê PDF direto (texto e imagens das páginas).
                {
                  type: 'document',
                  source: {
                    type: 'base64',
                    media_type: 'application/pdf',
                    data: pdf.base64,
                  },
                },
                { type: 'text', text: buildUserPrompt(job) },
              ],
            },
          ],
          output_config: {
            format: {
              type: 'json_schema',
              schema: buildResponseSchema(job),
            },
          },
          ...(fallbacks
            ? {
                betas: ['server-side-fallback-2026-07-01'],
                fallbacks: 'default' as const,
              }
            : {}),
        });

        if (response.stop_reason === 'refusal') {
          throw new LlmError(
            'refused',
            'A IA não pôde analisar este documento.',
            422,
          );
        }

        if (response.stop_reason === 'max_tokens') {
          throw new LlmError(
            'truncated',
            'A resposta da IA ficou incompleta. Tente novamente.',
            502,
          );
        }

        const text = response.content.find(
          (block) => block.type === 'text',
        );

        if (!text || text.type !== 'text') {
          throw new LlmError(
            'invalid_output',
            'A IA não devolveu uma resposta. Tente novamente.',
            502,
          );
        }

        return parseAssessment(text.text, job);
      } catch (error) {
        throw toLlmError(error);
      }
    },
  };
}
