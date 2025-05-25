import {combineReducers} from '@reduxjs/toolkit';
import chatReducer from './slices/chatSlice';

const rootReducer = combineReducers({
  chat: chatReducer,
  // Add feature reducers here as we create them
});

export default rootReducer;
