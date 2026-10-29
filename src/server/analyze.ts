import { computeScore } from '../features/analysis/score';
import type { AnalysisReport } from '../features/analysis/types';
import type { Job } from '../features/jobs/jobs';

import { LlmError, type LlmProvider } from './llm/types';

export const MAX_PDF_BYTES = 5 * 1024 * 1024;

export function isPdf(bytes: Uint8Array): boolean {
  // Todo PDF começa com "%PDF-".
  return (
    bytes.length > 5 &&
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46 &&
    bytes[4] === 0x2d
  );
}

// Base64 sem depender de Buffer, que não existe em todos os ambientes de servidor.
export function toBase64(bytes: Uint8Array): string {
  const CHUNK = 0x8000;
  let binary = '';

  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }

  return btoa(binary);
}

export async function analyzeResume({
  provider,
  job,
  pdf,
}: {
  provider: LlmProvider;
  job: Job;
  pdf: { bytes: Uint8Array; filename: string };
}): Promise<AnalysisReport> {
  const assessment = await provider.assess({
    job,
    pdf: { base64: toBase64(pdf.bytes), filename: pdf.filename },
  });

  if (!assessment.readable) {
    throw new LlmError(
      'unreadable',
      `Não foi possível ler o currículo: ${assessment.reason} Envie um PDF com texto.`,
      422,
    );
  }

  return {
    score: computeScore(assessment.skills),
    skills: assessment.skills,
    suggestions: assessment.suggestions,
    source:
      provider.kind === 'ia'
        ? { kind: 'ia', provider: provider.id, model: provider.model }
        : { kind: 'exemplo' },
  };
}
