import { Message } from '@/components/ChatScene';

export const getConversation = (userName: string): Message[] => [
  { 
    id: 1,
    text: `Halo aku Ayu, owner dari kafe Kopi & Bunga Melati. Apakah benar ini dengan ${userName || 'Anda'}?`,
    sender: 'bot',
    timestamp: new Date(),
    responses: ['Halo salam kenal! Ada yang bisa aku bantu?']
  },
  // Add other conversation messages here
];
