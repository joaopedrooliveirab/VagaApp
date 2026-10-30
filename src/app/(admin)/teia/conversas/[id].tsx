import { useLocalSearchParams } from 'expo-router';

import { ConversationScreen } from '../../../../components/ConversationScreen';

export default function AdminConversationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ConversationScreen key={id} conversationId={id} />;
}
