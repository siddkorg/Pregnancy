
import React, { useState, useEffect } from 'react';
import { generateBabyImage } from '../services/geminiService';
import { Info, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const fruit = getFruit(week);

  const loadVisual = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = await generateBabyImage(week);
      setImageUrl(url);
    } catch (err) {
      console.error(err);
      setError("We're having trouble visualizing right now. Please check your connection or try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisual();
  }, [week]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800">My Little One</h2>
        <p className="text-pink-500 font-medium">Currently the size of a {fruit.name} {fruit.emoji}</p>
      </div>

      <div className="relative aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-pink-50">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-pink-400">
            <div className="w-12 h-12 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="text-sm font-medium animate-pulse">Drawing a dream...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <AlertCircle className="text-pink-300 w-10 h-10" />
            <p className="text-xs text-gray-400 font-medium px-4">{error}</p>
            <button 
              onClick={loadVisual}
              className="mt-2 flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-pink-600 transition-colors"
            >
              <RefreshCw size={14} />
              TRY AGAIN
            </button>
          </div>
        ) : imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Baby visualization" 
            className="w-full h-full object-cover transition-opacity duration-1000 opacity-100" 
            onLoad={(e) => (e.currentTarget.style.opacity = "1")}
          />
        ) : null}
        
        {!loading && !error && (
          <button 
            onClick={loadVisual}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-all active:scale-90"
            title="Refresh Image"
          >
            <Sparkles className="w-5 h-5 text-pink-500" />
          </button>
        )}
      </div>

      <div className="bg-pink-50 p-5 rounded-2xl border border-pink-100/50">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-pink-600" />
          <h3 className="font-bold text-pink-800">Growth Milestone</h3>
        </div>
        <p className="text-sm text-pink-700 leading-relaxed">
          {week <= 4 ? 
            "At this very early stage, your baby is a tiny cluster of cells finding their home. This is the start of a beautiful adventure." : 
            `At ${week} weeks, your baby is developing rapidly. Their unique features are starting to form in this peaceful sanctuary. Keep sharing your love, mama.`
          }
        </p>
      </div>
    </div>
  );
};

export default BabyVisualizer;
