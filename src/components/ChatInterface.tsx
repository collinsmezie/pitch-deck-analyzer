'use client';

import { useState, useEffect } from 'react';
import { Send, Hourglass, Bot, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Analysis, Message } from '@/types';

// Component to format AI responses properly
function FormattedContent({ content }: { content: string }) {
  // Function to format inline bold text
  const formatInlineText = (text: string) => {
    let currentKey = 0;
    
    // Handle triple asterisks first (***text***)
    let processedText = text.replace(/\*\*\*(.*?)\*\*\*/g, (match, content) => {
      return `__TRIPLE_BOLD_${currentKey++}_${content}__`;
    });
    
    // Handle double asterisks (**text**)
    processedText = processedText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
      return `__DOUBLE_BOLD_${currentKey++}_${content}__`;
    });
    
    // Split by our markers and rebuild with proper formatting
    const segments = processedText.split(/(__(?:TRIPLE|DOUBLE)_BOLD_\d+_.*?__)/);
    currentKey = 0;
    
    return segments.map((segment, index) => {
      if (segment.startsWith('__TRIPLE_BOLD_')) {
        const content = segment.match(/__TRIPLE_BOLD_\d+_(.*)__/)?.[1] || '';
        return <strong key={`triple-${index}`} className="font-bold text-gray-900">{content}</strong>;
      } else if (segment.startsWith('__DOUBLE_BOLD_')) {
        const content = segment.match(/__DOUBLE_BOLD_\d+_(.*)__/)?.[1] || '';
        return <strong key={`double-${index}`} className="font-semibold text-gray-900">{content}</strong>;
      }
      return segment;
    });
  };

  // Split content into sections and format appropriately
  const formatContent = (text: string) => {
    const lines = text.split('\n');
    const elements: React.JSX.Element[] = [];
    let currentKey = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        elements.push(<div key={currentKey++} className="h-3" />);
        continue;
      }

      // Bold headings (lines ending with : and shorter than 50 chars, not starting with -, or lines starting with ###)
      if ((line.endsWith(':') && !line.startsWith('- ') && line.length < 50 && 
          !line.includes('**') && !line.includes('***')) || 
          line.startsWith('###')) {
        const text = line.startsWith('###') ? line.replace(/^###\s*/, '') : line;
        elements.push(
          <div key={currentKey++} className="font-semibold text-gray-900 mb-2 leading-6">
            {text}
          </div>
        );
        continue;
      }

      // Bullet points (lines starting with -)
      if (line.startsWith('- ')) {
        const text = line.slice(2);
        elements.push(
          <div key={currentKey++} className="flex items-start gap-2 mb-1 leading-6">
            <span className="text-gray-400 mt-1">•</span>
            <span>{formatInlineText(text)}</span>
          </div>
        );
        continue;
      }

      // Regular paragraphs with inline formatting
      elements.push(
        <div key={currentKey++} className="mb-2 leading-6">
          {formatInlineText(line)}
        </div>
      );
    }

    return elements;
  };

  return <div>{formatContent(content)}</div>;
}

interface ChatInterfaceProps {
  analysis: Analysis;
  pitchDeckText: string;
}

export default function ChatInterface({ analysis, pitchDeckText }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, [analysis, messages]);

  const loadRecommendations = async () => {
    try {
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis,
          previousQuestions: messages.filter(m => m.type === 'user').map(m => m.content)
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setRecommendations(result.recommendations);
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: content,
          pitchDeckText,
          analysis,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: result.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        // Reload recommendations after new question
        setTimeout(loadRecommendations, 1000);
      } else {
        const error = await response.json();
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Error: ${error.error}`,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleRecommendationClick = (recommendation: string) => {
    setInputValue(recommendation);
    setTimeout(() => {
      const form = document.querySelector('form');
      if (form) form.requestSubmit();
    }, 0);
  };

  // Get the last AI message for follow-up suggestion
  const lastAIMessage = messages.length > 0 && messages[messages.length - 1].type === 'assistant' 
    ? messages[messages.length - 1] 
    : null;

  return (
    <div className="w-[800px] h-[600px] bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden">
      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4 custom-scrollbar">
          <div className="space-y-6">
            {/* Welcome message - always visible */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-600 flex items-center gap-2">
                <Bot className="h-3 w-3" />
                AI Analyst
              </div>
              <div className="text-sm text-gray-800 leading-relaxed">
                <div className="mb-3">
                  <strong>Welcome to Pitch Deck Analyzer!</strong>
                </div>
                <p className="mb-3 leading-6">I am here to help you analyze your pitch deck and improve your investor readiness. Ask me anything about your deck, scoring, improvements, or optimization opportunities.</p>
                <div className="space-y-1">
                  <p className="font-medium leading-6">Here are some questions you can try:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li className="leading-6">How can I improve my financial projections?</li>
                    <li className="leading-6">What traction metrics should I include?</li>
                    <li className="leading-6">How can I strengthen my team slide?</li>
                    <li className="leading-6">What market size analysis would be most compelling?</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Conversation messages */}
            {messages.map((message, index) => (
              <div key={index} className="space-y-2">
                {message.type === 'user' ? (
                  // User message - chat bubble style
                  <div className="flex justify-end">
                    <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg max-w-[80%] text-sm leading-6">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  // AI message - current style
                  <>
                    <div className="text-xs font-medium text-gray-600 flex items-center gap-2">
                      <Bot className="h-3 w-3" />
                      AI Analyst
                    </div>
                    <div className="text-sm text-gray-800 leading-6">
                      <FormattedContent content={message.content} />
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Loading state */}
            {isLoading && (
              <div className="space-y-2">
                <div className="text-xs font-medium text-gray-600 flex items-center gap-2">
                  <Bot className="h-3 w-3" />
                  AI Analyst
                </div>
                <div className="text-sm text-gray-600">
                  Analyzing your pitch deck...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Bottom Section - Fixed */}
      <div className="flex-shrink-0 border-t border-gray-200">
        {/* Follow-up suggestion - Fixed at bottom */}
        {lastAIMessage && recommendations.length > 0 && !isLoading && (
          <div className="px-4 py-2 border-b border-gray-100">
            <button
              onClick={() => handleRecommendationClick(recommendations[0])}
              disabled={isLoading}
              className="px-3 py-1.5 text-sm bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors disabled:opacity-50 text-blue-700 font-medium flex items-center gap-2"
            >
              <Lightbulb className="h-4 w-4" />
              {recommendations[0]}
            </button>
          </div>
        )}

        {/* Initial Suggestions - Fixed at bottom */}
        {messages.length === 0 && (
          <div className="px-4 py-2 border-b border-gray-100">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => {
                  setInputValue("How can I improve my financial projections?");
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) form.requestSubmit();
                  }, 0);
                }}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors disabled:opacity-50"
              >
                Improve financial projections?
              </button>
              <button
                onClick={() => {
                  setInputValue("What traction metrics should I include?");
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) form.requestSubmit();
                  }, 0);
                }}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors disabled:opacity-50"
              >
                Traction metrics?
              </button>
              <button
                onClick={() => {
                  setInputValue("How can I strengthen my team slide?");
                  setTimeout(() => {
                    const form = document.querySelector('form');
                    if (form) form.requestSubmit();
                  }, 0);
                }}
                disabled={isLoading}
                className="px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors disabled:opacity-50"
              >
                Strengthen team slide?
              </button>
            </div>
          </div>
        )}

        {/* Input Area - Fixed at bottom */}
        <div className="p-3">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your pitch deck..."
              className="flex-1 min-h-[44px] max-h-20 resize-none text-sm"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="sm"
              disabled={!inputValue.trim() || isLoading}
              className="bg-gray-900 hover:bg-gray-800 text-white w-[44px] h-[44px] p-0"
            >
              {isLoading ? (
                <Hourglass className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 