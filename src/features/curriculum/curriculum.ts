import * as DocumentPicker from 'expo-document-picker';

export type Curriculum = {
  name: string;
  size?: number;
  uri: string;
  // Só existe na web, onde o envio usa o próprio arquivo escolhido.
  file?: File;
};

export type PickResult =
  | { status: 'picked'; curriculum: Curriculum }
  | { status: 'canceled' }
  | { status: 'invalid'; message: string };

export const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function formatSize(size?: number): string {
  if (size === undefined) {
    return 'tamanho não informado';
  }

  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1).replace('.', ',')} MB`;
}

function isPdf(asset: DocumentPicker.DocumentPickerAsset): boolean {
  return (
    asset.mimeType === 'application/pdf' ||
    asset.name.toLowerCase().endsWith('.pdf')
  );
}

// Apenas escolhe o arquivo no aparelho: o envio só acontece quando a pessoa
// confirma a análise na tela de revisão.
export async function pickPdf(): Promise<PickResult> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      multiple: false,
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return { status: 'canceled' };
    }

    const asset = result.assets[0];

    if (!isPdf(asset)) {
      return {
        status: 'invalid',
        message: 'Formato inválido. Escolha um arquivo PDF.',
      };
    }

    if (asset.size !== undefined && asset.size > MAX_SIZE_BYTES) {
      return {
        status: 'invalid',
        message: 'O arquivo tem mais de 5 MB. Escolha um PDF menor.',
      };
    }

    return {
      status: 'picked',
      curriculum: {
        name: asset.name,
        size: asset.size,
        uri: asset.uri,
        file: asset.file,
      },
    };
  } catch {
    return {
      status: 'invalid',
      message: 'Não foi possível abrir o seletor de arquivos. Tente novamente.',
    };
  }
}
