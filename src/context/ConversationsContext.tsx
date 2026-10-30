import { createContext, useContext, useReducer, type ReactNode } from 'react';

import { getCompanyJobById } from '../features/companies/jobs';
import {
  canAccessConversation,
  conversationIdFor,
  conversationReducer,
  visibleConversations,
} from '../features/conversations/conversations';
import type { Conversation } from '../features/conversations/types';
import { useAuth } from './AuthContext';

type ConversationsData = {
  conversations: Conversation[];
  openConversation: (jobId: string) => string | null;
  getConversation: (id: string) => Conversation | undefined;
  sendMessage: (id: string, text: string) => boolean;
};

const ConversationsContext = createContext<ConversationsData | undefined>(undefined);

export function ConversationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(conversationReducer, []);
  const conversations = visibleConversations(state, user);

  function getConversation(id: string) {
    return conversations.find((item) => item.id === id);
  }

  function openConversation(jobId: string) {
    const job = getCompanyJobById(jobId);
    if (user?.role !== 'empresa' || !job || job.companyId !== user.companyId) {
      return null;
    }

    dispatch({ type: 'open', user, jobId, now: new Date().toISOString() });
    return conversationIdFor(job.companyId, job.id);
  }

  function sendMessage(id: string, text: string) {
    const conversation = getConversation(id);
    if (!text.trim() || !conversation || !canAccessConversation(user, conversation)) {
      return false;
    }

    dispatch({ type: 'send', user, conversationId: id, text, now: new Date().toISOString() });
    return true;
  }

  return (
    <ConversationsContext.Provider value={{ conversations, getConversation, openConversation, sendMessage }}>
      {children}
    </ConversationsContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationsContext);
  if (!context) {
    throw new Error('useConversations deve ser utilizado dentro de ConversationsProvider.');
  }
  return context;
}
