import { useLocalSearchParams, useRouter } from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../components/Button';
import { BackControl } from '../../../components/BackControl';
import { EmptyState } from '../../../components/EmptyState';
import { CompanyMark, JobMeta } from '../../../components/JobCard';
import { Screen } from '../../../components/Screen';
import { Tag } from '../../../components/Tag';

import {
  colors,
  sharedStyles,
} from '../../../constants/theme';

import { useAnalysis } from '../../../context/AnalysisContext';
import { getJobById } from '../../../features/jobs/jobs';

export default function VagaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { selectJob } = useAnalysis();

  const job = getJobById(id);

  if (!job) {
    return (
      <Screen centered={false}>
        <BackControl label="Vagas" href="/vagas" />
        <EmptyState
          title="Vaga não encontrada"
          message="Não foi possível abrir esta vaga. Volte para a lista e escolha outra."
        />
      </Screen>
    );
  }

  function handleAnalyze() {
    if (!job) {
      return;
    }

    selectJob(job);
    router.dismissTo('/curriculo');
  }

  return (
    <Screen centered={false}>
      <BackControl label="Vagas" href="/vagas" />
      <View style={styles.header}>
        <CompanyMark company={job.company} />

        <View style={styles.headerText}>
          <Text style={sharedStyles.sectionTitle} accessibilityRole="header">
            {job.title}
          </Text>
          <Text style={styles.company}>{job.company}</Text>
        </View>
      </View>

      <Tag label="Vaga demonstrativa" variant="outline" />

      <View style={styles.meta}>
        <JobMeta icon="location" text={job.location} />
        <JobMeta icon="mode" text={job.mode} />
        <JobMeta icon="level" text={job.level} />
      </View>

      <View style={styles.section}>
        <Text style={sharedStyles.sectionTitle}>Descrição</Text>
        <Text style={sharedStyles.body}>{job.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={sharedStyles.sectionTitle}>Requisitos</Text>

        {job.requirements.map((requirement) => (
          <View key={requirement} style={styles.bullet}>
            <Text style={styles.dot}>•</Text>
            <Text style={[sharedStyles.body, styles.bulletText]}>
              {requirement}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={sharedStyles.sectionTitle}>Competências</Text>

        <View style={styles.tags}>
          {job.skills.map((skill) => (
            <Tag key={skill} label={skill} />
          ))}
        </View>
      </View>

      <View style={styles.action}>
        <Button
          title="Analisar meu currículo para esta vaga"
          onPress={handleAnalyze}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 14,
  },

  headerText: {
    flex: 1,
    gap: 2,
  },

  company: {
    color: colors.muted,
    fontSize: 15,
  },

  meta: {
    gap: 8,
    marginTop: 16,
  },

  section: {
    gap: 10,
    marginTop: 26,
  },

  bullet: {
    flexDirection: 'row',
    gap: 10,
  },

  dot: {
    color: colors.primary,
    fontSize: 15,
    lineHeight: 22,
  },

  bulletText: {
    flex: 1,
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  action: {
    marginTop: 32,
  },
});
