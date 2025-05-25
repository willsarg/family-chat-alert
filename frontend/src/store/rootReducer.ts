import {combineReducers} from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import familyReducer from './slices/familySlice';
import settingsReducer from './slices/settingsSlice';

const rootReducer = combineReducers({
  chat: chatReducer,
  family: familyReducer,
  settings: settingsReducer,
  // Add feature reducers here as we create them
});

export default rootReducer;
