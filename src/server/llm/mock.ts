import { scenarioByJob } from '../../features/analysis/scenarios';

import type { LlmProvider } from './types';

const DELAY_MS = 1500;

// Modo sem IA: devolve o cenário predefinido da vaga, sem ler o PDF.
// É usado quando não há chave configurada, para demonstrar o aplicativo.
export function createMockProvider(): LlmProvider {
  return {
    id: 'mock',
    model: 'exemplo',
    kind: 'exemplo',

    async assess({ job }) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

      const scenario = scenarioByJob[job.id];

      return {
        readable: true,
        skills: job.skills.map((skill) => {
          const strong = scenario?.strengths.includes(skill) ?? false;

          return {
            skill,
            status: strong ? 'evidenciada' : 'nao_identificada',
            evidence: strong
              ? 'Exemplo predefinido: este texto não vem do seu currículo.'
              : '',
          };
        }),
        suggestions: scenario?.suggestions ?? [],
      };
    },
  };
}
