import axios from 'axios';
import {
  evaluateMessageRisk,
  getRiskExplanation,
  type RiskEvaluation,
} from '../utils/riskKeywords';

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

const API_ENDPOINT =
  'https://family-chat-alert.onrender.com/api/receiveTest:5001';

/**
 * Evaluates and sends a message to the API endpoint
 * @param message The message to evaluate
 * @param phoneNumber The phone number associated with the message
 * @returns Promise with the evaluation result
 */
export const evaluateMessage = async (
  message: string,
  phoneNumber: string,
): Promise<MessageEvaluation> => {
  try {
    // First perform keyword-based risk evaluation
    const keywordEvaluation = evaluateMessageRisk(message);
    const riskExplanation = getRiskExplanation(keywordEvaluation);

    // Create the message evaluation payload
    const payload: MessageEvaluation = {
      number: phoneNumber,
      risk_level: keywordEvaluation.riskLevel, // Use keyword evaluation risk level
      flagged: keywordEvaluation.isRisky, // Use keyword evaluation flag status
      flag_label: keywordEvaluation.isRisky ? 'suspicious_content' : undefined,
      risk_explanation: riskExplanation,
      keyword_evaluation: keywordEvaluation,
      messages: [
        {
          message,
          timestamp: new Date().toISOString(),
        },
      ],
    };

    // Send the message to the API endpoint
    const response = await axios.post(API_ENDPOINT, payload);

    // Combine API response with our keyword evaluation
    const apiEvaluation = response.data as MessageEvaluation;

    // If API flags the message as more risky than our keyword evaluation,
    // use the API's risk level and flag status
    if (
      apiEvaluation.risk_level === 'high' ||
      (apiEvaluation.risk_level === 'medium' &&
        keywordEvaluation.riskLevel === 'low')
    ) {
      return {
        ...apiEvaluation,
        risk_explanation: riskExplanation,
        keyword_evaluation: keywordEvaluation,
      };
    }

    // Otherwise, use our keyword evaluation results
    return payload;
  } catch (error) {
    console.error('Error evaluating message:', error);
    // If API call fails, still return our keyword evaluation
    const keywordEvaluation = evaluateMessageRisk(message);
    return {
      number: phoneNumber,
      risk_level: keywordEvaluation.riskLevel,
      flagged: keywordEvaluation.isRisky,
      flag_label: keywordEvaluation.isRisky ? 'suspicious_content' : undefined,
      risk_explanation: getRiskExplanation(keywordEvaluation),
      keyword_evaluation: keywordEvaluation,
      messages: [
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
