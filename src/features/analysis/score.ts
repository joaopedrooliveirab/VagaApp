import type { SkillResult, SkillStatus } from './types';

// A compatibilidade é calculada por código, não pela IA: a IA só classifica
// cada competência da vaga e o resultado é a média destes pesos.
export const STATUS_WEIGHT: Record<SkillStatus, number> = {
  evidenciada: 1,
  mencionada: 0.5,
  nao_identificada: 0,
};

export function computeScore(skills: SkillResult[]): number {
  if (skills.length === 0) {
    return 0;
  }

  const total = skills.reduce(
    (sum, item) => sum + STATUS_WEIGHT[item.status],
    0,
  );

  return Math.round((total / skills.length) * 100);
}
