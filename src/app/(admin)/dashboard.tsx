import { useMemo, useState, type ReactNode } from 'react';
import { router } from 'expo-router';

import { StyleSheet, Text, View } from 'react-native';

import { BarChart } from '../../components/BarChart';
import { Button } from '../../components/Button';
import { LogoutControl } from '../../components/LogoutControl';
import { Notice } from '../../components/Notice';
import { RankList } from '../../components/RankList';
import { Screen } from '../../components/Screen';
import { SegmentedControl } from '../../components/SegmentedControl';
import { StatTile } from '../../components/StatTile';
import { Tag } from '../../components/Tag';
import { Title } from '../../components/Title';

import { colors, sharedStyles } from '../../constants/theme';

import { useAuth } from '../../context/AuthContext';
import {
  getCatalogSkillDemand,
  getDashboard,
  periodOptions,
  type Period,
} from '../../features/admin/dashboard';
import { useResponsive } from '../../hooks/use-responsive';

const periods = periodOptions.map((weeks) => ({
  value: weeks,
  label: `${weeks} semanas`,
}));

function Section({
  title,
  note,
  full = false,
  children,
}: {
  title: string;
  note?: string;
  // Ocupa a linha inteira mesmo quando as seções ficam em duas colunas.
  full?: boolean;
  children: ReactNode;
}) {
  const { wide } = useResponsive();

  return (
    <View
      style={[
        sharedStyles.card,
        styles.section,
        wide && { flexBasis: full ? '100%' : '48%' },
      ]}
    >
      <Text style={sharedStyles.sectionTitle} accessibilityRole="header">
        {title}
      </Text>

      {!!note && <Text style={styles.note}>{note}</Text>}

      {children}
    </View>
  );
}

export default function DashboardScreen() {
  const { logout } = useAuth();
  const { wide } = useResponsive();
  const [period, setPeriod] = useState<Period>(8);

  const data = useMemo(() => getDashboard(period), [period]);
  const catalogSkills = useMemo(() => getCatalogSkillDemand(), []);

  return (
    <Screen centered={false} maxWidth={720} wideMaxWidth={1040}>
      <View style={styles.topRow}>
        <Tag label="Área administrativa — TEIA" />

        <LogoutControl onPress={logout} />
      </View>

      <Title>Painel TEIA</Title>

      <Text style={sharedStyles.subtitle}>
        Uso da plataforma e preparação dos alunos para as vagas.
      </Text>

      <Button title="Conversas com empresas" variant="outline" onPress={() => router.push('/teia/conversas')} />
      <View style={{ marginTop: 12 }}>
        <Button title="Solicitações de empresas" variant="outline" onPress={() => router.push('/teia/solicitacoes')} />
      </View>

      <View style={styles.demoNotice}>
        <Notice title="Dados demonstrativos">
          Os números abaixo são fictícios e não representam alunos
          reais.
        </Notice>
      </View>

      <View style={styles.filter}>
        <Text style={styles.filterLabel}>Período</Text>

        <SegmentedControl
          label="Período dos indicadores"
          options={periods}
          value={period}
          onChange={setPeriod}
        />
      </View>

      <View style={styles.tiles}>
        <StatTile label="Alunos ativos" value={data.activeStudents} />
        <StatTile
          label="Análises concluídas"
          value={data.completedAnalyses}
        />
        <StatTile label="Vagas analisadas" value={data.analyzedJobs} />
      </View>

      {/* Uma coluna no celular; duas em tablets e telas largas. */}
      <View style={[styles.sections, wide && styles.sectionsWide]}>
        {data.completedAnalyses === 0 ? (
          <Text style={styles.empty}>
            Sem análises concluídas neste período.
          </Text>
        ) : (
          <>
            <Section full title="Análises concluídas por semana">
              <BarChart data={data.weekly} unit="análises" />
            </Section>

            <Section title="Vagas mais analisadas">
              <RankList items={data.topJobs} unit="análises" />
            </Section>

            <Section
              title="Lacunas mais recorrentes"
              note="Competências marcadas como não identificadas nos resultados do período. Indicam temas para oficinas e orientação, não que os alunos não dominem a competência."
            >
              <RankList items={data.topGaps} unit="ocorrências" />
            </Section>
          </>
        )}

        <Section
          title="Competências mais pedidas nas vagas"
          note="Considera todas as vagas do catálogo e não muda com o período."
        >
          <RankList items={catalogSkills} unit="vagas" />
        </Section>
      </View>

      <Text style={styles.footer}>
        O painel mostra uso e preparação. Ele não acompanha processos
        seletivos, contratação ou aprovação.
      </Text>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  demoNotice: { marginTop: 16 },

  filter: {
    gap: 8,
    marginTop: 24,
  },

  filterLabel: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },

  tiles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 20,
  },

  sections: {
    gap: 16,
    marginTop: 20,
  },

  sectionsWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  section: {
    flexGrow: 1,
  },

  note: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
  },

  empty: {
    color: colors.muted,
    fontSize: 15,
    marginTop: 20,
  },

  footer: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 24,
  },
});
