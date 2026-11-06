import { Fragment, useRef, useState } from 'react';
import {
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
  Text, TextInput, View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, sharedStyles } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useConversations } from '../context/ConversationsContext';
import { getCompanyById } from '../features/companies/companies';
import { getCompanyJobById } from '../features/companies/jobs';
import { Button } from './Button';
import { BackControl } from './BackControl';
import { EmptyState } from './EmptyState';
import { Screen } from './Screen';

function dateLabel(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

export function ConversationScreen({ conversationId }: { conversationId: string }) {
  const { user } = useAuth();
  const { getConversation, sendMessage } = useConversations();
  const [draft, setDraft] = useState('');
  const [error, setError] = useState('');
  const history = useRef<ScrollView>(null);
  const followLatest = useRef(true);
  const insets = useSafeAreaInsets();

  const conversation = getConversation(conversationId);
  const job = conversation && getCompanyJobById(conversation.jobId);
  const company = conversation && getCompanyById(conversation.companyId);
  const companyView = user?.role === 'empresa';
  const backPath = companyView
    ? job ? `/empresa/vagas/${job.id}` as const : '/empresa/vagas'
    : '/teia/conversas';
  const backLabel = companyView ? job ? 'Vaga' : 'Minhas vagas' : 'Conversas';

  if (!conversation || !job || !company) {
    return (
      <Screen centered={false}>
        <BackControl label={backLabel} href={backPath} />
        <EmptyState title="Conversa indisponível"
          message="Esta conversa não existe ou não está disponível para sua conta." />
      </Screen>
    );
  }

  function handleSend() {
    if (!draft.trim()) return;
    followLatest.current = true;
    if (sendMessage(conversationId, draft)) {
      setDraft('');
      setError('');
    } else {
      setError('Não foi possível enviar a mensagem. Abra a conversa novamente.');
    }
  }

  function scrollIfFollowing() {
    if (followLatest.current) history.current?.scrollToEnd({ animated: false });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'android' ? 'height' : undefined}
        keyboardVerticalOffset={insets.top}>
        <View style={styles.container}>
          <View style={styles.header}>
            <BackControl label={backLabel} href={backPath} />
            <Text style={styles.title} accessibilityRole="header">
              {companyView ? 'Conversa com o TEIA' : company.name}
            </Text>
            <Text style={styles.subject}>Sobre: {job.title}</Text>
            <Text style={styles.demo}>Demonstração local · mensagens nesta execução</Text>
          </View>

          <ScrollView ref={history} style={styles.flex} contentContainerStyle={styles.history}
            keyboardShouldPersistTaps="handled" scrollEventThrottle={100}
            onLayout={scrollIfFollowing} onContentSizeChange={scrollIfFollowing}
            onScroll={({ nativeEvent }) => {
              const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
              followLatest.current = contentSize.height - layoutMeasurement.height - contentOffset.y < 80;
            }}>
            {conversation.messages.length === 0 && (
              <View style={styles.empty}>
                <Text style={sharedStyles.sectionTitle}>Inicie a conversa</Text>
                <Text style={styles.emptyText}>
                  {companyView
                    ? 'Envie uma mensagem ao TEIA sobre esta vaga. A equipe poderá responder ao acessar o perfil administrativo nesta demonstração.'
                    : 'Envie uma mensagem à empresa sobre esta vaga.'}
                </Text>
              </View>
            )}
            {conversation.messages.map((message, index) => {
              const sent = message.senderRole === user?.role;
              const label = dateLabel(message.sentAt);
              const previous = conversation.messages[index - 1];
              return (
                <Fragment key={message.id}>
                  {(!previous || dateLabel(previous.sentAt) !== label) && (
                    <Text style={styles.date}>{label}</Text>
                  )}
                  <View style={[styles.bubble, sent ? styles.sent : styles.received]}>
                    <Text style={styles.sender}>{message.senderName}</Text>
                    <Text style={styles.message} selectable>{message.text}</Text>
                    <Text style={styles.time}>
                      {new Date(message.sentAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                </Fragment>
              );
            })}
          </ScrollView>

          <View style={styles.composerArea}>
            {!!error && <Text style={sharedStyles.error} accessibilityRole="alert">{error}</Text>}
            <View style={styles.composer}>
              <TextInput multiline value={draft} placeholder="Escreva uma mensagem..."
                accessibilityLabel="Mensagem" placeholderTextColor={colors.muted}
                style={styles.input} textAlignVertical="top"
                onChangeText={(value) => { setDraft(value); setError(''); }}
              />
              <Button title="Enviar" disabled={!draft.trim()} onPress={handleSend} />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, minHeight: 0 },
  safe: { flex: 1, backgroundColor: colors.surface },
  container: { flex: 1, minHeight: 0, width: '100%', maxWidth: 800, alignSelf: 'center' },
  header: { padding: 16, gap: 6, backgroundColor: colors.background, borderBottomWidth: 1, borderColor: colors.border },
  title: { color: colors.text, fontSize: 20, fontWeight: '700' },
  subject: { color: colors.text, fontSize: 15, lineHeight: 21 },
  demo: { color: colors.muted, fontSize: 12, lineHeight: 18 },
  history: { flexGrow: 1, padding: 16, gap: 12 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 32, gap: 12 },
  emptyText: { color: colors.muted, fontSize: 15, lineHeight: 22, textAlign: 'center', maxWidth: 480 },
  date: { alignSelf: 'center', color: colors.muted, fontSize: 12, marginVertical: 8 },
  bubble: { maxWidth: '88%', minWidth: 100, padding: 12, gap: 6, borderRadius: 12, borderWidth: 1 },
  sent: { alignSelf: 'flex-end', backgroundColor: colors.veryLight, borderColor: colors.lightCoral },
  received: { alignSelf: 'flex-start', backgroundColor: colors.background, borderColor: colors.border },
  sender: { color: colors.text, fontSize: 13, fontWeight: '700' },
  message: { color: colors.text, fontSize: 16, lineHeight: 23, flexShrink: 1 },
  time: { color: colors.muted, fontSize: 12, alignSelf: 'flex-end' },
  composerArea: { padding: 12, gap: 8, backgroundColor: colors.background, borderTopWidth: 1, borderColor: colors.border },
  composer: { flexDirection: 'row', gap: 10, alignItems: 'flex-end' },
  input: { flex: 1, minWidth: 0, minHeight: 52, maxHeight: 132, borderWidth: 1, borderColor: colors.border,
    borderRadius: 12, padding: 12, color: colors.text, backgroundColor: colors.surface, fontSize: 16 },
});
