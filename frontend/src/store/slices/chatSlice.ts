import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {evaluateMessage} from '../../api/messageApi';
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

// Add new thunk action for evaluating messages
export const evaluateAndAddMessage = createAsyncThunk(
  'chat/evaluateAndAddMessage',
  async ({number, message}: {number: string; message: string}, {dispatch}) => {
    try {
      // First add the message to the chat state
      dispatch(
        addMessage({
          number,
          message: {
            message,
            timestamp: new Date().toISOString(),
          },
        }),
      );

      // Evaluate the message using our API
      const evaluation = await evaluateMessage(message, number);

      // Update the chat state with the evaluation results
      dispatch(
        updateRiskLevel({
          number,
          risk_level: evaluation.risk_level,
        }),
      );

      if (evaluation.flagged) {
        dispatch(
          updateFlagStatus({
            number,
            flagged: evaluation.flagged,
            flag_label: evaluation.flag_label || '',
          }),
        );
      }

      return evaluation;
    } catch (error) {
      console.error('Error evaluating message:', error);
      throw error;
    }
  },
);

export default chatSlice.reducer;
