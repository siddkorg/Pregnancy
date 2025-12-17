
import React, { useState } from 'react';
import { ActivityLog } from '../types';
import { Droplets, Moon, Smile, Check } from 'lucide-react';

interface ActivityLogViewProps {
  onSave: (log: Omit<ActivityLog, 'id' | 'date'>) => void;
}

const ActivityLogView: React.FC<ActivityLogViewProps> = ({ onSave }) => {
  const [water, setWater] = useState(4);
  const [sleep, setSleep] = useState(8);
  const [mood, setMood] = useState<ActivityLog['mood']>('happy');
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ waterIntake: water, sleepHours: sleep, mood, notes });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800">Daily Log</h2>
        <p className="text-gray-500">How's your day going?</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 border border-pink-50 shadow-sm space-y-8">
        {/* Water Intake */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              <Droplets className="text-blue-500 w-5 h-5" />
              Water Intake
            </label>
            <span className="text-blue-600 font-bold">{water} Glasses</span>
          </div>
          <input 
            type="range" min="0" max="15" step="1" 
            value={water} 
            onChange={(e) => setWater(Number(e.target.value))}
            className="w-full accent-blue-500 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Sleep */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="flex items-center gap-2 font-bold text-gray-700">
              <Moon className="text-purple-500 w-5 h-5" />
              Hours of Sleep
            </label>
            <span className="text-purple-600 font-bold">{sleep} hrs</span>
          </div>
          <input 
            type="range" min="0" max="15" step="0.5" 
            value={sleep} 
            onChange={(e) => setSleep(Number(e.target.value))}
            className="w-full accent-purple-500 h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Mood */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 font-bold text-gray-700 mb-2">
            <Smile className="text-pink-500 w-5 h-5" />
            Current Mood
          </label>
          <div className="grid grid-cols-5 gap-2">
            {(['happy', 'tired', 'calm', 'excited', 'nauseous'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all ${
                  mood === m ? 'border-pink-500 bg-pink-50' : 'border-gray-50 bg-gray-50 opacity-60'
                }`}
              >
                <span className="text-xl">{m === 'happy' ? '😊' : m === 'tired' ? '😴' : m === 'calm' ? '🧘' : m === 'excited' ? '🤩' : '🤢'}</span>
                <span className="text-[8px] font-bold uppercase">{m}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="font-bold text-gray-700">Notes & Thoughts</label>
          <textarea 
            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-pink-200 outline-none min-h-[100px]"
            placeholder="How are you feeling today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button 
          type="submit"
          className={`w-full font-bold py-4 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-2 ${
            isSaved ? 'bg-green-500 text-white' : 'bg-pink-500 text-white shadow-pink-100 hover:bg-pink-600'
          }`}
        >
          {isSaved ? (
            <><Check size={20} /> Log Saved!</>
          ) : (
            'Save Daily Entry'
          )}
        </button>
      </form>
    </div>
  );
};

export default ActivityLogView;
