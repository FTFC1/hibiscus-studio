
import React, { useState, useRef, useEffect } from 'react';
import { Chat } from '@google/genai';
import { ChatMessage, GroundingSource } from '../types';
import { CloseIcon, SendIcon, WalletIcon, LinkIcon, ClipboardCopyIcon } from './Icons';
import Button from './Button';
import { INPUT_TOKEN_PRICE, OUTPUT_TOKEN_PRICE } from '../constants';
import { useAppContext } from '../context/AppContext';
import { copyToClipboard } from '../utils';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chatInstance: Chat | null;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, chatInstance }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast } = useAppContext();

  const suggestedPrompts = [
    "Summarize the key points",
    "What was the main feedback?",
    "Expand on the first scene",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (messageToSend?: string) => {
    const text = messageToSend || input;
    if (!text.trim() || !chatInstance || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chatInstance.sendMessageStream({ message: text });
      let modelResponse = '';
      let sources: GroundingSource[] = [];
      setMessages(prev => [...prev, { role: 'model', text: '', sources: [] }]);

      for await (const chunk of result) {
        modelResponse += chunk.text;

        const groundingMetadata = chunk.candidates?.[0]?.groundingMetadata;
        if (groundingMetadata?.groundingChunks) {
            sources = groundingMetadata.groundingChunks
                .filter((c: any) => c.web && c.web.uri)
                .map((c: any) => ({
                    uri: c.web.uri,
                    title: c.web.title || c.web.uri,
                }));
        }

        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          lastMessage.text = modelResponse;
          lastMessage.sources = sources;
          return newMessages;
        });

        if (chunk.usageMetadata) {
            const { promptTokenCount, candidatesTokenCount } = chunk.usageMetadata;
            const inputCost = (promptTokenCount || 0) * INPUT_TOKEN_PRICE;
            const outputCost = (candidatesTokenCount || 0) * OUTPUT_TOKEN_PRICE;
            setTotalCost(prev => prev + inputCost + outputCost);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCopyChat = () => {
    const chatHistory = messages.map(msg => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.text}`).join('\n\n');
    copyToClipboard(chatHistory, showToast);
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold">Ask about the video</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-gray-400">
                <WalletIcon className="w-5 h-5" />
                <span className="text-sm font-mono" title="Estimated cost for this chat session">${totalCost.toFixed(6)}</span>
            </div>
            <Button onClick={handleCopyChat} variant="ghost" className="p-2 rounded-full" title="Copy Chat History">
                <ClipboardCopyIcon className="w-5 h-5" />
            </Button>
            <Button onClick={onClose} variant="ghost" className="p-2 rounded-full">
                <CloseIcon className="w-6 h-6" />
            </Button>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 border-t border-gray-600/50 pt-3">
                        <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            Sources
                        </h4>
                        <ul className="space-y-1.5 pl-1">
                            {msg.sources.map((source, i) => (
                                <li key={i} className="text-xs truncate">
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline flex items-center gap-1.5" title={source.title}>
                                        <span className="truncate">{source.title}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
              </div>
            </div>
          ))}
           {isLoading && (
              <div className="flex justify-start">
                  <div className="max-w-md p-3 rounded-lg bg-gray-700 text-gray-200">
                      <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></div>
                      </div>
                  </div>
              </div>
          )}
          <div ref={messagesEndRef} />
        </main>
        <footer className="p-4 border-t border-gray-700">
          {messages.length === 0 && !isLoading && (
              <div className="flex flex-wrap gap-2 mb-3">
                  {suggestedPrompts.map((prompt, i) => (
                      <Button key={i} variant="secondary" className="text-xs px-2 py-1" onClick={() => handleSuggestionClick(prompt)}>
                          {prompt}
                      </Button>
                  ))}
              </div>
          )}
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              disabled={isLoading}
            />
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="p-2 aspect-square h-10 w-10">
              <SendIcon className="w-5 h-5" />
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ChatModal;