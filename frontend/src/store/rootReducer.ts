import {combineReducers} from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';
import familyReducer from './slices/familySlice';

const rootReducer = combineReducers({
  chat: chatReducer,
  family: familyReducer,
  // Add feature reducers here as we create them
});

export default rootReducer;
