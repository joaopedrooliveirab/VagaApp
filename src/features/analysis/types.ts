// Tipos compartilhados entre o app e o servidor de análise (src/server).

export type SkillStatus =
  | 'evidenciada'
  | 'mencionada'
  | 'nao_identificada';

export type SkillResult = {
  skill: string;
  status: SkillStatus;
  // Trecho (ou resumo) do currículo que sustenta a classificação.
  evidence: string;
};

export type AnalysisSource =
  | { kind: 'ia'; provider: string; model: string }
  | { kind: 'exemplo' };

// Resposta do servidor para uma análise.
export type AnalysisReport = {
  score: number;
  skills: SkillResult[];
  suggestions: string[];
  source: AnalysisSource;
};

export type AnalysisResult = AnalysisReport & {
  jobId: string;
  curriculumName: string;
};

// Resposta de GET /api/analisar: informa quem fará a análise.
export type AnalysisStatus = {
  kind: 'ia' | 'exemplo';
  provider: string;
  model: string;
};

export type ApiErrorBody = {
  error: { code: string; message: string };
};
