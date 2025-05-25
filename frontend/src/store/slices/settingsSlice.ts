import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ApprovedNumber, SettingsState} from './types';

const initialState: SettingsState = {
  approvedNumbers: [
    {
      id: '1',
      number: '1234567890',
      name: 'Mom',
    },
    {
      id: '2',
      number: '9876543210',
      name: 'Dad',
    },
  ],
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    addApprovedNumber: (
      state,
      action: PayloadAction<Omit<ApprovedNumber, 'id'>>,
    ) => {
      const newNumber = {
        ...action.payload,
        id: Date.now().toString(),
      };
      state.approvedNumbers.push(newNumber);
    },
    removeApprovedNumber: (state, action: PayloadAction<string>) => {
      state.approvedNumbers = state.approvedNumbers.filter(
        number => number.id !== action.payload,
      );
    },
    updateApprovedNumber: (state, action: PayloadAction<ApprovedNumber>) => {
      const index = state.approvedNumbers.findIndex(
        number => number.id === action.payload.id,
      );
      if (index !== -1) {
        state.approvedNumbers[index] = action.payload;
      }
    },
  },
});

// Selectors
export const selectIsNumberApproved = (
  state: {settings: SettingsState},
  phoneNumber: string,
) =>
  state.settings.approvedNumbers.some(number => number.number === phoneNumber);

export const {addApprovedNumber, removeApprovedNumber, updateApprovedNumber} =
  settingsSlice.actions;

export default settingsSlice.reducer;
