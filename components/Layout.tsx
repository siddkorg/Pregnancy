
import React from 'react';
import { AppScreen } from '../types';
import { 
  Home, 
  Heart, 
  BookOpen, 
  Gamepad2, 
  ClipboardList,
  Settings,
  Calendar
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeScreen: AppScreen;
  setScreen: (screen: AppScreen) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeScreen, setScreen }) => {
  const navItems = [
    { id: AppScreen.DASHBOARD, icon: Home, label: 'Home' },
    { id: AppScreen.VISUALIZER, icon: Heart, label: 'Baby' },
    { id: AppScreen.STORY, icon: BookOpen, label: 'Story' },
    { id: AppScreen.GAMES, icon: Gamepad2, label: 'Play' },
    { id: AppScreen.LOG, icon: ClipboardList, label: 'Log' },
  ];

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-white shadow-xl relative overflow-hidden">
      {/* Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="text-3xl animate-bounce duration-[3000ms]">👶</div>
            <div className="absolute -top-1 -right-1 text-xs animate-pulse">✨</div>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-pink-600">Bump & Bloom</h1>
            <p className="text-gray-400 text-sm">A happy journey 😊</p>
          </div>
        </div>
        <button 
          onClick={() => setScreen(AppScreen.SETTINGS)}
          className={`p-2 rounded-full transition-all ${activeScreen === AppScreen.SETTINGS ? 'bg-pink-100 text-pink-600' : 'bg-gray-50 text-gray-400'}`}
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-6 pb-24 scroll-smooth">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-pink-50 flex justify-around items-center py-4 px-2 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id)}
            className={`flex flex-col items-center gap-1 transition-all ${
              activeScreen === item.id ? 'text-pink-600 scale-110' : 'text-gray-400'
            }`}
          >
            <item.icon size={22} strokeWidth={activeScreen === item.id ? 2.5 : 2} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
