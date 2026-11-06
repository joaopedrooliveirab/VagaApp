export type SenderRole = 'empresa' | 'administrativo';

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: SenderRole;
  text: string;
  sentAt: string;
};

export type Conversation = {
  id: string;
  companyId: string;
  jobId: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};
