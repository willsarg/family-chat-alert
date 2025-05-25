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

export interface FamilyMember {
  id: string;
  name: string;
  email: string;
}

export interface FamilyState {
  members: FamilyMember[];
}
