import type { User } from '../auth/auth';
import { getCompanyById } from '../companies/companies';
import { getCompanyJobById } from '../companies/jobs';
import type { Conversation } from './types';

export function conversationIdFor(companyId: string, jobId: string) {
  return `${encodeURIComponent(companyId)}--${encodeURIComponent(jobId)}`;
}

// Controle demonstrativo local. Não substitui autorização em um servidor.
export function canAccessConversation(user: User | null, conversation: Conversation) {
  const job = getCompanyJobById(conversation.jobId);
  if (!job || job.companyId !== conversation.companyId || !getCompanyById(conversation.companyId)) {
    return false;
  }

  return user?.role === 'administrativo' ||
    (user?.role === 'empresa' && user.companyId === conversation.companyId);
}

export function ensureConversation(
  conversations: Conversation[], user: User | null, jobId: string, now: string,
): Conversation[] {
  const job = getCompanyJobById(jobId);
  if (user?.role !== 'empresa' || !job || job.companyId !== user.companyId) {
    return conversations;
  }

  const id = conversationIdFor(job.companyId, job.id);
  if (conversations.some((item) => item.companyId === job.companyId && item.jobId === job.id)) {
    return conversations;
  }

  return [...conversations, {
    id, companyId: job.companyId, jobId: job.id,
    createdAt: now, updatedAt: now, messages: [],
  }];
}

export function appendMessage(
  conversations: Conversation[], user: User | null,
  conversationId: string, text: string, now: string,
): Conversation[] {
  const conversation = conversations.find((item) => item.id === conversationId);
  const trimmed = text.trim();
  if (!conversation || !trimmed || !canAccessConversation(user, conversation) ||
      !user || user.role === 'aluno') {
    return conversations;
  }
  const senderRole = user.role;

  return conversations.map((item) => item.id !== conversationId ? item : {
    ...item,
    updatedAt: now,
    messages: [...item.messages, {
      id: `${conversationId}:message-${item.messages.length + 1}`,
      conversationId,
      senderId: user.id,
      senderName: user.name,
      senderRole,
      text: trimmed,
      sentAt: now,
    }],
  });
}

export function visibleConversations(conversations: Conversation[], user: User | null) {
  return conversations.filter((item) => canAccessConversation(user, item))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.id.localeCompare(b.id));
}

export type ConversationAction =
  | { type: 'open'; user: User | null; jobId: string; now: string }
  | { type: 'send'; user: User | null; conversationId: string; text: string; now: string };

export function conversationReducer(state: Conversation[], action: ConversationAction) {
  return action.type === 'open'
    ? ensureConversation(state, action.user, action.jobId, action.now)
    : appendMessage(state, action.user, action.conversationId, action.text, action.now);
}
