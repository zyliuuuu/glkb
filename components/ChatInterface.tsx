
import React, { useRef, useEffect } from 'react';
import { Send, User, Bot, ExternalLink, Loader2 } from 'lucide-react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isTyping, onSendMessage }) => {
  const [input, setInput] = React.useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isTyping) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white max-w-5xl mx-auto w-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-8 custom-scrollbar pt-10">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-4 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 mt-1">
                <Bot size={18} />
              </div>
            )}
            <div className={`max-w-[80%] ${m.role === 'user' ? 'text-right' : ''}`}>
              <div 
                className={`inline-block p-4 rounded-2xl text-left shadow-sm border ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-white text-gray-800 border-gray-100'
                }`}
              >
                <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Sources Found</p>
                    <div className="flex flex-wrap gap-2">
                      {m.sources.map((source, i) => (
                        <a
                          key={i}
                          href={source.uri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md text-[10px] text-blue-600 hover:bg-blue-100 transition-colors border border-blue-50 font-medium"
                        >
                          <ExternalLink size={10} />
                          {source.title.substring(0, 30)}...
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-1 text-[10px] text-gray-400 px-1">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-white shrink-0 mt-1">
                <User size={18} />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 animate-pulse">
              <Bot size={18} />
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
              <Loader2 className="animate-spin text-blue-600" size={16} />
              <span className="text-sm text-gray-500 font-medium">Analyzing genomic data...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-gray-100 sticky bottom-0">
        <form onSubmit={handleSubmit} className="relative max-w-4xl mx-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a follow-up question about the genomics findings..."
            className="w-full pl-4 pr-14 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-gray-800"
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="absolute right-2 top-2 bottom-2 w-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-sm"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
