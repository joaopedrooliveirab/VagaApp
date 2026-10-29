// Cenários predefinidos e coerentes com cada vaga. Servem ao modo de exemplo
// (sem IA) e à geração dos números demonstrativos do painel TEIA.
// Os nomes em strengths e gaps correspondem às competências da vaga.
export type Scenario = {
  strengths: string[];
  gaps: string[];
  suggestions: string[];
};

export const scenarioByJob: Record<string, Scenario> = {
  'estagio-analise-de-dados': {
    strengths: ['Python', 'Excel'],
    gaps: ['SQL', 'Power BI'],
    suggestions: [
      'Inclua um projeto real em que utilizou SQL e descreva qual problema resolveu.',
      'Cite relatórios ou painéis que você montou e a ferramenta usada, como Excel ou Power BI.',
      'Mostre o resultado dos seus projetos com números, como o volume de dados analisado.',
    ],
  },
  'estagio-backend-java': {
    strengths: ['Java', 'Orientação a objetos'],
    gaps: ['SQL', 'Git'],
    suggestions: [
      'Descreva um projeto em Java e quais conceitos de orientação a objetos você aplicou.',
      'Inclua um trabalho com banco de dados e as consultas SQL que você escreveu.',
      'Adicione o link do seu repositório e cite o uso de Git no desenvolvimento.',
    ],
  },
  'estagio-front-end': {
    strengths: ['HTML', 'CSS', 'JavaScript'],
    gaps: ['React'],
    suggestions: [
      'Inclua um projeto com React e descreva os componentes que você criou.',
      'Adicione o link de uma página publicada ou do repositório do projeto.',
      'Cite cuidados com responsividade e acessibilidade que você aplicou.',
    ],
  },
  'estagio-suporte-de-ti': {
    strengths: ['Atendimento ao usuário'],
    gaps: ['Sistemas operacionais', 'Redes básicas'],
    suggestions: [
      'Relate uma situação em que você ajudou alguém a resolver um problema com tecnologia.',
      'Liste os sistemas operacionais que você já instalou ou configurou.',
      'Inclua cursos ou práticas com redes, como configuração de roteador ou Wi-Fi.',
    ],
  },
};
