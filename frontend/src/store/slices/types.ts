export interface Message {
  message: string;
  timestamp: string;
}

export interface ChatState {
  risk_level: 'low' | 'medium' | 'high';
  flagged: boolean;
  flag_label: string;
  messages: Message[];
}

export interface ChatEntity {
  [number: string]: ChatState;
}
