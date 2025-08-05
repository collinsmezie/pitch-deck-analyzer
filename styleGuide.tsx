// 'use client';

// import { useState } from 'react';
// import { Send, Hourglass, Bot, Lightbulb } from 'lucide-react';
// import { Button } from './ui/button';
// import { Textarea } from './ui/textarea';
// import { ScrollArea } from './ui/scroll-area';
// import { 
//   ROASChart, 
//   CampaignPerformanceChart, 
//   CostPerConversionChart, 
//   BudgetAllocationChart, 
//   CTRConversionChart,
//   SpendPerformanceChart 
// } from './Charts';

// // Component to format AI responses properly
// function FormattedContent({ content }: { content: string }) {
//   // Function to determine which chart to show based on content (only ONE chart)
//   const getRelevantChart = (text: string) => {
//     const lowerText = text.toLowerCase();
    
//     // Priority order - return the first match only
//     if (lowerText.includes('roas') || lowerText.includes('return on ad spend')) {
//       return <ROASChart key="roas-chart" />;
//     }
    
//     if (lowerText.includes('cost per conversion') || lowerText.includes('average cost')) {
//       return <CostPerConversionChart key="cost-chart" />;
//     }
    
//     if (lowerText.includes('conversion') && !lowerText.includes('cost per conversion')) {
//       return <CampaignPerformanceChart key="performance-chart" />;
//     }
    
//     if (lowerText.includes('budget') || lowerText.includes('spend') || lowerText.includes('allocation')) {
//       return <BudgetAllocationChart key="budget-chart" />;
//     }
    
//     if (lowerText.includes('ctr') || lowerText.includes('click through rate') || lowerText.includes('conversion rate')) {
//       return <CTRConversionChart key="ctr-chart" />;
//     }
    
//     if (lowerText.includes('ad spend') || lowerText.includes('spending')) {
//       return <SpendPerformanceChart key="spend-chart" />;
//     }
    
//     // Default for campaign analysis
//     if (lowerText.includes('campaign') || lowerText.includes('performance')) {
//       return <ROASChart key="default-roas-chart" />;
//     }
    
//     return null;
//   };

//   // Function to format inline bold text
//   const formatInlineText = (text: string) => {
//     let currentKey = 0;
    
//     // Handle triple asterisks first (***text***)
//     let processedText = text.replace(/\*\*\*(.*?)\*\*\*/g, (match, content) => {
//       return `__TRIPLE_BOLD_${currentKey++}_${content}__`;
//     });
    
//     // Handle double asterisks (**text**)
//     processedText = processedText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
//       return `__DOUBLE_BOLD_${currentKey++}_${content}__`;
//     });
    
//     // Split by our markers and rebuild with proper formatting
//     const segments = processedText.split(/(__(?:TRIPLE|DOUBLE)_BOLD_\d+_.*?__)/);
//     currentKey = 0;
    
//     return segments.map((segment, index) => {
//       if (segment.startsWith('__TRIPLE_BOLD_')) {
//         const content = segment.match(/__TRIPLE_BOLD_\d+_(.*)__/)?.[1] || '';
//         return <strong key={`triple-${index}`} className="font-bold text-gray-900">{content}</strong>;
//       } else if (segment.startsWith('__DOUBLE_BOLD_')) {
//         const content = segment.match(/__DOUBLE_BOLD_\d+_(.*)__/)?.[1] || '';
//         return <strong key={`double-${index}`} className="font-semibold text-gray-900">{content}</strong>;
//       }
//       return segment;
//     });
//   };

//   // Split content into sections and format appropriately
//   const formatContent = (text: string) => {
//     const lines = text.split('\n');
//     const elements: React.JSX.Element[] = [];
//     let currentKey = 0;

//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i].trim();
      
//       if (!line) {
//         elements.push(<div key={currentKey++} className="h-3" />);
//         continue;
//       }

//       // Bold headings (lines ending with : and shorter than 50 chars, not starting with -, or lines starting with ###)
//       if ((line.endsWith(':') && !line.startsWith('- ') && line.length < 50 && 
//           !line.includes('**') && !line.includes('***')) || 
//           line.startsWith('###')) {
//         const text = line.startsWith('###') ? line.replace(/^###\s*/, '') : line;
//         elements.push(
//           <div key={currentKey++} className="font-semibold text-gray-900 mb-2">
//             {text}
//           </div>
//         );
//         continue;
//       }

//       // Bullet points (lines starting with -)
//       if (line.startsWith('- ')) {
//         const text = line.slice(2);
//         elements.push(
//           <div key={currentKey++} className="flex items-start gap-2 mb-1">
//             <span className="text-gray-400 mt-1">•</span>
//             <span>{formatInlineText(text)}</span>
//           </div>
//         );
//         continue;
//       }

//       // Regular paragraphs with inline formatting
//       elements.push(
//         <div key={currentKey++} className="mb-2">
//           {formatInlineText(line)}
//         </div>
//       );
//     }

//     // Add one relevant chart at the end of the formatted content
//     const chart = getRelevantChart(text);
//     if (chart) {
//       elements.push(chart);
//     }

//     return elements;
//   };

//   return <div>{formatContent(content)}</div>;
// }

// interface ChatMessage {
//   role: 'user' | 'assistant';
//   content: string;
//   timestamp: Date;
//   followUpQuestion?: string;
// }

// export default function ChatInterface() {
//   const [messages, setMessages] = useState<ChatMessage[]>([]);
//   const [inputValue, setInputValue] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!inputValue.trim() || isLoading) return;

//     const userMessage: ChatMessage = {
//       role: 'user',
//       content: inputValue.trim(),
//       timestamp: new Date(),
//     };

//     setMessages(prev => [...prev, userMessage]);
//     setInputValue('');
//     setIsLoading(true);

//     try {
//       const response = await fetch('/api/chat', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ message: inputValue.trim() }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to get response');
//       }

//       const data = await response.json();
      
//       const assistantMessage: ChatMessage = {
//         role: 'assistant',
//         content: data.response || 'Sorry, I could not generate a response.',
//         timestamp: new Date(),
//         followUpQuestion: data.followUpQuestion,
//       };

//       setMessages(prev => [...prev, assistantMessage]);
//     } catch {
//       const errorMessage: ChatMessage = {
//         role: 'assistant',
//         content: 'Sorry, there was an error processing your request. Please make sure your OpenAI API key is configured correctly.',
//         timestamp: new Date(),
//       };
//       setMessages(prev => [...prev, errorMessage]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSubmit(e);
//     }
//   };

//   // Get the last AI message for follow-up suggestion
//   const lastAIMessage = messages.length > 0 && messages[messages.length - 1].role === 'assistant' 
//     ? messages[messages.length - 1] 
//     : null;

//   return (
//     <div className="w-[800px] h-[600px] bg-white/90 border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
//       {/* Messages Area - Scrollable */}
//       <div className="flex-1 overflow-hidden">
//         <ScrollArea className="h-full p-4">
//           <div className="space-y-6">
//             {/* Welcome message - always visible */}
//             <div className="space-y-2">
//               <div className="text-xs font-medium text-gray-600 flex items-center gap-2">
//                 <Bot className="h-3 w-3" />
//                 AI Analyst
//               </div>
//               <div className="text-sm text-gray-800 leading-relaxed">
//                 <div className="mb-3">
//                   <strong>Welcome to Facebook Ads Analyzer!</strong>
//                 </div>
//                 <p className="mb-3">I am here to help you analyze your Facebook ads performance. Ask me anything about your campaigns, ad sets, conversions, costs, or optimization opportunities.</p>
//                 <div className="space-y-1">
//                   <p className="font-medium">Here are some questions you can try:</p>
//                   <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
//                     <li>Which campaign has the best ROAS?</li>
//                     <li>What is the average cost per conversion?</li>
//                     <li>How are my retargeting ads performing?</li>
//                     <li>Which ad creative should I optimize?</li>
//                   </ul>
//                 </div>
//               </div>
//             </div>

//             {/* Conversation messages */}
//             {messages.map((message, index) => (
//               <div key={index} className="space-y-2">
//                 {message.role === 'user' ? (
//                   // User message - chat bubble style
//                   <div className="flex justify-end">
//                     <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg max-w-[80%] text-sm">
//                       {message.content}
//                     </div>
//                   </div>
//                 ) : (
//                   // AI message - current style
//                   <>
//                     <div className="text-xs font-medium text-gray-600 flex items-center gap-2">
//                       <Bot className="h-3 w-3" />
//                       AI Analyst
//                     </div>
//                     <div className="text-sm text-gray-800 leading-relaxed">
//                       <FormattedContent content={message.content} />
//                     </div>
//                   </>
//                 )}
//               </div>
//             ))}

//             {/* Loading state */}
//             {isLoading && (
//               <div className="space-y-2">
//                 <div className="text-xs font-medium text-gray-600 flex items-center gap-2">
//                   <Bot className="h-3 w-3" />
//                   AI Analyst
//                 </div>
//                 <div className="text-sm text-gray-600">
//                   Analyzing your Facebook ads data...
//                 </div>
//               </div>
//             )}
//           </div>
//         </ScrollArea>
//       </div>

//       {/* Bottom Section - Fixed */}
//       <div className="flex-shrink-0 border-t border-gray-200">
//         {/* Follow-up suggestion - Fixed at bottom */}
//         {lastAIMessage && lastAIMessage.followUpQuestion && !isLoading && (
//           <div className="px-4 py-2 border-b border-gray-100">
//             <button
//               onClick={() => {
//                 setInputValue(lastAIMessage.followUpQuestion!);
//                 setTimeout(function() {
//                   const form = document.querySelector('form');
//                   if (form) form.requestSubmit();
//                 }, 0);
//               }}
//               disabled={isLoading}
//               className="px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors disabled:opacity-50 text-blue-700 font-medium flex items-center gap-2"
//             >
//               <Lightbulb className="h-4 w-4" />
//               {lastAIMessage.followUpQuestion}
//             </button>
//           </div>
//         )}

//         {/* Initial Suggestions - Fixed at bottom */}
//         {messages.length === 0 && (
//           <div className="px-4 py-2 border-b border-gray-100">
//             <div className="flex gap-2 flex-wrap">
//               <button
//                 onClick={() => {
//                   setInputValue("Which campaign has the best ROAS?");
//                   setTimeout(function() {
//                     const form = document.querySelector('form');
//                     if (form) form.requestSubmit();
//                   }, 0);
//                 }}
//                 disabled={isLoading}
//                 className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors disabled:opacity-50"
//               >
//                 Best ROAS campaign?
//               </button>
//               <button
//                 onClick={() => {
//                   setInputValue("What's the average cost per conversion?");
//                   setTimeout(function() {
//                     const form = document.querySelector('form');
//                     if (form) form.requestSubmit();
//                   }, 0);
//                 }}
//                 disabled={isLoading}
//                 className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors disabled:opacity-50"
//               >
//                 Average cost per conversion?
//               </button>
//               <button
//                 onClick={() => {
//                   setInputValue("How are my retargeting ads performing?");
//                   setTimeout(function() {
//                     const form = document.querySelector('form');
//                     if (form) form.requestSubmit();
//                   }, 0);
//                 }}
//                 disabled={isLoading}
//                 className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors disabled:opacity-50"
//               >
//                 Retargeting performance?
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Input Area - Fixed at bottom */}
//         <div className="p-3">
//           <form onSubmit={handleSubmit} className="flex gap-2">
//             <Textarea
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               onKeyDown={handleKeyDown}
//               placeholder="Ask about your Facebook ads performance..."
//               className="flex-1 min-h-[44px] max-h-20 resize-none text-sm"
//               disabled={isLoading}
//             />
//             <Button
//               type="submit"
//               size="sm"
//               disabled={!inputValue.trim() || isLoading}
//               className="bg-gray-900 hover:bg-gray-800 text-white w-[44px] h-[44px] p-0"
//             >
//               {isLoading ? (
//                 <Hourglass className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Send className="h-4 w-4" />
//               )}
//             </Button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }





















































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
    return 'linear-gradient(to right, #ef4444 0%, #f97316 25%, #eab308 50%, #84cc16 75%, #22c55e 100%)';
  };

  return (
    <div className="relative">
      {/* Back button */}
      <div className="absolute -top-12 left-0">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back to application
        </Button>
      </div>

      <div className="w-[800px] h-[600px] bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="text-center">
            <div className={`text-2xl font-bold mb-4 ${getScoreColor(score)}`}>
              {score}
            </div>
            
            {/* Progress Bar */}
            <div className="relative w-full h-4 bg-gray-200 rounded-full mb-4">
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
            
            <p className="text-sm text-gray-600">
              Your investor readiness score: {score}/5
            </p>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full p-6">
            <div className="space-y-8">
              {/* Strengths */}
              {analysis.score?.strengths?.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    {/* <h3 className="font-bold text-sm">Strengths</h3> */}
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
                    {/* <h3 className="font-bold text-sm">Areas for Improvement</h3> */}
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