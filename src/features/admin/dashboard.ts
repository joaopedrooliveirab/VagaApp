import { scenarioByJob } from '../analysis/scenarios';
import { jobs } from '../jobs/jobs';

// Períodos do filtro, em semanas.
export const periodOptions = [4, 8, 12] as const;
export type Period = (typeof periodOptions)[number];

type AnalysisRecord = {
  studentId: string;
  jobId: string;
  daysAgo: number;
  gaps: string[];
};

export type RankItem = {
  label: string;
  value: number;
};

export type WeekBucket = RankItem;

export type DashboardData = {
  activeStudents: number;
  completedAnalyses: number;
  analyzedJobs: number;
  weekly: WeekBucket[];
  topJobs: RankItem[];
  topGaps: RankItem[];
};

const DAYS_IN_WEEK = 7;
const MAX_DAYS = Math.max(...periodOptions) * DAYS_IN_WEEK;
const STUDENT_POOL = 36;
const JOB_WEIGHTS = [0.35, 0.3, 0.2, 0.15];

// Gerador pseudoaleatório com semente: os números demonstrativos são
// os mesmos a cada abertura do app.
function createRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state + 0x6d2b79f5) | 0;

    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickJobIndex(random: () => number): number {
  const roll = random();
  let sum = 0;

  for (let i = 0; i < JOB_WEIGHTS.length; i++) {
    sum += JOB_WEIGHTS[i];

    if (roll < sum) {
      return i;
    }
  }

  return JOB_WEIGHTS.length - 1;
}

// Lacunas coerentes com o resultado simulado de cada vaga: as competências
// marcadas como lacuna no cenário aparecem com mais frequência.
function pickGaps(jobId: string, random: () => number): string[] {
  const job = jobs.find((item) => item.id === jobId);
  const typicalGaps = scenarioByJob[jobId]?.gaps ?? [];

  if (!job) {
    return [];
  }

  const gaps = job.skills.filter((skill) => {
    const chance = typicalGaps.includes(skill) ? 0.8 : 0.15;
    return random() < chance;
  });

  if (gaps.length === 0 && typicalGaps.length > 0) {
    gaps.push(typicalGaps[0]);
  }

  return gaps;
}

function buildRecords(): AnalysisRecord[] {
  const random = createRandom(20260);
  const records: AnalysisRecord[] = [];

  for (let daysAgo = 0; daysAgo < MAX_DAYS; daysAgo++) {
    // O uso cresce ao longo do tempo: dias recentes têm mais análises.
    const growth = 1 + (MAX_DAYS - daysAgo) / 30;
    const count = Math.floor(random() * growth * 1.2);

    for (let i = 0; i < count; i++) {
      const studentNumber = Math.floor(
        Math.pow(random(), 1.5) * STUDENT_POOL,
      );
      const jobId = jobs[pickJobIndex(random)].id;

      records.push({
        studentId: `aluno-${studentNumber}`,
        jobId,
        daysAgo,
        gaps: pickGaps(jobId, random),
      });
    }
  }

  return records;
}

const records = buildRecords();

function countBy(values: string[]): RankItem[] {
  const counts = new Map<string, number>();

  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort(
      (a, b) =>
        b.value - a.value || a.label.localeCompare(b.label, 'pt-BR'),
    );
}

function formatDay(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${day}/${month}`;
}

// Todos os indicadores derivados das análises usam o mesmo intervalo.
export function getDashboard(weeks: Period): DashboardData {
  const days = weeks * DAYS_IN_WEEK;
  const inPeriod = records.filter((record) => record.daysAgo < days);

  const weekCounts = new Array<number>(weeks).fill(0);

  for (const record of inPeriod) {
    const week = weeks - 1 - Math.floor(record.daysAgo / DAYS_IN_WEEK);
    weekCounts[week] += 1;
  }

  const today = new Date();

  const weekly = weekCounts.map((value, week) => {
    const start = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - (DAYS_IN_WEEK * (weeks - 1 - week) + 6),
    );

    return { label: formatDay(start), value };
  });

  const jobTitles = new Map(jobs.map((job) => [job.id, job.title]));

  const topJobs = countBy(inPeriod.map((record) => record.jobId)).map(
    (item) => ({
      label: jobTitles.get(item.label) ?? item.label,
      value: item.value,
    }),
  );

  const topGaps = countBy(inPeriod.flatMap((record) => record.gaps));

  return {
    activeStudents: new Set(inPeriod.map((record) => record.studentId))
      .size,
    completedAnalyses: inPeriod.length,
    analyzedJobs: new Set(inPeriod.map((record) => record.jobId)).size,
    weekly,
    topJobs,
    topGaps,
  };
}

// Escopo separado: considera o catálogo inteiro, não o período.
export function getCatalogSkillDemand(): RankItem[] {
  return countBy(jobs.flatMap((job) => job.skills));
}
