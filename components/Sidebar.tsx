
import React from 'react';
import { 
  Plus, 
  History, 
  Compass, 
  Code2, 
  Library, 
  PanelLeftClose, 
  PanelLeftOpen,
  MessageSquare
} from 'lucide-react';
import { ChatSession, SidebarTab } from '../types';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  activeTab: SidebarTab;
  setActiveTab: (tab: SidebarTab) => void;
  recentChats: ChatSession[];
  onSelectChat: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  setIsCollapsed, 
  activeTab, 
  setActiveTab,
  recentChats,
  onSelectChat
}) => {
  const menuItems = [
    { id: SidebarTab.New, icon: Plus, label: 'New Chat' },
    { id: SidebarTab.History, icon: History, label: 'History' },
    { id: SidebarTab.Explore, icon: Compass, label: 'Explore' },
    { id: SidebarTab.API, icon: Code2, label: 'API' },
    { id: SidebarTab.Library, icon: Library, label: 'Library' },
  ];

  return (
    <div 
      className={`h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-100 min-h-[64px]">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold italic">
              G
            </div>
            <span className="font-bold text-xl text-gray-800 tracking-tight">GLKB</span>
          </div>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const isNewAction = item.id === SidebarTab.New;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center transition-all duration-200 group ${
                  isCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'w-full gap-3 px-1 py-1'
                } ${
                  !isNewAction && isActive ? 'bg-blue-50 text-blue-600 rounded-lg' : 'text-gray-600 hover:bg-gray-50 rounded-lg'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                {/* Fixed-size icon container for alignment */}
                <div className={`w-8 h-8 flex items-center justify-center shrink-0 transition-all ${
                  isNewAction 
                    ? 'rounded-full bg-[#EBEBEB] text-[#333333] group-hover:bg-[#E0E0E0] shadow-sm' 
                    : 'bg-transparent'
                }`}>
                  <item.icon 
                    size={isNewAction ? 18 : 20} 
                    strokeWidth={isNewAction ? 2.5 : 2} 
                  />
                </div>
                
                {!isCollapsed && (
                  <span className={`font-medium text-sm truncate ${
                    isNewAction ? 'text-gray-700 font-semibold' : ''
                  }`}>
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {!isCollapsed && (
          <div className="mt-8">
            <div className="px-3 flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Recent
              </h3>
            </div>
            <div className="flex flex-col gap-0.5">
              {recentChats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className="w-full text-left p-2 rounded-lg hover:bg-gray-50 group flex items-center gap-2.5 truncate"
                >
                  <MessageSquare size={14} className="text-gray-400 shrink-0" />
                  <span className="text-xs text-gray-600 truncate font-medium">{chat.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-9 h-9 rounded-full bg-[#0EA5E9] border-2 border-white shadow-sm flex items-center justify-center text-white font-bold text-xs shrink-0">
            Z
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-gray-800 truncate">Settings</p>
              <p className="text-[10px] text-gray-500 truncate">z.researcher@glkb.ai</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
