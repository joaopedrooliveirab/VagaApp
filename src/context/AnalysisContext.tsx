import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

import { analyzeResume } from '../features/analysis/analysis';
import type { AnalysisResult } from '../features/analysis/types';
import type { Curriculum } from '../features/curriculum/curriculum';
import type { Job } from '../features/jobs/jobs';

type AnalysisContextData = {
  job: Job | null;
  curriculum: Curriculum | null;
  result: AnalysisResult | null;
  selectJob: (job: Job) => void;
  clearJob: () => void;
  selectCurriculum: (curriculum: Curriculum) => void;
  startAnalysis: () => Promise<void>;
};

const AnalysisContext = createContext<AnalysisContextData | undefined>(
  undefined,
);

export function AnalysisProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [job, setJob] = useState<Job | null>(null);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function startAnalysis() {
    if (!job || !curriculum) {
      throw new Error('Escolha uma vaga e um currículo antes de analisar.');
    }

    const report = await analyzeResume(job, curriculum);

    setResult({
      ...report,
      jobId: job.id,
      curriculumName: curriculum.name,
    });
  }

  return (
    <AnalysisContext.Provider
      value={{
        job,
        curriculum,
        result,
        selectJob: setJob,
        clearJob: () => setJob(null),
        selectCurriculum: setCurriculum,
        startAnalysis,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);

  if (!context) {
    throw new Error(
      'useAnalysis deve ser utilizado dentro de AnalysisProvider.',
    );
  }

  return context;
}
