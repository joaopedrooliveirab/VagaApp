import { useRouter } from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';

import { Avatar } from '../../../components/Avatar';
import { Button } from '../../../components/Button';
import { Icon } from '../../../components/Icon';
import { Notice } from '../../../components/Notice';
import { Screen } from '../../../components/Screen';

import {
  colors,
  sharedStyles,
} from '../../../constants/theme';

import { useAnalysis } from '../../../context/AnalysisContext';
import { useAuth } from '../../../context/AuthContext';

function Step({
  done,
  label,
  value,
  empty,
}: {
  done: boolean;
  label: string;
  value?: string;
  empty: string;
}) {
  return (
    <View
      style={styles.step}
      accessible
      accessibilityLabel={`${label}: ${value ?? empty}`}
    >
      <Icon
        name={done ? 'check' : 'pending'}
        color={done ? colors.primary : colors.muted}
        size={22}
      />

      <View style={styles.stepText}>
        <Text style={styles.stepLabel}>{label}</Text>
        <Text style={styles.stepValue}>{value ?? empty}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { job, curriculum } = useAnalysis();

  if (!user) {
    return null;
  }

  // Sem vaga, a análise começa pela escolha da vaga.
  function handleAnalyze() {
    if (!job) {
      router.navigate('/vagas');
    } else if (!curriculum) {
      router.navigate('/curriculo');
    } else {
      router.push('/revisao');
    }
  }

  const firstName = user.name.trim().split(' ')[0].toUpperCase();

  return (
    <Screen centered={false} edges={['top']}>
      <View style={styles.profile}>
        <View style={styles.band} />

        <View style={styles.profileRow}>
          <View style={styles.avatarSlot}>
            <Avatar size={88} />
          </View>

          <Text style={styles.greeting} accessibilityRole="header">
            Olá, {firstName}!
          </Text>
        </View>
      </View>

      <Text style={[sharedStyles.subtitle, styles.intro]}>
        Veja como seu currículo se encaixa em uma vaga e o que dá
        para melhorar.
      </Text>

      <View style={sharedStyles.card}>
        <Text style={sharedStyles.sectionTitle}>
          Analise seu currículo
        </Text>

        <Step
          done={!!job}
          label="Vaga"
          value={job?.title}
          empty="Nenhuma vaga escolhida"
        />

        <Step
          done={!!curriculum}
          label="Currículo"
          value={curriculum?.name}
          empty="Nenhum PDF selecionado"
        />

        <Button title="Analisar currículo" onPress={handleAnalyze} />
      </View>

      <View style={styles.footer}>
        <Notice title="Aplicativo demonstrativo">
          As vagas são fictícias e nenhuma candidatura é enviada.
        </Notice>

        <Button
          title="Sair"
          variant="outline"
          onPress={logout}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  profile: {
    backgroundColor: colors.background,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    paddingBottom: 18,
  },

  band: {
    height: 64,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingHorizontal: 18,
  },

  // O avatar sobe e cruza a faixa vermelha.
  avatarSlot: {
    marginTop: -44,
  },

  greeting: {
    flex: 1,
    color: colors.primary,
    fontSize: 24,
    fontWeight: '800',
    marginTop: 14,
  },

  intro: {
    marginTop: 22,
    marginBottom: 22,
  },

  step: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  stepText: {
    flex: 1,
  },

  stepLabel: {
    color: colors.muted,
    fontSize: 13,
  },

  stepValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },

  footer: {
    gap: 16,
    marginTop: 28,
  },
});
