import { useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { BackControl } from '../../../components/BackControl';
import { Button } from '../../../components/Button';
import { Screen } from '../../../components/Screen';
import { Tag } from '../../../components/Tag';
import { Title } from '../../../components/Title';
import { sharedStyles } from '../../../constants/theme';
import { useAuth } from '../../../context/AuthContext';
import { useCompanies } from '../../../context/CompaniesContext';

export default function CompanyRequestsScreen() {
  const { user, approveCompany } = useAuth();
  const { companies } = useCompanies();
  const processing = useRef(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  if (user?.role !== 'administrativo') return null;

  const pending = companies.filter((company) => company.status === 'pending');

  function handleApprove(companyId: string, name: string) {
    if (processing.current) return;
    processing.current = true;
    try {
      const result = approveCompany(companyId);
      setFeedback(result.ok ? `${name}: empresa aprovada.` : '');
      setError(result.ok ? '' : result.message);
    } finally {
      processing.current = false;
    }
  }

  return (
    <Screen centered={false} maxWidth={640} wideMaxWidth={760}>
      <BackControl label="Painel TEIA" href="/dashboard" />
      <Title>Solicitações de empresas</Title>
      <Text style={sharedStyles.subtitle}>Analise as solicitações para liberar o acesso empresarial.</Text>
      {!!feedback && <Text style={sharedStyles.body} accessibilityRole="alert" accessibilityLiveRegion="polite">{feedback}</Text>}
      {!!error && <Text style={sharedStyles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">{error}</Text>}
      <View style={styles.list}>
        {pending.length === 0 ? <Text style={sharedStyles.muted}>Nenhuma solicitação pendente.</Text> : pending.map((company) => (
          <View key={company.id} style={sharedStyles.card}>
            <Text style={sharedStyles.sectionTitle}>{company.name}</Text>
            <Text style={sharedStyles.body}>Responsável: {company.responsibleName}</Text>
            <Text style={sharedStyles.body}>{company.email}</Text>
            <Text style={sharedStyles.muted}>Solicitada em: {new Date(company.requestedAt).toLocaleString('pt-BR')}</Text>
            <Tag label="Aguardando aprovação" />
            <Button title="Aprovar empresa" onPress={() => handleApprove(company.id, company.name)} />
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ list: { gap: 16, marginTop: 20 } });
