export interface Analysis {
  industry: string;
  stage: string;
  valueProposition: string;
  score: {
    rating: number;
    strengths: string[];
    improvements: string[];
    overall: string;
  };
  timestamp: string;
}

export interface ComparisonData {
  industry: string;
  avgScore: number;
  topStrengths: string[];
  commonImprovements: string[];
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
} 