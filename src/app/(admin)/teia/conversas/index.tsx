import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../../components/Button';
import { BackControl } from '../../../../components/BackControl';
import { EmptyState } from '../../../../components/EmptyState';
import { Screen } from '../../../../components/Screen';
import { Title } from '../../../../components/Title';
import { sharedStyles } from '../../../../constants/theme';
import { useAuth } from '../../../../context/AuthContext';
import { useConversations } from '../../../../context/ConversationsContext';
import { getCompanyById } from '../../../../features/companies/companies';
import { getCompanyJobById } from '../../../../features/companies/jobs';

export default function AdminConversationsScreen() {
  const { user } = useAuth();
  const { conversations } = useConversations();
  if (user?.role !== 'administrativo') return null;

  return (
    <Screen centered={false} maxWidth={640} wideMaxWidth={800}>
      <BackControl label="Painel TEIA" href="/dashboard" />
      <View style={styles.heading}>
        <Title>Conversas</Title>
        <Text style={sharedStyles.subtitle}>Comunicação com empresas sobre suas vagas.</Text>
        <Text style={sharedStyles.muted}>Demonstração local · as conversas aparecem quando a empresa entra em contato.</Text>
      </View>
      <View style={styles.list}>
        {conversations.length === 0 ? (
          <EmptyState title="Nenhuma conversa por aqui"
            message="Entre como empresa e use “Conversar com o TEIA” em uma vaga para iniciar a demonstração." />
        ) : conversations.map((conversation) => {
          const company = getCompanyById(conversation.companyId);
          const job = getCompanyJobById(conversation.jobId);
          const lastMessage = conversation.messages[conversation.messages.length - 1];
          return (
            <View key={conversation.id} style={sharedStyles.card}>
              <Text style={sharedStyles.sectionTitle}>{company?.name}</Text>
              <Text style={sharedStyles.body}>Sobre: {job?.title}</Text>
              <Text numberOfLines={2} style={sharedStyles.muted}>
                {lastMessage ? `${lastMessage.senderName}: ${lastMessage.text}` : 'Conversa iniciada · nenhuma mensagem enviada.'}
              </Text>
              <Text style={sharedStyles.muted}>
                {new Date(conversation.updatedAt).toLocaleString('pt-BR', {
                  day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </Text>
              <Button title="Abrir conversa" onPress={() => router.push({
                pathname: '/teia/conversas/[id]', params: { id: conversation.id },
              })} />
            </View>
          );
        })}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  heading: { marginTop: 24 },
  list: { marginTop: 24, gap: 16 },
});
