import { jobs, type Job } from '../jobs/jobs';

// Estas oportunidades não entram no catálogo do aluno nem nos indicadores atuais.
const additionalJobs: Job[] = [
  {
    id: 'nimbus-estagio-bi',
    title: 'Estágio em Business Intelligence',
    company: 'Nimbus Analytics',
    companyId: 'nimbus-analytics',
    publicationStatus: 'review',
    location: 'São Luís/MA',
    mode: 'Híbrido',
    level: 'Estágio',
    skills: ['SQL', 'Power BI', 'Comunicação'],
    description: 'Apoie a construção de painéis e a documentação de indicadores para os clientes da Nimbus.',
    requirements: [
      'Cursando graduação em tecnologia, estatística ou administração.',
      'Conhecimentos básicos de SQL e Power BI.',
      'Interesse em transformar dados em informações claras.',
    ],
  },
  {
    id: 'nimbus-assistente-dados',
    title: 'Assistente de Dados',
    company: 'Nimbus Analytics',
    companyId: 'nimbus-analytics',
    publicationStatus: 'closed',
    location: 'São Luís/MA',
    mode: 'Remoto',
    level: 'Júnior',
    skills: ['Excel', 'Python', 'Organização'],
    description: 'Organização e conferência de bases de dados utilizadas em relatórios periódicos. Esta publicação já foi encerrada.',
    requirements: [
      'Conhecimento de planilhas e organização de arquivos.',
      'Noções de Python para automatizar tarefas simples.',
    ],
  },
];

const companyJobs = [...jobs, ...additionalJobs];

export function getCompanyJobs(companyId: string): Job[] {
  return companyJobs.filter((job) => job.companyId === companyId);
}

export function getCompanyJobById(id: string | undefined): Job | undefined {
  return companyJobs.find((job) => job.id === id);
}
