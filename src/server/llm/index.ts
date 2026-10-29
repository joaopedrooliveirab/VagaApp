import { createAnthropicProvider } from './anthropic';
import { createMockProvider } from './mock';
import { LlmError, type LlmProvider } from './types';

// Modelo usado quando LLM_MODEL não é definido. Para trocar de modelo,
// basta definir LLM_MODEL (por exemplo claude-sonnet-5-5 ou claude-haiku-5-5).
export const DEFAULT_MODEL = 'claude-opus-5-5';

type Env = Record<string, string | undefined>;

// Para adicionar outro fornecedor: crie um arquivo que implemente LlmProvider
// (veja anthropic.ts) e registre aqui. Depois é só usar LLM_PROVIDER=<nome>.
const factories: Record<string, (env: Env) => LlmProvider> = {
  anthropic: (env) => {
    const apiKey = env.ANTHROPIC_API_KEY?.trim();

    if (!apiKey) {
      throw new LlmError(
        'not_configured',
        'Defina ANTHROPIC_API_KEY no arquivo .env.local do servidor.',
        500,
      );
    }

    return createAnthropicProvider({
      apiKey,
      model: env.LLM_MODEL?.trim() || DEFAULT_MODEL,
      fallbacks: env.ANTHROPIC_FALLBACKS?.trim().toLowerCase() !== 'off',
    });
  },

  mock: () => createMockProvider(),
};

// Sem LLM_PROVIDER, usa o Claude quando há chave e o modo de exemplo quando não há.
export function getProvider(env: Env = process.env): LlmProvider {
  const requested = env.LLM_PROVIDER?.trim().toLowerCase();
  const id = requested || (env.ANTHROPIC_API_KEY?.trim() ? 'anthropic' : 'mock');
  const factory = factories[id];

  if (!factory) {
    throw new LlmError(
      'not_configured',
      `LLM_PROVIDER "${id}" não existe. Opções: ${Object.keys(factories).join(', ')}.`,
      500,
    );
  }

  return factory(env);
}
