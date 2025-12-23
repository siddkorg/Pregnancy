
import React, { useState, useEffect } from 'react';
import { generateBabyImage } from '../services/geminiService';
import { Info, Sparkles, Wand2 } from 'lucide-react';

const fruitSize: Record<number, { name: string, emoji: string }> = {
  1: { name: 'Tiny Speck', emoji: '✨' },
  4: { name: 'Poppy Seed', emoji: '🌱' },
  8: { name: 'Raspberry', emoji: '🍓' },
  12: { name: 'Lime', emoji: '🍋' },
  16: { name: 'Avocado', emoji: '🥑' },
  20: { name: 'Banana', emoji: '🍌' },
  24: { name: 'Corn', emoji: '🌽' },
  28: { name: 'Eggplant', emoji: '🍆' },
  32: { name: 'Squash', emoji: '🎃' },
  36: { name: 'Papaya', emoji: '🍈' },
  40: { name: 'Watermelon', emoji: '🍉' },
};

const getFruit = (week: number) => {
  const keys = Object.keys(fruitSize).map(Number).sort((a, b) => a - b);
  let bestKey = keys[0];
  for (const k of keys) {
    if (week >= k) bestKey = k;
  }
  return fruitSize[bestKey];
};

const BabyVisualizer: React.FC<{ week: number }> = ({ week }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fruit = getFruit(week);

  const loadVisual = async () => {
    setLoading(true);
    try {
      const url = await generateBabyImage(week);
      setImageUrl(url);
    } catch (err) {
      // Logic handled in service fallback, but local catch for safety
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisual();
  }, [week]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800">My Little One</h2>
        <p className="text-pink-500 font-medium">Currently the size of a {fruit.name} {fruit.emoji}</p>
      </div>

      <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-pink-50 group">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-pink-400">
            <div className="w-12 h-12 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="text-sm font-medium animate-pulse">Generating your miracle...</p>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Baby visualization" 
            className="w-full h-full object-cover transition-opacity duration-1000 opacity-100" 
          />
        ) : (
          <div className="text-pink-200">
            <Wand2 size={48} className="animate-pulse" />
          </div>
        )}
        
        {!loading && (
          <button 
            onClick={loadVisual}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2.5 rounded-full shadow-lg hover:bg-white transition-all active:scale-90 border border-pink-100 flex items-center gap-2"
            title="Redraw with AI"
          >
            <Sparkles className="w-5 h-5 text-pink-500" />
            <span className="text-[10px] font-bold text-pink-600 pr-1">REIMAGINE</span>
          </button>
        )}
      </div>

      <div className="bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl border border-pink-100/50 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-pink-600" />
          <h3 className="font-bold text-pink-800">Growth Milestone</h3>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-pink-700 leading-relaxed font-medium">
            {week <= 4 ? 
              "At this early stage, your baby is a tiny, magical spark finding its home. Every cell is programmed with your love." : 
              `At ${week} weeks, your baby's journey is in full bloom. They are safely tucked away in their cozy sanctuary, growing stronger every day.`
            }
          </p>
          <div className="h-1 w-12 bg-pink-200 rounded-full"></div>
          <p className="text-[11px] text-pink-400 italic">
            Visualizations are artistic AI interpretations of fetal development stages.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BabyVisualizer;
