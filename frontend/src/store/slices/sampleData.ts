import type {ChatEntity} from './types';

export const sampleChats: ChatEntity = {
  '1234567890': {
    risk_level: 'low',
    flagged: false,
    flag_label: '',
    messages: [
      {
        message: 'Hi Mom, how are you doing today?',
        timestamp: '2024-03-20T10:00:00Z',
      },
      {
        message: "I'm good dear! Just finished my morning walk. How about you?",
        timestamp: '2024-03-20T10:02:00Z',
      },
      {
        message:
          "I'm doing well! Just wanted to check in and see if you need anything from the store?",
        timestamp: '2024-03-20T10:03:00Z',
      },
    ],
  },
  '9876543210': {
    risk_level: 'high',
    flagged: true,
    flag_label: 'scam',
    messages: [
      {
        message:
          'URGENT: Your Amazon account has been suspended. Click here to verify: bit.ly/suspicious-link',
        timestamp: '2024-03-20T09:00:00Z',
      },
      {
        message:
          'This is your last warning. Your account will be permanently deleted in 24 hours.',
        timestamp: '2024-03-20T09:01:00Z',
      },
    ],
  },
  '5551234567': {
    risk_level: 'medium',
    flagged: true,
    flag_label: 'unknown_number',
    messages: [
      {
        message: 'Hello, is this John?',
        timestamp: '2024-03-20T11:00:00Z',
      },
      {
        message: 'I think you have the wrong number. This is Sarah.',
        timestamp: '2024-03-20T11:01:00Z',
      },
      {
        message: 'Sorry about that! Have a great day!',
        timestamp: '2024-03-20T11:02:00Z',
      },
    ],
  },
  '8889990000': {
    risk_level: 'low',
    flagged: false,
    flag_label: '',
    messages: [
      {
        message: 'Hey Dad, are we still on for dinner tomorrow?',
        timestamp: '2024-03-20T14:00:00Z',
      },
      {
        message:
          'Yes, looking forward to it! Should we try that new Italian place?',
        timestamp: '2024-03-20T14:05:00Z',
      },
      {
        message: "Sounds perfect! I'll make a reservation for 7pm.",
        timestamp: '2024-03-20T14:10:00Z',
      },
    ],
  },
};
