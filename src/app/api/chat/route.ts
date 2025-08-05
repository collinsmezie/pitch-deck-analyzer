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
  
  let context = `Pitch Deck Analysis:\n`;
  
  if (analysis) {
    context += `Industry: ${analysis.industry}\n`;
    context += `Stage: ${analysis.stage}\n`;
    context += `Score: ${analysis.score?.rating}/5.0 (${analysis.score?.overall})\n`;
    
    if (analysis.score?.strengths?.length > 0) {
      context += `Strengths: ${analysis.score.strengths.slice(0, 3).join('; ')}\n`;
    }
    
    if (analysis.score?.improvements?.length > 0) {
      context += `Improvements: ${analysis.score.improvements.slice(0, 3).join('; ')}\n`;
    }

    // Add web search insights to context (limited to 2 results)
    if (analysis.webSearchResults && analysis.webSearchResults.length > 0) {
      context += `Market Insights: ${analysis.webSearchResults.slice(0, 2).map(r => r.snippet.substring(0, 150)).join('; ')}\n`;
    }
  }
  
  // Add relevant pitch deck content (limited to 1000 characters)
  if (pitchDeckText) {
    context += `Content: ${pitchDeckText.substring(0, 1000)}...\n`;
  }
  
  context += `Provide specific, actionable advice. Be comprehensive but concise.`;
  
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
          content: `You are an expert startup advisor and investor relations specialist. You help founders improve their pitch decks and investor readiness. Always provide specific, actionable advice based on the context provided. Be encouraging but honest about areas that need improvement. Keep responses comprehensive but concise. Always complete your thoughts and provide actionable next steps.`
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${question}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.7
    });

    let response = completion.choices[0]?.message?.content || 'Unable to generate response';
    
    // Check if response was truncated
    if (completion.choices[0]?.finish_reason === 'length') {
      console.log('⚠️ AI Response: Response was truncated, attempting to complete');
      response += '\n\n[Response was cut off due to length. Please ask a follow-up question for more details.]';
    }
    
    console.log(`🤖 AI Response: Generated response with ${response.length} characters`);
    
    return response;
    
  } catch (error) {
    console.error('❌ AI Response: Error generating response:', error);
    return 'I apologize, but I encountered an error while processing your question. Please try again.';
  }
} 