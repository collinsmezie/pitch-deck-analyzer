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
  visualAnalysis?: VisualAnalysis;
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

export interface SlideAnalysis {
  slideNumber: number;
  slideTitle: string;
  score: number;
  strengths: string[];
  improvements: string[];
  visualRecommendations: VisualRecommendation[];
  contentAnalysis: string;
}

export interface VisualRecommendation {
  type: 'layout' | 'typography' | 'color' | 'imagery' | 'spacing';
  priority: 'high' | 'medium' | 'low';
  description: string;
  suggestion: string;
  element?: string;
  position?: { x: number; y: number; width: number; height: number };
}

export interface VisualAnalysis {
  overallVisualScore: number;
  slides: SlideAnalysis[];
  designPrinciples: {
    consistency: number;
    hierarchy: number;
    readability: number;
    branding: number;
  };
  recommendations: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
} 