import { Platform } from 'react-native';

import type { Curriculum } from '../curriculum/curriculum';
import type { Job } from '../jobs/jobs';

import type {
  AnalysisReport,
  AnalysisStatus,
  ApiErrorBody,
} from './types';

// Rota do servidor (src/app/api/analisar+api.ts). Em desenvolvimento, o Expo
// resolve o endereço relativo no servidor do `expo start`.
const ENDPOINT = '/api/analisar';

// A IA pode levar alguns segundos lendo o PDF.
const ANALYSIS_TIMEOUT_MS = 150_000;
const STATUS_TIMEOUT_MS = 15_000;

// Erro com texto pronto para mostrar à pessoa.
export class AnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnalysisError';
  }
}

async function request<T>(
  init: RequestInit,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;

  try {
    response = await fetch(ENDPOINT, {
      ...init,
      signal: controller.signal,
    });
  } catch {
    if (controller.signal.aborted) {
      throw new AnalysisError(
        'A análise demorou mais que o esperado. Tente novamente.',
      );
    }

    throw new AnalysisError(
      'Não foi possível conectar ao servidor de análise. Confira sua conexão e se o servidor do app está ligado.',
    );
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    let message = 'Não foi possível concluir a análise. Tente novamente.';

    try {
      const body = (await response.json()) as ApiErrorBody;

      if (body.error?.message) {
        message = body.error.message;
      }
    } catch {
      // Resposta sem o formato esperado: mantém a mensagem padrão.
    }

    throw new AnalysisError(message);
  }

  return (await response.json()) as T;
}

export function getAnalysisStatus(): Promise<AnalysisStatus> {
  return request<AnalysisStatus>({ method: 'GET' }, STATUS_TIMEOUT_MS);
}

export function analyzeResume(
  job: Job,
  curriculum: Curriculum,
): Promise<AnalysisReport> {
  const form = new FormData();

  form.append('jobId', job.id);

  if (Platform.OS === 'web' && curriculum.file) {
    form.append('file', curriculum.file, curriculum.name);
  } else {
    // No celular, o React Native envia o arquivo a partir do endereço local.
    form.append('file', {
      uri: curriculum.uri,
      name: curriculum.name,
      type: 'application/pdf',
    } as unknown as Blob);
  }

  return request<AnalysisReport>(
    { method: 'POST', body: form },
    ANALYSIS_TIMEOUT_MS,
  );
}
