import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {FamilyMember, FamilyState} from './types';

const initialState: FamilyState = {
  members: [
    {
      id: '1',
      name: 'Mom',
      email: 'mom@example.com',
    },
    {
      id: '2',
      name: 'Dad',
      email: 'dad@example.com',
    },
  ],
};

const familySlice = createSlice({
  name: 'family',
  initialState,
  reducers: {
    addFamilyMember: (
      state,
      action: PayloadAction<Omit<FamilyMember, 'id'>>,
    ) => {
      const newMember = {
        ...action.payload,
        id: Date.now().toString(), // Simple ID generation
      };
      state.members.push(newMember);
    },
    removeFamilyMember: (state, action: PayloadAction<string>) => {
      state.members = state.members.filter(
        member => member.id !== action.payload,
      );
    },
    updateFamilyMember: (state, action: PayloadAction<FamilyMember>) => {
      const index = state.members.findIndex(
        member => member.id === action.payload.id,
      );
      if (index !== -1) {
        state.members[index] = action.payload;
      }
    },
  },
});

export const {addFamilyMember, removeFamilyMember, updateFamilyMember} =
  familySlice.actions;

export default familySlice.reducer;
