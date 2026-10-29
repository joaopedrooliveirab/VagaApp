export type WorkMode = 'Remoto' | 'Híbrido' | 'Presencial';

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  mode: WorkMode;
  level: string;
  skills: string[];
  description: string;
  requirements: string[];
};

// Catálogo fictício: não há integração com uma fonte de vagas reais.
export const jobs: Job[] = [
  {
    id: 'estagio-analise-de-dados',
    title: 'Estágio em Análise de Dados',
    company: 'Nimbus Analytics',
    location: 'São Luís/MA',
    mode: 'Remoto',
    level: 'Estágio',
    skills: ['Python', 'SQL', 'Excel', 'Power BI'],
    description:
      'Apoie o time de dados na coleta, tratamento e análise de informações para gerar relatórios e painéis que ajudem nas decisões da empresa.',
    requirements: [
      'Cursando Sistemas de Informação, Ciência da Computação ou áreas relacionadas.',
      'Conhecimento básico de Python para tratamento de dados.',
      'Consultas simples em SQL.',
      'Planilhas em Excel e noções de Power BI.',
    ],
  },
  {
    id: 'estagio-backend-java',
    title: 'Estágio em Backend Java',
    company: 'Órbita Sistemas',
    location: 'São Luís/MA',
    mode: 'Híbrido',
    level: 'Estágio',
    skills: ['Java', 'Orientação a objetos', 'SQL', 'Git'],
    description:
      'Participe do desenvolvimento e da manutenção de APIs que atendem os sistemas da empresa, junto de pessoas desenvolvedoras mais experientes.',
    requirements: [
      'Cursando Sistemas de Informação, ADS ou áreas relacionadas.',
      'Conhecimento de Java e dos conceitos de orientação a objetos.',
      'Noções de banco de dados e SQL.',
      'Uso básico de Git para controle de versão.',
    ],
  },
  {
    id: 'estagio-front-end',
    title: 'Estágio em Front-end',
    company: 'Pixel Lab',
    location: 'São Luís/MA',
    mode: 'Remoto',
    level: 'Estágio',
    skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    description:
      'Ajude a construir interfaces web responsivas e acessíveis, transformando protótipos de design em telas funcionais.',
    requirements: [
      'Cursando áreas de tecnologia ou design digital.',
      'Domínio básico de HTML e CSS.',
      'Conhecimento de JavaScript.',
      'Noções de React e interesse por acessibilidade.',
    ],
  },
  {
    id: 'estagio-suporte-de-ti',
    title: 'Estágio em Suporte de TI',
    company: 'Conecta TI',
    location: 'São Luís/MA',
    mode: 'Presencial',
    level: 'Estágio',
    skills: [
      'Atendimento ao usuário',
      'Sistemas operacionais',
      'Redes básicas',
    ],
    description:
      'Atenda chamados de usuários, faça a instalação e a manutenção de equipamentos e ajude a manter a rede da empresa funcionando.',
    requirements: [
      'Cursando áreas de tecnologia.',
      'Boa comunicação para atender pessoas com diferentes níveis de familiaridade com tecnologia.',
      'Conhecimento de Windows e noções de Linux.',
      'Noções de redes, como Wi-Fi, IP e roteadores.',
    ],
  },
];

export function getJobById(id: string | undefined): Job | undefined {
  return jobs.find((job) => job.id === id);
}
