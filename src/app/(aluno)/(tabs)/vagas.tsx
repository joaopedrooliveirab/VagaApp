import { useRouter } from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';

import { JobCard } from '../../../components/JobCard';
import { Screen } from '../../../components/Screen';
import { Title } from '../../../components/Title';

import { sharedStyles } from '../../../constants/theme';
import { jobs } from '../../../features/jobs/jobs';
import { useResponsive } from '../../../hooks/use-responsive';

export default function VagasScreen() {
  const router = useRouter();
  const { wide } = useResponsive();

  return (
    <Screen centered={false} edges={['top']} wideMaxWidth={960}>
      <Title>Vagas</Title>

      <Text style={sharedStyles.subtitle}>
        Escolha uma vaga demonstrativa para analisar o seu currículo.
      </Text>

      {/* Uma coluna no celular; duas em tablets e telas largas. */}
      <View style={[styles.list, wide && styles.listWide]}>
        {jobs.map((job) => (
          <View key={job.id} style={wide && styles.cell}>
            <JobCard
              job={job}
              onPress={() =>
                router.push({
                  pathname: '/vaga/[id]',
                  params: { id: job.id },
                })
              }
            />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 16,
  },

  listWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // Duas colunas com 16 de espaço entre elas.
  cell: {
    flexBasis: '48%',
    flexGrow: 1,
  },
});
