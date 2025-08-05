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
  webSearchResults?: WebSearchResult[];
  timestamp: string;
}

export interface WebSearchResult {
  query: string;
  title: string;
  snippet: string;
  url: string;
  type: 'investor_criteria' | 'pitch_deck_requirements' | 'market_research';
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