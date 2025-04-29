'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { IconSend, IconBrain } from '@tabler/icons-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export default function MCPChat() {
  const { conversationId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Add initial greeting message
    setMessages([
      {
        id: 'initial',
        content: 'Hello! I am your DeFi risk analysis assistant. How can I help you today?',
        role: 'assistant',
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      role: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Implement actual API call to send message to MCP
      // For now, we'll simulate a response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: `assistant-${Date.now()}`,
          content: 'I understand you want to analyze your DeFi position. Could you please provide more details about your current holdings and risk preferences?',
          role: 'assistant',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body p-0">
          {/* Chat Header */}
          <div className="p-4 border-b border-base-300 flex items-center gap-2">
            <IconBrain className="w-6 h-6 text-primary" />
            <h2 className="text-lg font-semibold">MCP Risk Analysis Assistant</h2>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat ${message.role === 'user' ? 'chat-end' : 'chat-start'}`}
              >
                <div className={`chat-bubble ${
                  message.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-secondary'
                }`}>
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="chat chat-start">
                <div className="chat-bubble chat-bubble-secondary">
                  <LoadingSpinner />
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-base-300">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about your DeFi position risks..."
                className="input input-bordered flex-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <button
                className="btn btn-primary"
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
              >
                <IconSend className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 