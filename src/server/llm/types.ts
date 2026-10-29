import type { SkillStatus } from '../../features/analysis/types';
import type { Job } from '../../features/jobs/jobs';

export type AnalyzeInput = {
  job: Job;
  pdf: { base64: string; filename: string };
};

export type SkillAssessment = {
  skill: string;
  status: SkillStatus;
  evidence: string;
};

export type Assessment =
  | {
      readable: true;
      skills: SkillAssessment[];
      suggestions: string[];
    }
  | {
      // O PDF não é um currículo ou não tem texto legível.
      readable: false;
      reason: string;
    };

// Contrato que cada fornecedor de IA precisa cumprir. Para usar outro modelo
// de outro fornecedor, implemente esta interface e registre em ./index.ts.
export interface LlmProvider {
  readonly id: string;
  readonly model: string;
  readonly kind: 'ia' | 'exemplo';
  assess(input: AnalyzeInput): Promise<Assessment>;
}

// Erro com texto seguro para mostrar à pessoa e o status HTTP a devolver.
export class LlmError extends Error {
  readonly code: string;
  readonly httpStatus: number;

  constructor(
    code: string,
    message: string,
    httpStatus: number,
    cause?: unknown,
  ) {
    super(message, { cause });
    this.name = 'LlmError';
    this.code = code;
    this.httpStatus = httpStatus;
  }
}
