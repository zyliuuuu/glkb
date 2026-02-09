
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SearchHero from './components/SearchHero';
import ChatInterface from './components/ChatInterface';
import { HelpCircle, Info, Mail, MessageCircleQuestion } from 'lucide-react';
import { Message, ChatSession, SidebarTab } from './types';
import { sendMessage } from './services/geminiService';

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<SidebarTab>(SidebarTab.New);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleSearch = async (query: string) => {
    // Create new chat
    const newChatId = Date.now().toString();
    const newUserMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    const newChat: ChatSession = {
      id: newChatId,
      title: query.substring(0, 40) + (query.length > 40 ? '...' : ''),
      messages: [newUserMessage],
      createdAt: Date.now(),
    };

    setChats([newChat, ...chats]);
    setCurrentChatId(newChatId);
    setIsTyping(true);

    try {
      const result = await sendMessage(query, []);
      const assistantMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: result.text,
        timestamp: Date.now(),
        sources: result.sources
      };

      setChats(prevChats => prevChats.map(chat => 
        chat.id === newChatId 
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      ));
    } catch (err) {
      console.error("Failed to fetch response:", err);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!currentChatId) return;

    const currentChat = chats.find(c => c.id === currentChatId);
    if (!currentChat) return;

    const newUserMessage: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setChats(prevChats => prevChats.map(chat => 
      chat.id === currentChatId 
        ? { ...chat, messages: [...chat.messages, newUserMessage] }
        : chat
    ));

    setIsTyping(true);

    try {
      const result = await sendMessage(text, currentChat.messages);
      const assistantMessage: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: result.text,
        timestamp: Date.now(),
        sources: result.sources
      };

      setChats(prevChats => prevChats.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...chat.messages, assistantMessage] }
          : chat
      ));
    } catch (err) {
      console.error("Failed to fetch response:", err);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (activeTab === SidebarTab.New) {
      setCurrentChatId(null);
    }
  }, [activeTab]);

  const activeChat = chats.find(c => c.id === currentChatId);

  return (
    <div className="flex h-screen w-full bg-[#f9fafb] text-gray-900 overflow-hidden">
      {/* Sidebar based on wireframe */}
      <Sidebar 
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recentChats={chats.slice(0, 5)}
        onSelectChat={(id) => {
          setCurrentChatId(id);
          setActiveTab(SidebarTab.History);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
          {activeChat ? (
            <ChatInterface 
              messages={activeChat.messages} 
              isTyping={isTyping}
              onSendMessage={handleSendMessage}
            />
          ) : (
            <SearchHero onSearch={handleSearch} />
          )}
        </div>

        {/* Floating Help Actions - bottom right based on wireframe */}
        <div className="absolute bottom-6 right-6 flex flex-col items-end group">
           {showHelp && (
             <div className="mb-3 bg-white border border-gray-100 shadow-xl rounded-2xl p-4 w-48 animate-in fade-in slide-in-from-bottom-2 duration-200">
               <ul className="space-y-3">
                 <li>
                   <button className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 w-full transition-colors">
                     <Info size={16} /> About
                   </button>
                 </li>
                 <li>
                   <button className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 w-full transition-colors">
                     <Mail size={16} /> Contact us
                   </button>
                 </li>
                 <li>
                   <button className="flex items-center gap-3 text-sm text-gray-600 hover:text-blue-600 w-full transition-colors">
                     <MessageCircleQuestion size={16} /> FAQ
                   </button>
                 </li>
               </ul>
             </div>
           )}
           <button 
             onClick={() => setShowHelp(!showHelp)}
             className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 shadow-lg ${
               showHelp ? 'bg-blue-600 text-white rotate-90' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
             }`}
           >
             <HelpCircle size={24} />
           </button>
        </div>
      </main>
    </div>
  );
};

export default App;
