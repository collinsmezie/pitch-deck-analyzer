'use client';

import { CheckCircle, AlertTriangle, MessageCircle, BarChart3, Target, TrendingUp, AlertCircle, ArrowUpRight, Users, DollarSign, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Analysis } from '@/types';

interface AnalysisResultsProps {
  analysis: Analysis;
  onBack: () => void;
  onStartChat: () => void;
}

export default function AnalysisResults({ analysis, onBack, onStartChat }: AnalysisResultsProps) {
  const score = analysis.score?.rating || 0;
  const progressPercentage = (score / 5) * 100;

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-green-600';
    if (score >= 3.0) return 'text-yellow-600';
    if (score >= 2.0) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProgressGradient = () => {
    return 'linear-gradient(to right, #fecaca 0%, #fed7aa 25%, #fef3c7 50%, #dcfce7 75%, #bbf7d0 100%)';
  };

  const getUnfilledGradient = () => {
    return 'linear-gradient(to right, #fef2f2 0%, #fef7ed 25%, #fefce8 50%, #f0fdf4 75%, #f0fdf4 100%)';
  };

  return (
    <div className="relative mt-16">
      {/* Back button */}
      <div className="absolute -top-18 -left-2">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to application
        </Button>
      </div>

      {/* Header Section - Outside the card */}
      <div className="mb-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            {/* <span className="text-sm text-gray-600">
              /5
            </span> */}
          </div>

          <div
            className="relative w-full h-4 rounded-full mb-4"
            style={{
              background: getUnfilledGradient()
            }}
          >

            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                background: getProgressGradient()
              }}
            />

            <div
              className="absolute top-0 w-1 h-4 bg-gray-800 rounded"
              style={{ left: `${progressPercentage}%`, transform: 'translateX(-50%)' }}
            />
          </div>


          <p className="text-sm text-gray-600 mt-2">
            Your investor readiness score: {score}/5
          </p>
        </div>
      </div>

      {/* Content Card */}
      <div className="w-[800px] h-[600px] bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
        {/* Content - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-6 custom-scrollbar [&_[data-radix-scroll-area-viewport]]:!block">
            <div className="space-y-8 pr-2">
              {/* Strengths */}
              {analysis.score?.strengths?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h3 className="font-medium leading-6">Strengths</h3>
                  </div>
                  <ul className="space-y-3 ml-7">
                    {analysis.score.strengths.map((strength: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 list-disc leading-relaxed">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Areas for Improvement */}
              {analysis.score?.improvements?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-medium leading-6">Areas for Improvement</h3>
                  </div>
                  <ul className="space-y-3 ml-7">
                    {analysis.score.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 list-disc leading-relaxed">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Market Analysis */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium leading-6">Market Analysis</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                  <p>Your solution addresses a growing market with strong demand for AI-powered transcription services. The compliance-driven sectors you're targeting represent a significant opportunity, but competition is intensifying.</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-xs text-gray-500">Global market size: $2.5B+</span>
                  </div>
                </div>
              </div>

              {/* Financial Metrics */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <h3 className="font-medium leading-6">Financial Projections</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Revenue Growth</span>
                    </div>
                    <p className="text-gray-600">Projected 300% YoY growth with current trajectory</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Customer Acquisition</span>
                    </div>
                    <p className="text-gray-600">Targeting 500+ enterprise customers by year 3</p>
                  </div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-orange-600" />
                  <h3 className="font-medium leading-6">Risk Assessment</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-700 leading-relaxed">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Regulatory Compliance</p>
                      <p className="text-gray-600">Ensure all certifications are up-to-date and validated</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Competitive Pressure</p>
                      <p className="text-gray-600">Large tech companies entering the space rapidly</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <ArrowUpRight className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium leading-6">Recommended Next Steps</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-purple-600">1</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">Develop comprehensive accuracy benchmarks with third-party validation</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-purple-600">2</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">Create detailed financial projections with unit economics</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                      <span className="text-xs font-medium text-purple-600">3</span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">Strengthen team with domain experts and compliance specialists</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-t border-gray-200 flex-shrink-0">
          <div className="flex gap-3 justify-center">
            <Button
              onClick={onStartChat}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white"
            >
              <MessageCircle className="h-4 w-4" />
              Ask Questions
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Industry Comparison
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}