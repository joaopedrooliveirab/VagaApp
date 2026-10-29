import type {
  AnalysisStatus,
  ApiErrorBody,
} from '../../features/analysis/types';
import { getJobById } from '../../features/jobs/jobs';
import {
  MAX_PDF_BYTES,
  analyzeResume,
  isPdf,
} from '../../server/analyze';
import { getProvider } from '../../server/llm';
import { LlmError } from '../../server/llm/types';

// Esta rota roda no servidor: a chave da IA fica aqui e nunca chega ao app.

function errorResponse(code: string, message: string, status: number) {
  const body: ApiErrorBody = { error: { code, message } };
  return Response.json(body, { status });
}

function handleError(error: unknown) {
  if (error instanceof LlmError) {
    // O motivo técnico só aparece no log do servidor.
    console.error(`[analisar] ${error.code}:`, error.cause ?? error.message);
    return errorResponse(error.code, error.message, error.httpStatus);
  }

  console.error('[analisar] erro inesperado:', error);
  return errorResponse(
    'internal',
    'Não foi possível concluir a análise. Tente novamente.',
    500,
  );
}

// Informa quem fará a análise (IA ou exemplo), sem expor a chave.
export async function GET() {
  try {
    const provider = getProvider();
    const status: AnalysisStatus = {
      kind: provider.kind,
      provider: provider.id,
      model: provider.model,
    };

    return Response.json(status);
  } catch (error) {
    return handleError(error);
  }
}

// O tipo global de FormData do React Native não declara `get`, que o servidor usa.
type FormDataLike = { get(name: string): unknown };

type Upload = {
  name: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
};

function isUpload(value: unknown): value is Upload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'arrayBuffer' in value &&
    'size' in value
  );
}

export async function POST(request: Request) {
  let form: FormDataLike;

  try {
    form = (await request.formData()) as unknown as FormDataLike;
  } catch {
    return errorResponse(
      'invalid_request',
      'Pedido inválido. Envie o currículo e a vaga.',
      400,
    );
  }

  const job = getJobById(String(form.get('jobId') ?? ''));
  const file = form.get('file');

  if (!job) {
    return errorResponse('invalid_request', 'Vaga não encontrada.', 400);
  }

  if (!isUpload(file)) {
    return errorResponse(
      'invalid_request',
      'Envie o currículo em PDF.',
      400,
    );
  }

  if (file.size > MAX_PDF_BYTES) {
    return errorResponse(
      'too_large',
      'O arquivo tem mais de 5 MB. Escolha um PDF menor.',
      413,
    );
  }

  const bytes = new Uint8Array(await file.arrayBuffer());

  if (!isPdf(bytes)) {
    return errorResponse(
      'invalid_request',
      'Formato inválido. Escolha um arquivo PDF.',
      400,
    );
  }

  try {
    const report = await analyzeResume({
      provider: getProvider(),
      job,
      pdf: { bytes, filename: file.name },
    });

    return Response.json(report);
  } catch (error) {
    return handleError(error);
  }
}
