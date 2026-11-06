import type { ReactNode } from 'react';
import { useRouter } from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../components/Button';
import { BackControl } from '../../components/BackControl';
import { EmptyState } from '../../components/EmptyState';
import { Icon, type IconName } from '../../components/Icon';
import { Notice } from '../../components/Notice';
import { Screen } from '../../components/Screen';

import { colors, sharedStyles } from '../../constants/theme';

import { useAnalysis } from '../../context/AnalysisContext';
import type { SkillStatus } from '../../features/analysis/types';
import { getJobById } from '../../features/jobs/jobs';

const STATUS_TEXT: Record<SkillStatus, string> = {
  evidenciada: 'Evidenciada no currículo.',
  mencionada: 'Mencionada no currículo, sem detalhes que comprovem o uso.',
  nao_identificada: 'Não identificado no currículo.',
};

function Block({
  icon,
  title,
  children,
}: {
  icon: IconName;
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={sharedStyles.card}>
      <View style={styles.blockHeader}>
        <Icon name={icon} color={colors.primary} size={24} />
        <Text
          style={[sharedStyles.sectionTitle, styles.blockTitle]}
          accessibilityRole="header"
        >
          {title}
        </Text>
      </View>

      {children}
    </View>
  );
}

function ResultItem({
  title,
  caption,
  evidence,
}: {
  title: string;
  caption: string;
  evidence?: string;
}) {
  return (
    <View style={styles.resultItem}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemCaption}>{caption}</Text>
      {!!evidence && (
        <Text style={styles.evidence}>“{evidence}”</Text>
      )}
    </View>
  );
}

export default function ResultadoScreen() {
  const router = useRouter();
  const { result, clearJob } = useAnalysis();

  const job = getJobById(result?.jobId);

  if (!result || !job) {
    return (
      <Screen centered={false} edges={['bottom']}>
        <EmptyState
          title="Nenhuma análise para mostrar"
          message="Escolha uma vaga e um currículo para ver o resultado de uma análise."
          actionLabel="Ver vagas"
          onAction={() => router.dismissTo('/vagas')}
        />
      </Screen>
    );
  }

  function handleAnotherJob() {
    clearJob();
    router.dismissTo('/vagas');
  }

  const byAi = result.source.kind === 'ia';
  const model = result.source.kind === 'ia' ? result.source.model : '';

  const strengths = result.skills.filter(
    (item) => item.status !== 'nao_identificada',
  );
  const gaps = result.skills.filter(
    (item) => item.status === 'nao_identificada',
  );
  const evidenced = result.skills.filter(
    (item) => item.status === 'evidenciada',
  ).length;
  const mentioned = result.skills.filter(
    (item) => item.status === 'mencionada',
  ).length;

  return (
    <Screen centered={false} edges={['bottom']}>
      <BackControl label="Início" href="/home" />
      {byAi ? (
        <Notice title="Análise feita por IA">
          Gerada pelo modelo {model} a partir do seu PDF. A IA pode
          errar, então confira as informações. Nenhuma candidatura foi
          enviada.
        </Notice>
      ) : (
        <Notice title="Resultado de exemplo">
          Nenhuma IA analisou o seu PDF: os itens abaixo são exemplos
          predefinidos para esta vaga. Nenhuma candidatura foi enviada.
        </Notice>
      )}

      <View style={styles.context}>
        <Text style={styles.contextLine}>
          Vaga: <Text style={styles.strong}>{job.title}</Text>
        </Text>
        <Text style={styles.contextLine}>
          Currículo:{' '}
          <Text style={styles.strong}>{result.curriculumName}</Text>
        </Text>
      </View>

      <View style={styles.blocks}>
        <Block
          icon="shield"
          title={
            byAi
              ? 'Compatibilidade estimada'
              : 'Compatibilidade demonstrativa'
          }
        >
          <View
            accessible
            accessibilityLabel={`Compatibilidade ${byAi ? 'estimada' : 'simulada'} de ${result.score} por cento`}
            style={styles.scoreRow}
          >
            <Text style={styles.score}>{result.score}%</Text>
            <Text style={styles.scoreLabel}>
              {byAi ? 'estimada' : 'simulada'}
            </Text>
          </View>

          <View style={styles.track}>
            <View
              style={[styles.fill, { width: `${result.score}%` }]}
            />
          </View>

          <Text style={styles.itemCaption}>
            Compatibilidade não representa probabilidade de contratação.
          </Text>
        </Block>

        <Block icon="check" title="Pontos fortes">
          {strengths.length === 0 ? (
            <Text style={styles.itemCaption}>
              Nenhuma competência da vaga foi encontrada no currículo.
            </Text>
          ) : (
            strengths.map((item) => (
              <ResultItem
                key={item.skill}
                title={item.skill}
                caption={STATUS_TEXT[item.status]}
                evidence={item.evidence}
              />
            ))
          )}
        </Block>

        <Block icon="gap" title="Lacunas identificadas">
          {gaps.length === 0 ? (
            <Text style={styles.itemCaption}>
              Todas as competências da vaga aparecem no currículo.
            </Text>
          ) : (
            gaps.map((item) => (
              <ResultItem
                key={item.skill}
                title={item.skill}
                caption={STATUS_TEXT.nao_identificada}
              />
            ))
          )}

          <Text style={styles.itemCaption}>
            “Não identificado” quer dizer que o item não apareceu no
            currículo. Não significa que você não tenha essa
            competência.
          </Text>
        </Block>

        <Block icon="tip" title="Sugestões de melhoria">
          {result.suggestions.map((suggestion) => (
            <View key={suggestion} style={styles.bullet}>
              <Text style={styles.dot}>•</Text>
              <Text style={[sharedStyles.body, styles.bulletText]}>
                {suggestion}
              </Text>
            </View>
          ))}
        </Block>

        <Block icon="info" title="Como esta análise foi feita">
          <View style={styles.bullet}>
            <Text style={styles.dot}>1.</Text>
            <Text style={[sharedStyles.body, styles.bulletText]}>
              Você escolheu a vaga e o PDF do seu currículo.
            </Text>
          </View>

          <View style={styles.bullet}>
            <Text style={styles.dot}>2.</Text>
            <Text style={[sharedStyles.body, styles.bulletText]}>
              {byAi
                ? `O servidor enviou o PDF ao modelo ${model}, que leu o documento e marcou cada competência da vaga como evidenciada, mencionada ou não identificada, citando o trecho do currículo quando encontrou.`
                : 'Nenhuma IA foi usada: o servidor devolveu um cenário predefinido para esta vaga, sem ler o PDF.'}
            </Text>
          </View>

          <View style={styles.bullet}>
            <Text style={styles.dot}>3.</Text>
            <Text style={[sharedStyles.body, styles.bulletText]}>
              {`A compatibilidade é a média das ${result.skills.length} competências da vaga: evidenciada vale 1, mencionada vale 0,5 e não identificada vale 0. Neste resultado: ${evidenced} evidenciada(s), ${mentioned} mencionada(s) e ${gaps.length} não identificada(s).`}
            </Text>
          </View>

          {byAi && (
            <View style={styles.bullet}>
              <Text style={styles.dot}>4.</Text>
              <Text style={[sharedStyles.body, styles.bulletText]}>
                As sugestões foram escritas pela IA a partir do que foi
                (ou não) encontrado no seu currículo.
              </Text>
            </View>
          )}
        </Block>
      </View>

      <View style={styles.actions}>
        <Button
          title="Analisar outra vaga"
          onPress={handleAnotherJob}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  context: {
    gap: 4,
    marginTop: 18,
  },

  contextLine: {
    color: colors.muted,
    fontSize: 14,
  },

  strong: {
    color: colors.text,
    fontWeight: '700',
  },

  blocks: {
    gap: 16,
    marginTop: 20,
  },

  blockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  blockTitle: {
    flex: 1,
  },

  scoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },

  score: {
    color: colors.text,
    fontSize: 48,
    fontWeight: '700',
  },

  scoreLabel: {
    color: colors.muted,
    fontSize: 16,
  },

  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.veryLight,
    overflow: 'hidden',
  },

  fill: {
    height: '100%',
    backgroundColor: colors.primary,
  },

  resultItem: {
    gap: 2,
  },

  itemTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },

  itemCaption: {
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },

  evidence: {
    color: colors.text,
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },

  bullet: {
    flexDirection: 'row',
    gap: 10,
  },

  dot: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },

  bulletText: {
    flex: 1,
  },

  actions: {
    gap: 12,
    marginTop: 28,
  },
});
