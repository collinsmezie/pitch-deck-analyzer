import { NextRequest, NextResponse } from 'next/server';
import { Analysis } from '@/types';

export async function POST(request: NextRequest) {
  console.log('💡 Recommendations API: Starting recommendation generation');
  
  try {
    const { analysis, previousQuestions = [] } = await request.json();
    
    console.log(`💡 Recommendations API: Analysis score: ${analysis?.score?.rating}/5.0`);
    console.log(`💡 Recommendations API: Previous questions count: ${previousQuestions.length}`);

    if (!analysis) {
      console.log('❌ Recommendations API: No analysis provided');
      return NextResponse.json({ error: 'No analysis provided' }, { status: 400 });
    }

    const recommendations = generateRecommendations(analysis, previousQuestions);
    
    console.log(`💡 Recommendations API: Generated ${recommendations.length} recommendations`);
    
    return NextResponse.json({
      success: true,
      recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Recommendations API: Error generating recommendations:', error);
    return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
  }
}

function generateRecommendations(analysis: Analysis, previousQuestions: string[]): string[] {
  console.log('🎯 Recommendation Engine: Generating smart question suggestions');
  
  const recommendations: string[] = [];
  const score = analysis.score?.rating || 3.0;
  const industry = analysis.industry || 'Technology';
  const stage = analysis.stage || 'Seed';
  
  // Base recommendations based on score
  if (score < 3.0) {
    recommendations.push(
      'How can I strengthen my financial projections and metrics?',
      'What specific traction metrics should I include for my industry?',
      'How can I better articulate my competitive advantage?'
    );
  } else if (score < 4.0) {
    recommendations.push(
      'What are the key investor criteria for my specific industry?',
      'How can I improve my go-to-market strategy presentation?',
      'What additional team credentials would strengthen my pitch?'
    );
  } else {
    recommendations.push(
      'How can I optimize my pitch for Series A investors?',
      'What advanced metrics would impress sophisticated investors?',
      'How can I better position my company against larger competitors?'
    );
  }
  
  // Industry-specific recommendations
  const industryRecommendations = getIndustryRecommendations(industry);
  recommendations.push(...industryRecommendations);
  
  // Stage-specific recommendations
  const stageRecommendations = getStageRecommendations(stage);
  recommendations.push(...stageRecommendations);
  
  // Web search-based recommendations
  if (analysis.webSearchResults && analysis.webSearchResults.length > 0) {
    const webSearchRecommendations = getWebSearchRecommendations(analysis.webSearchResults, industry, stage);
    recommendations.push(...webSearchRecommendations);
  }
  
  // Improvement-based recommendations
  if (analysis.score?.improvements?.length > 0) {
    const improvements = analysis.score.improvements;
    improvements.forEach((improvement: string) => {
      if (improvement.includes('financial')) {
        recommendations.push('Can you help me create compelling financial projections?');
      } else if (improvement.includes('team')) {
        recommendations.push('How should I present my team\'s background and expertise?');
      } else if (improvement.includes('market')) {
        recommendations.push('What market size analysis would be most compelling?');
      } else if (improvement.includes('competitive')) {
        recommendations.push('How can I better differentiate from competitors?');
      }
    });
  }
  
  // Filter out questions that have already been asked
  const filteredRecommendations = recommendations.filter(
    rec => !previousQuestions.some(q => 
      q.toLowerCase().includes(rec.toLowerCase().split(' ').slice(0, 3).join(' '))
    )
  );
  
  console.log(`🎯 Recommendation Engine: Generated ${filteredRecommendations.length} unique recommendations`);
  
  return filteredRecommendations.slice(0, 5); // Return top 5 recommendations
}

function getIndustryRecommendations(industry: string): string[] {
  const recommendations: { [key: string]: string[] } = {
    'SaaS': [
      'What are the key SaaS metrics investors look for?',
      'How should I present my customer acquisition strategy?',
      'What churn rate is acceptable for my stage?'
    ],
    'Fintech': [
      'What regulatory considerations should I address?',
      'How can I demonstrate compliance readiness?',
      'What security measures are investors looking for?'
    ],
    'Healthtech': [
      'What FDA approval processes should I mention?',
      'How can I demonstrate clinical validation?',
      'What healthcare partnerships are valuable?'
    ],
    'AI/ML': [
      'How can I demonstrate technical differentiation?',
      'What AI ethics considerations should I address?',
      'How do I prove my AI model\'s accuracy?'
    ],
    'E-commerce': [
      'What customer lifetime value metrics matter most?',
      'How can I show scalable customer acquisition?',
      'What inventory management strategies work?'
    ]
  };
  
  return recommendations[industry] || [
    'What are the key success metrics for my industry?',
    'How can I demonstrate market fit in my sector?'
  ];
}

function getStageRecommendations(stage: string): string[] {
  const recommendations: { [key: string]: string[] } = {
    'Idea': [
      'How can I validate my problem-solution fit?',
      'What early traction indicators should I focus on?',
      'How should I present my MVP development plan?'
    ],
    'MVP': [
      'What user feedback metrics are most compelling?',
      'How can I show product-market fit?',
      'What early revenue models work best?'
    ],
    'Seed': [
      'What traction metrics do seed investors expect?',
      'How can I demonstrate scalable growth?',
      'What team expansion plans should I present?'
    ],
    'Series A': [
      'What unit economics should I highlight?',
      'How can I show path to profitability?',
      'What expansion strategies are most compelling?'
    ]
  };
  
  return recommendations[stage] || [
    'What metrics are most important for my current stage?',
    'How can I demonstrate readiness for the next funding round?'
  ];
} 

function getWebSearchRecommendations(webSearchResults: any[], industry: string, stage: string): string[] {
  const recommendations: string[] = [];
  
  webSearchResults.forEach(result => {
    const snippet = result.snippet.toLowerCase();
    
    if (snippet.includes('unit economics')) {
      recommendations.push('How can I better present my unit economics to investors?');
    }
    
    if (snippet.includes('market size')) {
      recommendations.push('What market size analysis would be most compelling for my industry?');
    }
    
    if (snippet.includes('competitive')) {
      recommendations.push('How can I better differentiate from competitors in my market?');
    }
    
    if (snippet.includes('team')) {
      recommendations.push('What team credentials are most important for my industry and stage?');
    }
    
    if (snippet.includes('traction')) {
      recommendations.push('What traction metrics are most relevant for my industry?');
    }
    
    if (snippet.includes('go-to-market')) {
      recommendations.push('How can I improve my go-to-market strategy presentation?');
    }
  });
  
  return recommendations;
} 