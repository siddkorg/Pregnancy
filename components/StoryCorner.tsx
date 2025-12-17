
import React, { useState } from 'react';
import { generateStory } from '../services/geminiService';
import { BookOpen, RefreshCw, Feather } from 'lucide-react';

interface StoryCornerProps {
  week: number;
}

const StoryCorner: React.FC<StoryCornerProps> = ({ week }) => {
  const [story, setStory] = useState<{ title: string, content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mood, setMood] = useState('calm');

  const fetchStory = async () => {
    setLoading(true);
    try {
      const data = await generateStory(week, mood);
      setStory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800">Story Corner</h2>
        <p className="text-gray-500">Soft tales for you and your little one</p>
      </div>

      {!story && !loading ? (
        <div className="bg-white border-2 border-dashed border-pink-200 rounded-3xl p-10 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
            <BookOpen className="text-pink-500 w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-800">Need a moment of peace?</h3>
            <p className="text-sm text-gray-500">Pick your current mood and I'll write a special story just for you.</p>
          </div>
          <div className="flex gap-2">
            {['calm', 'excited', 'tired', 'joyful'].map((m) => (
              <button
                key={m}
                onClick={() => setMood(m)}
                className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-colors ${
                  mood === m ? 'bg-pink-500 text-white shadow-md' : 'bg-pink-50 text-pink-500'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
          <button 
            onClick={fetchStory}
            className="w-full bg-pink-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-pink-200 hover:bg-pink-600 active:scale-95 transition-all"
          >
            Create My Story
          </button>
        </div>
      ) : loading ? (
        <div className="bg-white border-2 border-pink-100 rounded-3xl p-10 flex flex-col items-center text-center gap-4">
          <Feather className="text-pink-300 w-12 h-12 animate-bounce" />
          <p className="text-gray-500 animate-pulse">Weaving a gentle tale...</p>
        </div>
      ) : story && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-50 space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-xl font-serif font-bold text-pink-800 italic">"{story.title}"</h3>
          <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">
            {story.content}
          </div>
          <button 
            onClick={fetchStory}
            className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-widest pt-4 border-t border-pink-50 w-full"
          >
            <RefreshCw size={14} />
            Write another story
          </button>
        </div>
      )}
    </div>
  );
};

export default StoryCorner;
