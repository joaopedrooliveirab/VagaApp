import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';

import { Button } from '../../components/Button';
import { EmptyState } from '../../components/EmptyState';
import { Notice } from '../../components/Notice';
import { Screen } from '../../components/Screen';
import { Title } from '../../components/Title';

import { colors, sharedStyles } from '../../constants/theme';

import { useAnalysis } from '../../context/AnalysisContext';
import {
  AnalysisError,
  getAnalysisStatus,
} from '../../features/analysis/analysis';
import type { AnalysisStatus } from '../../features/analysis/types';
import { formatSize } from '../../features/curriculum/curriculum';

export default function RevisaoScreen() {
  const router = useRouter();
  const { job, curriculum, startAnalysis } = useAnalysis();

  // Pergunta ao servidor quem fará a análise, para avisar a pessoa antes.
  const [status, setStatus] = useState<AnalysisStatus | null>(null);
  const [statusError, setStatusError] = useState('');
  const [attempt, setAttempt] = useState(0);

  const [consent, setConsent] = useState(false);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  // Evita navegar se a pessoa sair da tela durante a análise.
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    getAnalysisStatus()
      .then((value) => {
        if (active) {
          setStatus(value);
        }
      })
      .catch((reason: unknown) => {
        if (active) {
          setStatusError(
            reason instanceof AnalysisError
              ? reason.message
              : 'Não foi possível verificar o servidor de análise.',
          );
        }
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  if (!job || !curriculum) {
    return (
      <Screen centered={false} edges={['bottom']}>
        <EmptyState
          title="Falta escolher algo"
          message={
            !job
              ? 'Escolha uma vaga para revisar a análise.'
              : 'Selecione o PDF do seu currículo para revisar a análise.'
          }
          actionLabel={!job ? 'Ver vagas' : 'Selecionar currículo'}
          onAction={() =>
            router.dismissTo(!job ? '/vagas' : '/curriculo')
          }
        />
      </Screen>
    );
  }

  function handleRetryStatus() {
    setStatus(null);
    setStatusError('');
    setAttempt((value) => value + 1);
  }

  async function handleStart() {
    setRunning(true);
    setError('');

    try {
      await startAnalysis();

      if (mounted.current) {
        router.replace('/resultado');
      }
    } catch (reason) {
      if (mounted.current) {
        setError(
          reason instanceof AnalysisError
            ? reason.message
            : 'Não foi possível concluir a análise. Tente novamente.',
        );
      }
    } finally {
      if (mounted.current) {
        setRunning(false);
      }
    }
  }

  return (
    <Screen centered={false} edges={['bottom']}>
      <Title>Confira antes de começar</Title>

      <View style={sharedStyles.card}>
        <View style={styles.item}>
          <Text style={styles.label}>Vaga selecionada</Text>
          <Text style={styles.value}>{job.title}</Text>
          <Text style={styles.detail}>{job.company}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.item}>
          <Text style={styles.label}>Currículo selecionado</Text>
          <Text style={styles.value}>{curriculum.name}</Text>
          <Text style={styles.detail}>
            {formatSize(curriculum.size)}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        {statusError ? (
          <View style={styles.statusError}>
            <Text
              style={sharedStyles.error}
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
            >
              {statusError}
            </Text>

            <Button
              title="Verificar de novo"
              variant="outline"
              onPress={handleRetryStatus}
            />
          </View>
        ) : !status ? (
          <View style={styles.checking}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.detail}>
              Verificando o servidor de análise...
            </Text>
          </View>
        ) : status.kind === 'ia' ? (
          <Notice title="Análise por IA">
            Seu currículo será enviado ao servidor do app e analisado
            pelo modelo {status.model}. O app não guarda o arquivo. A IA
            pode errar, então confira o resultado.
          </Notice>
        ) : (
          <Notice title="Modo de exemplo (sem IA)">
            O servidor ainda não tem uma IA configurada. O resultado
            será um exemplo predefinido para a vaga e o conteúdo do seu
            PDF não será lido.
          </Notice>
        )}
      </View>

      <View style={styles.consent}>
        <Switch
          value={consent}
          onValueChange={setConsent}
          disabled={running}
          accessibilityLabel="Autorizo o envio do meu currículo para análise"
          trackColor={{ false: colors.border, true: colors.coral }}
          thumbColor={consent ? colors.primary : '#FFFFFF'}
          // Na web, a cor do botão ligado tem uma propriedade própria.
          {...(Platform.OS === 'web'
            ? ({ activeThumbColor: colors.primary } as object)
            : {})}
        />

        <Text style={styles.consentText}>
          Autorizo o envio do meu currículo para análise.
        </Text>
      </View>

      {!!error && (
        <Text
          style={[sharedStyles.error, styles.error]}
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      )}

      <Button
        title={running ? 'Analisando...' : 'Iniciar análise'}
        loading={running}
        disabled={!status || !consent}
        onPress={handleStart}
      />

      {running && (
        <Text
          style={styles.progress}
          accessibilityLiveRegion="polite"
        >
          Lendo seu currículo e comparando com a vaga. Isso pode levar
          até um minuto.
        </Text>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  item: {
    gap: 2,
  },

  label: {
    color: colors.muted,
    fontSize: 13,
  },

  value: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '700',
  },

  detail: {
    color: colors.muted,
    fontSize: 14,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
  },

  section: {
    marginTop: 20,
  },

  checking: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  statusError: {
    gap: 12,
  },

  consent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 20,
  },

  consentText: {
    flex: 1,
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },

  error: {
    marginBottom: 16,
  },

  progress: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
    textAlign: 'center',
  },
});
