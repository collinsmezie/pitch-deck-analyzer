'use client';

import { useState } from 'react';
import { Eye, Palette, Type, Layout, Image, Zap, ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { VisualAnalysis as VisualAnalysisType } from '@/types';

interface VisualAnalysisProps {
  visualAnalysis: VisualAnalysisType;
  onBack: () => void;
}

export default function VisualAnalysis({ visualAnalysis, onBack }: VisualAnalysisProps) {
  console.log('🎨 Visual Analysis Component: Rendering with', visualAnalysis.slides.length, 'slides');
  console.log('🎨 Visual Analysis Component: Overall score:', visualAnalysis.overallVisualScore);
  
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);

  const currentSlide = visualAnalysis.slides[currentSlideIndex];

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-green-600 bg-green-50';
    if (score >= 3.0) return 'text-yellow-600 bg-yellow-50';
    if (score >= 2.0) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'layout': return <Layout className="h-4 w-4" />;
      case 'typography': return <Type className="h-4 w-4" />;
      case 'color': return <Palette className="h-4 w-4" />;
      case 'imagery': return <Image className="h-4 w-4" />;
      case 'spacing': return <div className="h-4 w-4 flex items-center justify-center">␣</div>;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative mt-16">
      {/* Back button */}
      <div className="absolute -top-12 left-0">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to Analysis
        </Button>
      </div>

      {/* Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Eye className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Visual Analysis</h1>
        </div>
        <div className="flex items-center justify-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(visualAnalysis.overallVisualScore)}`}>
            Overall Score: {visualAnalysis.overallVisualScore}/5.0
          </div>
          <div className="text-sm text-gray-600">
            {visualAnalysis.slides.length} slides analyzed
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-[1000px] h-[700px] bg-white border border-gray-200 rounded-lg shadow-sm flex overflow-hidden">
        {/* Left Panel - Slide Navigation */}
        <div className="w-80 border-r border-gray-200 flex flex-col">
          {/* Design Principles */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold mb-3">Design Principles</h3>
            <div className="space-y-2">
              {Object.entries(visualAnalysis.designPrinciples).map(([principle, score]) => (
                <div key={principle} className="flex justify-between items-center">
                  <span className="text-sm capitalize">{principle}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${(score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{score}/5</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Navigation */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {visualAnalysis.slides.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlideIndex(index)}
                    className={`w-full p-3 text-left rounded-lg border transition-colors ${
                      index === currentSlideIndex
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-sm">Slide {slide.slideNumber}</span>
                      <Badge className={`text-xs ${getScoreColor(slide.score)}`}>
                        {slide.score}/5
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 truncate">{slide.slideTitle}</p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Right Panel - Slide Analysis */}
        <div className="flex-1 flex flex-col">
          {/* Slide Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold">Slide {currentSlide.slideNumber}: {currentSlide.slideTitle}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getScoreColor(currentSlide.score)}>
                    Score: {currentSlide.score}/5.0
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {currentSlide.strengths.length} strengths, {currentSlide.improvements.length} improvements
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                  disabled={currentSlideIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentSlideIndex(Math.min(visualAnalysis.slides.length - 1, currentSlideIndex + 1))}
                  disabled={currentSlideIndex === visualAnalysis.slides.length - 1}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Slide Content */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-6">
                {/* Content Analysis */}
                <div>
                  <h3 className="font-medium mb-2">Content Analysis</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{currentSlide.contentAnalysis}</p>
                </div>

                {/* Strengths */}
                {currentSlide.strengths.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Strengths
                    </h3>
                    <ul className="space-y-1">
                      {currentSlide.strengths.map((strength, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvements */}
                {currentSlide.improvements.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-1">
                      {currentSlide.improvements.map((improvement, index) => (
                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                          <span className="text-yellow-500 mt-1">•</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Visual Recommendations */}
                {currentSlide.visualRecommendations.length > 0 && (
                  <div>
                    <h3 className="font-medium mb-3 flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-600" />
                      Visual Recommendations
                    </h3>
                    <div className="space-y-3">
                      {currentSlide.visualRecommendations.map((rec, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedRecommendation === `${currentSlide.slideNumber}-${index}`
                              ? 'border-purple-300 bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedRecommendation(
                            selectedRecommendation === `${currentSlide.slideNumber}-${index}` 
                              ? null 
                              : `${currentSlide.slideNumber}-${index}`
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(rec.type)}
                              <span className="text-sm font-medium capitalize">{rec.type}</span>
                            </div>
                            <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>
                              {rec.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                          <p className="text-sm text-purple-700 font-medium">{rec.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
} 