
import React, { useState, useEffect } from 'react';
import { UserProfile, ActivityLog } from '../types';
import { generateDailyTip } from '../services/geminiService';
import { Droplets, Moon, Smile, Calendar as CalendarIcon } from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  recentLogs: ActivityLog[];
  onOpenCalendar: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, recentLogs, onOpenCalendar }) => {
  const [tip, setTip] = useState<string>('Loading your tip for today...');
  const progress = (user.currentWeek / 40) * 100;
  
  const lastLog = recentLogs[0] || { waterIntake: 0, sleepHours: 0, mood: 'happy' };

  useEffect(() => {
    generateDailyTip(user.currentWeek).then(setTip);
  }, [user.currentWeek]);

  return (
    <div className="space-y-6">
      {/* Progress Card */}
      <section className="gradient-pink rounded-3xl p-6 text-pink-900 soft-shadow">
        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-sm font-semibold opacity-70 uppercase tracking-wider">Mama {user.name}</p>
            <h2 className="text-3xl font-bold">Week {user.currentWeek}</h2>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold opacity-70 uppercase tracking-wider">Due Date</p>
            <p className="font-bold">{new Date(user.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="w-full bg-white/40 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-pink-500 h-full rounded-full transition-all duration-1000" 
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
        <p className="mt-3 text-sm font-medium">
          {user.currentWeek >= 40 ? "Baby is coming soon!" : `Almost there! ${40 - user.currentWeek} weeks to go.`}
        </p>
      </section>

      {/* Daily Tip */}
      <section className="bg-white border-2 border-pink-50 rounded-2xl p-4 flex gap-4 items-start shadow-sm">
        <div className="bg-yellow-100 p-2 rounded-xl shrink-0">
          <CalendarIcon className="text-yellow-600 w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-gray-800">Today's Wisdom</h3>
          <p className="text-gray-600 text-sm italic">"{tip}"</p>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-2xl flex flex-col items-center text-center">
          <Droplets className="text-blue-500 mb-2" />
          <p className="text-xs text-blue-600 font-bold uppercase">Water</p>
          <p className="text-xl font-bold text-blue-800">{lastLog.waterIntake} <span className="text-xs font-normal">glasses</span></p>
        </div>
        <div className="bg-purple-50 p-4 rounded-2xl flex flex-col items-center text-center">
          <Moon className="text-purple-500 mb-2" />
          <p className="text-xs text-purple-600 font-bold uppercase">Sleep</p>
          <p className="text-xl font-bold text-purple-800">{lastLog.sleepHours} <span className="text-xs font-normal">hours</span></p>
        </div>
      </div>

      <section className="bg-pink-50 p-6 rounded-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-pink-800">Your Journey</h3>
          <button 
            onClick={onOpenCalendar}
            className="text-[10px] bg-white px-2 py-1 rounded-full font-bold text-pink-500 border border-pink-100"
          >
            VIEW CALENDAR
          </button>
        </div>
        <div className="flex justify-between">
          {['happy', 'tired', 'calm', 'nauseous'].map((m) => (
            <div key={m} className={`flex flex-col items-center p-2 rounded-xl transition-all ${lastLog.mood === m ? 'bg-white shadow-md' : 'opacity-50'}`}>
              <span className="text-2xl">{m === 'happy' ? '😊' : m === 'tired' ? '😴' : m === 'calm' ? '🧘' : '🤢'}</span>
              <span className="text-[10px] capitalize font-bold mt-1">{m}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
