import { useLocalSearchParams } from 'expo-router';

import { ConversationScreen } from '../../../../components/ConversationScreen';

export default function CompanyConversationRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ConversationScreen key={id} conversationId={id} />;
}
