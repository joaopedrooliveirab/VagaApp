import { useState } from 'react';
import { useRouter } from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { Screen } from '../../../components/Screen';
import { Title } from '../../../components/Title';

import {
  colors,
  sharedStyles,
} from '../../../constants/theme';

import { useAnalysis } from '../../../context/AnalysisContext';
import {
  formatSize,
  pickPdf,
} from '../../../features/curriculum/curriculum';

export default function CurriculoScreen() {
  const router = useRouter();
  const { job, curriculum, selectCurriculum } = useAnalysis();

  const [picking, setPicking] = useState(false);
  const [error, setError] = useState('');

  async function handlePick() {
    setPicking(true);
    setError('');

    const result = await pickPdf();

    // Cancelar não é erro: a seleção anterior continua valendo.
    if (result.status === 'picked') {
      selectCurriculum(result.curriculum);
    } else if (result.status === 'invalid') {
      setError(result.message);
    }

    setPicking(false);
  }

  return (
    <Screen centered={false} edges={['top']}>
      <Title>Currículo</Title>

      <Text style={sharedStyles.subtitle}>
        Escolha o PDF que você quer analisar.
      </Text>

      {curriculum ? (
        <View style={sharedStyles.card}>
          <View style={styles.file}>
            <Icon name="pdf" color={colors.primary} size={36} />

            <View style={styles.fileText}>
              <Text style={styles.fileName} numberOfLines={2}>
                {curriculum.name}
              </Text>
              <Text style={styles.fileSize}>
                {formatSize(curriculum.size)}
              </Text>
            </View>
          </View>

          <Button
            title="Trocar currículo"
            variant="outline"
            loading={picking}
            onPress={handlePick}
          />
        </View>
      ) : (
        <View style={styles.dropzone}>
          <Icon name="upload" color={colors.primary} size={40} />

          <Text style={styles.dropTitle}>
            Selecione seu currículo
          </Text>

          <Text style={styles.dropText}>
            Toque para escolher um arquivo PDF.
          </Text>

          <Button
            title="Selecionar PDF"
            loading={picking}
            onPress={handlePick}
          />
        </View>
      )}

      {!!error && (
        <Text
          style={[sharedStyles.error, styles.error]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}

      <Text style={styles.hint}>
        Apenas PDF, com até 5 MB. O arquivo só é enviado quando você
        confirma a análise, na tela de revisão.
      </Text>

      <View style={styles.next}>
        {job ? (
          <Text style={sharedStyles.body}>
            Vaga escolhida:{' '}
            <Text style={styles.strong}>{job.title}</Text>
          </Text>
        ) : (
          <Text style={sharedStyles.body}>
            Para analisar, escolha primeiro uma vaga.
          </Text>
        )}

        {job ? (
          <Button
            title="Continuar para revisão"
            disabled={!curriculum}
            onPress={() => router.push('/revisao')}
          />
        ) : (
          <Button
            title="Escolher vaga"
            onPress={() => router.navigate('/vagas')}
          />
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  dropzone: {
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderColor: colors.coral,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 24,
  },

  dropTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },

  dropText: {
    color: colors.muted,
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },

  file: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  fileText: {
    flex: 1,
    gap: 2,
  },

  fileName: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  fileSize: {
    color: colors.muted,
    fontSize: 14,
  },

  error: {
    marginTop: 16,
  },

  hint: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 16,
  },

  next: {
    gap: 14,
    marginTop: 28,
  },

  strong: {
    fontWeight: '700',
  },
});
