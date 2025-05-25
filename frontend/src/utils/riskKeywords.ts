// Categories of risky keywords
const RISK_KEYWORDS = {
  financial: [
    'bank account',
    'credit card',
    'social security',
    'ssn',
    'password',
    'verify account',
    'account suspended',
    'wire transfer',
    'bitcoin',
    'crypto',
    'investment',
    'lottery',
    'inheritance',
    'prize money',
    'urgent payment',
    'overdue payment',
    'account verification',
    'bank verification',
    'card verification',
    'verify identity',
  ],
  urgency: [
    'urgent',
    'immediately',
    'right now',
    'asap',
    'emergency',
    'last warning',
    'final notice',
    'expiring soon',
    'act now',
    'limited time',
    'today only',
    '24 hours',
    '48 hours',
    'immediate action required',
    'your account will be',
    'your account has been',
    'suspended',
    'blocked',
    'locked',
    'deleted',
  ],
  suspicious: [
    'click here',
    'verify now',
    'confirm now',
    'unusual activity',
    'suspicious activity',
    'unusual login',
    'suspicious login',
    'verify your identity',
    'confirm your identity',
    'verify your account',
    'confirm your account',
    'verify your information',
    'confirm your information',
    'verify your details',
    'confirm your details',
    'verify your data',
    'confirm your data',
    'verify your credentials',
    'confirm your credentials',
    'verify your password',
    'confirm your password',
  ],
  phishing: [
    'verify email',
    'confirm email',
    'verify phone',
    'confirm phone',
    'verify number',
    'confirm number',
    'verify address',
    'confirm address',
    'verify location',
    'confirm location',
    'verify device',
    'confirm device',
    'verify browser',
    'confirm browser',
    'verify ip',
    'confirm ip',
    'verify login',
    'confirm login',
    'verify access',
    'confirm access',
  ],
};

// Export the interface
export interface RiskEvaluation {
  isRisky: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  matchedKeywords: string[];
  categories: string[];
}

/**
 * Evaluates a message against known risk keywords
 * @param message The message to evaluate
 * @returns RiskEvaluation object with risk assessment
 */
export const evaluateMessageRisk = (message: string): RiskEvaluation => {
  const lowerMessage = message.toLowerCase();
  const matchedKeywords: string[] = [];
  const matchedCategories = new Set<string>();

  // Check each category of keywords
  Object.entries(RISK_KEYWORDS).forEach(([category, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
        matchedCategories.add(category);
      }
    });
  });

  // Determine risk level based on number of matches and categories
  let riskLevel: 'low' | 'medium' | 'high' = 'low';

  if (matchedKeywords.length > 0) {
    if (matchedCategories.size >= 3 || matchedKeywords.length >= 5) {
      riskLevel = 'high';
    } else if (matchedCategories.size >= 2 || matchedKeywords.length >= 3) {
      riskLevel = 'medium';
    } else {
      riskLevel = 'low';
    }
  }

  return {
    isRisky: matchedKeywords.length > 0,
    riskLevel,
    matchedKeywords,
    categories: Array.from(matchedCategories),
  };
};

/**
 * Gets a human-readable explanation of why a message was flagged
 * @param evaluation The risk evaluation result
 * @returns A string explaining the risk assessment
 */
export const getRiskExplanation = (evaluation: RiskEvaluation): string => {
  if (!evaluation.isRisky) {
    return 'No suspicious content detected';
  }

  const categoryExplanations: {[key: string]: string} = {
    financial: 'Contains financial-related terms',
    urgency: 'Uses urgent or threatening language',
    suspicious: 'Contains suspicious verification requests',
    phishing: 'Contains potential phishing indicators',
  };

  const explanations = evaluation.categories
    .map(category => categoryExplanations[category])
    .join(', ');

  return `Message flagged as ${
    evaluation.riskLevel
  } risk: ${explanations}. Matched keywords: ${evaluation.matchedKeywords.join(
    ', ',
  )}`;
};
