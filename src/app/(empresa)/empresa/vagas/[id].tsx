import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../../components/Button';
import { BackControl } from '../../../../components/BackControl';
import { EmptyState } from '../../../../components/EmptyState';
import { CompanyMark, JobMeta } from '../../../../components/JobCard';
import { Screen } from '../../../../components/Screen';
import { Tag } from '../../../../components/Tag';
import { sharedStyles } from '../../../../constants/theme';
import { useAuth } from '../../../../context/AuthContext';
import { useConversations } from '../../../../context/ConversationsContext';
import { getCompanyJobById } from '../../../../features/companies/jobs';
import { publicationLabels } from '../../../../features/jobs/jobs';

export default function CompanyJobScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { openConversation } = useConversations();
  const [error, setError] = useState('');
  const job = getCompanyJobById(id);

  if (user?.role !== 'empresa') return null;

  if (!job || job.companyId !== user.companyId) {
    return (
      <Screen centered={false}>
        <BackControl label="Minhas vagas" href="/empresa/vagas" />
        <EmptyState title="Vaga indisponível"
          message="Esta vaga não existe ou não pertence à sua empresa." />
      </Screen>
    );
  }

  function handleConversation() {
    if (!job) return;
    const conversationId = openConversation(job.id);
    if (!conversationId) {
      setError('Não foi possível abrir esta conversa. Volte para suas vagas e tente novamente.');
      return;
    }
    router.push({ pathname: '/empresa/conversas/[id]', params: { id: conversationId } });
  }

  return (
    <Screen centered={false} maxWidth={640} wideMaxWidth={760}>
      <BackControl label="Minhas vagas" href="/empresa/vagas" />
      <View style={styles.header}>
        <CompanyMark company={job.company} />
        <View style={styles.flex}>
          <Text style={sharedStyles.sectionTitle} accessibilityRole="header">{job.title}</Text>
          <Text style={sharedStyles.muted}>{job.company}</Text>
        </View>
      </View>
      <Tag label={publicationLabels[job.publicationStatus]} />
      <View style={styles.section}>
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
          <Text key={requirement} style={sharedStyles.body}>• {requirement}</Text>
        ))}
      </View>
      <View style={styles.section}>
        <Text style={sharedStyles.sectionTitle}>Competências</Text>
        <View style={styles.tags}>
          {job.skills.map((skill) => <Tag key={skill} label={skill} />)}
        </View>
      </View>
      <View style={styles.section}>
        <Button title="Conversar com o TEIA" onPress={handleConversation} />
        {!!error && <Text style={sharedStyles.error} accessibilityRole="alert">{error}</Text>}
        <Text style={sharedStyles.muted}>Publicação demonstrativa. As mensagens ficam somente nesta execução do aplicativo.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, marginVertical: 24 },
  section: { gap: 10, marginTop: 24 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
