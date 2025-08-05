import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Analysis } from '@/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log('💬 Chat API: Starting chat request processing');
  
  try {
    const { question, pitchDeckText, analysis } = await request.json();
    
    console.log(`💬 Chat API: Received question: "${question}"`);
    console.log(`💬 Chat API: Pitch deck text length: ${pitchDeckText?.length || 0} characters`);

    if (!question) {
      console.log('❌ Chat API: No question provided');
      return NextResponse.json({ error: 'No question provided' }, { status: 400 });
    }

    // Create context from pitch deck analysis
    const context = createContext(pitchDeckText, analysis);
    
    console.log('💬 Chat API: Created context for AI response');

    // Generate response using OpenAI
    const response = await generateResponse(question, context);
    
    console.log('✅ Chat API: Generated response successfully');
    
    return NextResponse.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Chat API: Error processing chat request:', error);
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 });
  }
}

function createContext(pitchDeckText: string, analysis: Analysis): string {
  console.log('🔧 Context Creation: Building context for AI response');
  
  let context = `Pitch Deck Analysis Context:\n\n`;
  
  if (analysis) {
    context += `Industry: ${analysis.industry}\n`;
    context += `Company Stage: ${analysis.stage}\n`;
    context += `Value Proposition: ${analysis.valueProposition}\n`;
    context += `Investor Readiness Score: ${analysis.score?.rating}/5.0\n`;
    context += `Overall Assessment: ${analysis.score?.overall}\n\n`;
    
    if (analysis.score?.strengths?.length > 0) {
      context += `Strengths:\n${analysis.score.strengths.map((s: string) => `- ${s}`).join('\n')}\n\n`;
    }
    
    if (analysis.score?.improvements?.length > 0) {
      context += `Areas for Improvement:\n${analysis.score.improvements.map((i: string) => `- ${i}`).join('\n')}\n\n`;
    }
  }
  
  // Add relevant pitch deck content (first 2000 characters to stay within limits)
  if (pitchDeckText) {
    context += `Pitch Deck Content (excerpt):\n${pitchDeckText.substring(0, 2000)}...\n\n`;
  }
  
  context += `Instructions: Provide specific, actionable advice based on the pitch deck analysis. Focus on practical recommendations that can improve investor readiness.`;
  
  console.log(`🔧 Context Creation: Created context with ${context.length} characters`);
  
  return context;
}

async function generateResponse(question: string, context: string): Promise<string> {
  console.log('🤖 AI Response: Generating response using OpenAI');
  
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert startup advisor and investor relations specialist. You help founders improve their pitch decks and investor readiness. Always provide specific, actionable advice based on the context provided. Be encouraging but honest about areas that need improvement.`
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`
        }
      ],
      max_completion_tokens: 500,
      temperature: 0.7
    });

    const response = completion.choices[0]?.message?.content || 'Unable to generate response';
    
    console.log(`🤖 AI Response: Generated response with ${response.length} characters`);
    
    return response;
    
  } catch (error) {
    console.error('❌ AI Response: Error generating response:', error);
    return 'I apologize, but I encountered an error while processing your question. Please try again.';
  }
} 