import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../../components/Button';
import { EmptyState } from '../../../../components/EmptyState';
import { JobCard } from '../../../../components/JobCard';
import { Screen } from '../../../../components/Screen';
import { Tag } from '../../../../components/Tag';
import { Title } from '../../../../components/Title';
import { sharedStyles } from '../../../../constants/theme';
import { useAuth } from '../../../../context/AuthContext';
import { getCompanyById } from '../../../../features/companies/companies';
import { getCompanyJobs } from '../../../../features/companies/jobs';

export default function CompanyJobsScreen() {
  const { user, logout } = useAuth();
  if (user?.role !== 'empresa') return null;

  const company = getCompanyById(user.companyId);
  const jobs = getCompanyJobs(user.companyId);

  return (
    <Screen centered={false} maxWidth={640} wideMaxWidth={760}>
      <View style={styles.top}>
        <Tag label="Área da empresa" />
        <Button title="Sair" variant="outline" onPress={logout} />
      </View>
      <Title>Minhas vagas</Title>
      <Text style={sharedStyles.subtitle}>{company?.name ?? user.name}</Text>
      <Text style={sharedStyles.muted}>Ambiente demonstrativo · vagas e conversas locais.</Text>
      <View style={styles.list}>
        {jobs.length === 0 ? (
          <EmptyState title="Nenhuma vaga disponível" message="Sua empresa ainda não possui vagas nesta demonstração."
            actionLabel="Sair da conta" onAction={logout} />
        ) : jobs.map((job) => (
          <JobCard key={job.id} job={job} showPublicationStatus
            onPress={() => router.push({ pathname: '/empresa/vagas/[id]', params: { id: job.id } })} />
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 },
  list: { marginTop: 24, gap: 18 },
});
