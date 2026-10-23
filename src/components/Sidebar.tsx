import React from 'react';
import {
  Home,
  LayoutGrid,
  Scan,
  CalendarCheck,
  MessageSquare,
  User,
  Settings,
  Tractor,
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { name: 'Home', icon: Home },
    { name: 'Dashboard', icon: LayoutGrid },
    { name: 'Scanner', icon: Scan },
    { name: 'Equipment Booking', icon: CalendarCheck },
    { name: 'AI Chat', icon: MessageSquare },
    { name: 'Profile', icon: User },
    { name: 'Settings', icon: Settings },
  ];

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full bg-[#0B462C] text-white select-none">
      <div className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.name;
          return (
            <button
              key={item.name}
              onClick={() => {
                onSelectTab(item.name);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-[#1D7C50] text-white shadow-md'
                  : 'text-emerald-100/80 hover:bg-[#125838] hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-emerald-200/80'}`} />
              <span className="tracking-wide">{item.name}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom watermark matching screenshot: tractor watermark and text */}
      <div className="p-6 relative overflow-hidden border-t border-emerald-800/40">
        <div className="relative z-10">
          <div className="flex items-center space-x-2 text-emerald-300/80 mb-1">
            <Tractor className="w-5 h-5" />
            <span className="text-[11px] uppercase tracking-wider font-semibold text-emerald-300">
              AgriShare
            </span>
          </div>
          <h4 className="text-sm font-bold text-white tracking-wide">
            Smart Farming
          </h4>
          <p className="text-xs text-emerald-300 font-medium">
            Better Tomorrow
          </p>
        </div>

        {/* Subtle decorative tractor background silhouette */}
        <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none text-white">
          <Tractor className="w-28 h-28" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 min-w-[16rem] h-[calc(100vh-4rem)] sticky top-16 shadow-lg z-20">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-xs h-full z-10 shadow-2xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
