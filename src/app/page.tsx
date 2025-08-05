'use client';

import { useState } from 'react';
import { BarChart3, Upload, MessageCircle, Download } from 'lucide-react';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import ChatInterface from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Analysis, ComparisonData } from '@/types';


type ViewState = 'upload' | 'analysis' | 'chat' | 'comparison';

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewState>('upload');
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [pitchDeckText, setPitchDeckText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);

  const handleFileUpload = async (file: File, analysisResult: Analysis) => {
    setIsUploading(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setAnalysis(analysisResult);
    setPitchDeckText('Extracted text from pitch deck...'); // In real app, this would be the actual extracted text
    setCurrentView('analysis');
    setIsUploading(false);
  };

  const handleBackToUpload = () => {
    setCurrentView('upload');
    setAnalysis(null);
    setPitchDeckText('');
  };

  const handleStartChat = () => {
    setCurrentView('chat');
  };

  const handleStartComparison = () => {
    setCurrentView('comparison');
    // Generate mock comparison data
    setComparisonData([
      {
        industry: analysis?.industry || 'Technology',
        avgScore: 3.2,
        topStrengths: ['Financial metrics', 'Team credentials', 'Market analysis'],
        commonImprovements: ['Competitive analysis', 'Go-to-market strategy']
      },
      {
        industry: 'SaaS',
        avgScore: 3.5,
        topStrengths: ['MRR metrics', 'Customer acquisition', 'Product-market fit'],
        commonImprovements: ['Churn analysis', 'Unit economics']
      },
      {
        industry: 'Fintech',
        avgScore: 3.8,
        topStrengths: ['Regulatory compliance', 'Security measures', 'Partnerships'],
        commonImprovements: ['Risk management', 'Scalability plans']
      }
    ]);
  };

  const downloadReport = () => {
    const report = `
Investor Readiness Report
========================

Score: ${analysis?.score?.rating}/5.0
Industry: ${analysis?.industry}
Stage: ${analysis?.stage}

Strengths:
${analysis?.score?.strengths?.map((s: string) => `- ${s}`).join('\n')}

Areas for Improvement:
${analysis?.score?.improvements?.map((i: string) => `- ${i}`).join('\n')}

Generated on: ${new Date().toLocaleDateString()}
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'investor-readiness-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col">
        {/* Header - Only show on upload view */}
        {currentView === 'upload' && (
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold mb-2">Pitch Deck Analyzer</h1>
            <p className="text-sm text-gray-600">
              Get your investor readiness score and personalized feedback
            </p>
          </div>
        )}

        {/* Main Content */}
        {currentView === 'upload' && (
          <div className="flex items-center justify-center flex-1">
            <div className="relative">
              <FileUpload onFileUpload={handleFileUpload} isUploading={isUploading} />
            </div>
          </div>
        )}

        {currentView === 'analysis' && analysis && (
          <div className="flex items-center justify-center flex-1">
            <AnalysisResults 
              analysis={analysis} 
              onBack={handleBackToUpload} 
              onStartChat={handleStartChat}
            />
          </div>
        )}

        {currentView === 'chat' && analysis && (
          <div className="flex items-center justify-center flex-1">
            <div className="relative">
              {/* Back button */}
              <div className="absolute -top-12 left-0">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView('analysis')}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Back to Analysis
                </Button>
              </div>
              
              <ChatInterface analysis={analysis} pitchDeckText={pitchDeckText} />
            </div>
          </div>
        )}

        {currentView === 'comparison' && (
          <div className="flex items-center justify-center flex-1">
            <div className="relative">
              {/* Back button */}
              <div className="absolute -top-12 left-0">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentView('analysis')}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Back to Analysis
                </Button>
              </div>
              
              <div className="w-[800px] h-[600px] bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="text-center">
                    <h2 className="text-xl font-bold mb-2">Industry Comparison</h2>
                    <p className="text-sm text-gray-600">
                      See how your pitch deck compares to others in your industry
                    </p>
                  </div>
                </div>

                {/* Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                  <div className="space-y-6">
                    {comparisonData.map((data, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-bold text-sm">{data.industry}</h4>
                          <div className="text-right">
                            <div className="text-lg font-bold">{data.avgScore}/5.0</div>
                            <div className="text-xs text-gray-500">Average Score</div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="font-bold text-xs mb-2 text-green-600">Top Strengths</h5>
                            <ul className="space-y-1">
                              {data.topStrengths.map((strength: string, i: number) => (
                                <li key={i} className="text-xs text-gray-700">• {strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="font-bold text-xs mb-2 text-orange-600">Common Improvements</h5>
                            <ul className="space-y-1">
                              {data.commonImprovements.map((improvement: string, i: number) => (
                                <li key={i} className="text-xs text-gray-700">• {improvement}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-center mt-6 p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-bold text-sm mb-2">Innovative Feature: Industry Benchmarking</h4>
                      <p className="text-xs text-gray-600">
                        This comparison tool helps you understand how your pitch deck stacks up against 
                        industry standards and identifies specific areas where you can improve to meet 
                        investor expectations in your sector.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer - At bottom of screen */}
      <div className="flex-shrink-0 pt-4 pb-2 mb-2 text-center">
        <p className="text-xs text-gray-500">
          © 2025 Digress, All Rights Reserved
        </p>
      </div>
    </div>
  );
}
