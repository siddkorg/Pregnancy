
import React, { useState, useEffect } from 'react';
import { generateBabyImage } from '../services/geminiService';
import { Info, Sparkles } from 'lucide-react';

const fruitSize: Record<number, { name: string, emoji: string }> = {
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisual();
  }, [week]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800">My Little One</h2>
        <p className="text-pink-500 font-medium">Currently the size of a {fruit.name} {fruit.emoji}</p>
      </div>

      <div className="relative aspect-square bg-gray-100 rounded-3xl overflow-hidden shadow-inner flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-pink-400">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="text-sm font-medium animate-pulse">Visualizing your baby...</p>
          </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Baby visualization" className="w-full h-full object-cover" />
        ) : (
          <p className="text-gray-400">Something went wrong. Try again!</p>
        )}
        
        {!loading && (
          <button 
            onClick={loadVisual}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Sparkles className="w-5 h-5 text-pink-500" />
          </button>
        )}
      </div>

      <div className="bg-pink-50 p-5 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-5 h-5 text-pink-600" />
          <h3 className="font-bold text-pink-800">What's happening?</h3>
        </div>
        <p className="text-sm text-pink-700 leading-relaxed">
          At {week} weeks, your baby is developing rapidly. Their senses are starting to awaken, and they might even start to recognize the sound of your voice! Keep talking and singing to your bump.
        </p>
      </div>
    </div>
  );
};

export default BabyVisualizer;
