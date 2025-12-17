
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Save, User, Calendar } from 'lucide-react';

interface ProfileSettingsProps {
  user: UserProfile;
  onSave: (name: string, dueDate: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user, onSave }) => {
  const [name, setName] = useState(user.name);
  const [dueDate, setDueDate] = useState(user.dueDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(name, dueDate);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-top-4">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800">Your Journey Profile</h2>
        <p className="text-gray-500">Keep your details up to date</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-pink-50 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
            <User size={16} className="text-pink-500" />
            Mama's Name
          </label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-pink-200 outline-none"
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 font-bold text-gray-700 text-sm">
            <Calendar size={16} className="text-pink-500" />
            Expected Due Date
          </label>
          <input 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-pink-200 outline-none"
          />
        </div>

        <div className="p-4 bg-pink-50 rounded-2xl">
          <p className="text-xs text-pink-700 leading-relaxed italic">
            "Your due date helps us calculate your current week and provide the best tips for your specific stage of pregnancy."
          </p>
        </div>

        <button 
          type="submit"
          className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-100 hover:bg-pink-600 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default ProfileSettings;
