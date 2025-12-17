
import React from 'react';
import { ActivityLog } from '../types';
import { ChevronLeft } from 'lucide-react';

interface MoodCalendarProps {
  logs: ActivityLog[];
  onBack: () => void;
}

const MoodCalendar: React.FC<MoodCalendarProps> = ({ logs, onBack }) => {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();

  const getEmoji = (mood: string) => {
    switch (mood) {
      case 'happy': return '😊';
      case 'tired': return '😴';
      case 'calm': return '🧘';
      case 'excited': return '🤩';
      case 'nauseous': return '🤢';
      default: return null;
    }
  };

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = new Date(today.getFullYear(), today.getMonth(), day).toISOString().split('T')[0];
    const log = logs.find(l => l.date.split('T')[0] === dateStr);
    return { day, log };
  });

  const blanks = Array.from({ length: firstDay }, (_, i) => i);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
          <ChevronLeft />
        </button>
        <h2 className="text-2xl font-serif font-bold text-gray-800">Mood Calendar</h2>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-50">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-pink-600 uppercase tracking-widest">
            {today.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h3>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-tighter">
          <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {blanks.map(b => <div key={`b-${b}`} className="aspect-square" />)}
          {days.map(({ day, log }) => (
            <div 
              key={day} 
              className={`aspect-square rounded-xl flex flex-col items-center justify-center relative border transition-all ${
                day === today.getDate() ? 'border-pink-300 bg-pink-50' : 'border-gray-50 bg-gray-50'
              }`}
            >
              <span className="text-[10px] text-gray-500 absolute top-1 left-1">{day}</span>
              {log && <span className="text-lg mt-1">{getEmoji(log.mood)}</span>}
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-pink-50">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Insights</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total logs this month</span>
              <span className="font-bold text-pink-600">{logs.length}</span>
            </div>
            <p className="text-xs text-gray-400 italic">"Tracking your moods helps you identify what makes you feel best during this special time."</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;
