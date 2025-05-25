import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {sampleChats} from './sampleData';
import {ChatEntity, ChatState, Message} from './types';

const initialState: ChatEntity = sampleChats;

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setChat: (
      state,
      action: PayloadAction<{number: string; chat: ChatState}>,
    ) => {
      const {number, chat} = action.payload;
      state[number] = chat;
    },
    addMessage: (
      state,
      action: PayloadAction<{
        number: string;
        message: Message;
      }>,
    ) => {
      const {number, message} = action.payload;
      if (!state[number]) {
        // Create new chat if it doesn't exist
        state[number] = {
          risk_level: 'low',
          flagged: false,
          flag_label: '',
          messages: [],
        };
      }
      state[number].messages.push(message);
    },
    updateRiskLevel: (
      state,
      action: PayloadAction<{
        number: string;
        risk_level: ChatState['risk_level'];
      }>,
    ) => {
      const {number, risk_level} = action.payload;
      if (state[number]) {
        state[number].risk_level = risk_level;
      }
    },
    updateFlagStatus: (
      state,
      action: PayloadAction<{
        number: string;
        flagged: boolean;
        flag_label: string;
      }>,
    ) => {
      const {number, flagged, flag_label} = action.payload;
      if (state[number]) {
        state[number].flagged = flagged;
        state[number].flag_label = flag_label;
      }
    },
  },
});

export const {setChat, addMessage, updateRiskLevel, updateFlagStatus} =
  chatSlice.actions;

export default chatSlice.reducer;
