import axios from 'axios';
import {type RiskEvaluation} from '../utils/riskKeywords';

// Types based on messageformat.json
interface Message {
  message: string;
  timestamp: string;
}

interface MessageEvaluation {
  number: string;
  risk_level: 'low' | 'medium' | 'high';
  flagged: boolean;
  flag_label?: string;
  messages: Message[];
  risk_explanation?: string;
  keyword_evaluation?: RiskEvaluation;
}

const API_ENDPOINT = 'https://family-chat-alert.onrender.com/api/receiveText';

/**
 * Sends a message and its chat context to the API endpoint for evaluation
 * @param message The new message to evaluate
 * @param phoneNumber The phone number associated with the message
 * @param chatHistory Array of previous messages in the chat for context
 * @returns Promise with the evaluation result
 */
export const evaluateMessage = async (
  message: string,
  phoneNumber: string,
  chatHistory: Message[] = [], // Optional chat history, defaults to empty array
): Promise<MessageEvaluation> => {
  try {
    console.log('Starting message evaluation for:', {
      message,
      phoneNumber,
      chatHistoryLength: chatHistory.length,
    });

    // Create payload with the new message and chat history
    const payload: MessageEvaluation = {
      number: phoneNumber,
      risk_level: 'low', // Default value, will be overridden by API
      flagged: false, // Default value, will be overridden by API
      messages: [
        ...chatHistory, // Include previous messages
        {
          message,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Send the message and context to the API endpoint
    const response = await axios.post(API_ENDPOINT, payload);

    const apiEvaluation = response.data as MessageEvaluation;

    return apiEvaluation;
  } catch (error) {
    console.error('Error sending message to API:', error);
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
        },
      });
    }

    // Return a basic evaluation in case of error
    return {
      number: phoneNumber,
      risk_level: 'low',
      flagged: false,
      messages: [
        ...chatHistory,
        {
          message,
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
};

/**
 * Helper function to check if a message evaluation indicates a risk
 * @param evaluation The message evaluation result
 * @returns boolean indicating if the message is risky
 */
export const isMessageRisky = (evaluation: MessageEvaluation): boolean => {
  return evaluation.flagged || evaluation.risk_level !== 'low';
};
