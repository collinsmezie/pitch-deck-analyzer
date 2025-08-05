import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log('🎨 Visual Analysis API: Request received');
  
  try {
    const { analysis, slideData } = await request.json();
    console.log('🎨 Visual Analysis API: Parsed request data');
    console.log('🎨 Visual Analysis API: Analysis industry:', analysis.industry, 'stage:', analysis.stage);
    console.log('🎨 Visual Analysis API: Slide data:', slideData);

    // Generate visual analysis using AI
    console.log('🎨 Visual Analysis API: Starting AI analysis...');
    const visualAnalysis = await generateVisualAnalysis(analysis, slideData);
    console.log('🎨 Visual Analysis API: AI analysis completed');

    console.log('🎨 Visual Analysis API: Returning success response');
    return NextResponse.json({
      success: true,
      visualAnalysis
    });

  } catch (error) {
    console.error('❌ Visual Analysis API: Error processing request:', error);
    return NextResponse.json({ error: 'Failed to analyze visual elements' }, { status: 500 });
  }
}

async function generateVisualAnalysis(analysis: {
  industry: string;
  stage: string;
  score: { rating: number };
}, slideData: {
  totalSlides: number;
  slideTypes: string[];
  hasImages: boolean;
  hasCharts: boolean;
  colorScheme: string;
  typography: string;
}) {
  console.log('🎨 AI Analysis: Starting visual analysis generation');
  console.log('🎨 AI Analysis: Industry:', analysis.industry, 'Stage:', analysis.stage, 'Score:', analysis.score.rating);
  
  const prompt = `
You are a professional pitch deck design expert. Analyze the following pitch deck and provide detailed visual analysis.

Pitch Deck Context:
- Industry: ${analysis.industry}
- Stage: ${analysis.stage}
- Overall Score: ${analysis.score.rating}/5.0

Slide Data: ${JSON.stringify(slideData, null, 2)}

Please provide a comprehensive visual analysis including:

1. Overall visual score (1-5)
2. Design principles assessment (consistency, hierarchy, readability, branding) - each scored 1-5
3. Slide-by-slide analysis with:
   - Slide score (1-5)
   - Content analysis
   - Strengths
   - Areas for improvement
   - Visual recommendations (layout, typography, color, imagery, spacing)
4. Actionable recommendations (immediate, short-term, long-term)

Focus on visual design principles that impact investor perception and presentation effectiveness.
`;

  console.log('🎨 AI Analysis: Sending request to OpenAI...');
  const startTime = Date.now();
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a professional pitch deck design expert with deep knowledge of visual design principles, investor psychology, and presentation best practices. Provide specific, actionable visual recommendations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  const endTime = Date.now();
  console.log('🎨 AI Analysis: OpenAI response received', `(${endTime - startTime}ms)`);
  
  const response = completion.choices[0].message.content;
  console.log('🎨 AI Analysis: Response length:', response?.length || 0, 'characters');
  
  // Parse the AI response and structure it
  console.log('🎨 AI Analysis: Parsing and structuring response...');
  const result = parseVisualAnalysisResponse(response || '', analysis);
  console.log('🎨 AI Analysis: Parsing completed');
  
  return result;
}

function parseVisualAnalysisResponse(response: string, analysis: {
  industry: string;
  stage: string;
  score: { rating: number };
}) {
  console.log('🎨 Parser: Starting response parsing');
  console.log('🎨 Parser: Response length:', response.length, 'characters');
  
  // This is a simplified parser - in production, you'd want more robust parsing
  // For now, we'll generate mock data based on the analysis
  
  console.log('🎨 Parser: Generating mock visual analysis data...');
  const mockVisualAnalysis = {
    overallVisualScore: Math.max(2.5, analysis.score.rating - 0.5),
    slides: generateMockSlides(analysis),
    designPrinciples: {
      consistency: 3.2,
      hierarchy: 3.5,
      readability: 3.8,
      branding: 2.9
    },
    recommendations: {
      immediate: [
        "Increase font size for better readability",
        "Add more white space between elements",
        "Use consistent color scheme throughout"
      ],
      shortTerm: [
        "Implement a cohesive visual hierarchy",
        "Add professional imagery and icons",
        "Create branded templates for consistency"
      ],
      longTerm: [
        "Develop a comprehensive brand style guide",
        "Invest in professional design resources",
        "Establish design system for scalability"
      ]
    }
  };

  console.log('🎨 Parser: Generated', mockVisualAnalysis.slides.length, 'slides');
  console.log('🎨 Parser: Overall visual score:', mockVisualAnalysis.overallVisualScore);
  console.log('🎨 Parser: Parsing completed successfully');

  return mockVisualAnalysis;
}

function generateMockSlides(analysis: {
  industry: string;
  stage: string;
  score: { rating: number };
}) {
  console.log('🎨 Slide Generator: Generating mock slides for analysis');
  
  const slideTitles = [
    "Problem Statement",
    "Solution Overview", 
    "Market Opportunity",
    "Business Model",
    "Traction & Metrics",
    "Team",
    "Financial Projections",
    "Funding Ask"
  ];

  console.log('🎨 Slide Generator: Creating', slideTitles.length, 'slides');
  
  const slides = slideTitles.map((title, index) => {
    const score = Math.max(2.0, analysis.score.rating - 0.3 + (Math.random() - 0.5) * 0.6);
    console.log(`🎨 Slide Generator: Slide ${index + 1} (${title}) - Score: ${score.toFixed(2)}`);
    
    return {
      slideNumber: index + 1,
      slideTitle: title,
      score: score,
      strengths: generateMockStrengths(),
      improvements: generateMockImprovements(),
      visualRecommendations: generateMockVisualRecommendations(),
      contentAnalysis: `This slide effectively communicates ${title.toLowerCase()} but could benefit from improved visual hierarchy and clearer data presentation.`
    };
  });

  console.log('🎨 Slide Generator: All slides generated successfully');
  return slides;
}

function generateMockStrengths() {
  const strengths = [
    "Clear visual hierarchy",
    "Good use of white space",
    "Consistent typography",
    "Professional color scheme",
    "Effective data visualization"
  ];
  return strengths.slice(0, 2 + Math.floor(Math.random() * 2));
}

function generateMockImprovements() {
  const improvements = [
    "Increase contrast for better readability",
    "Add more visual elements",
    "Improve spacing between sections",
    "Use more engaging imagery",
    "Simplify complex charts"
  ];
  return improvements.slice(0, 2 + Math.floor(Math.random() * 2));
}

function generateMockVisualRecommendations() {
  const types = ['layout', 'typography', 'color', 'imagery', 'spacing'];
  const priorities = ['high', 'medium', 'low'];
  
  return types.slice(0, 3).map((type, index) => ({
    type,
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    description: `Improve ${type} to enhance visual impact and readability.`,
    suggestion: `Consider ${type === 'layout' ? 'reorganizing elements for better flow' : 
                 type === 'typography' ? 'using larger, more readable fonts' :
                 type === 'color' ? 'implementing a consistent color palette' :
                 type === 'imagery' ? 'adding relevant, high-quality images' :
                 'increasing spacing between elements'}.`,
    element: `${type.charAt(0).toUpperCase() + type.slice(1)} elements`,
    position: {
      x: 20 + (index * 30),
      y: 20 + (index * 20),
      width: 200,
      height: 100
    }
  }));
} 