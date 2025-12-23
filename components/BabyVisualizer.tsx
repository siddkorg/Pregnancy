
import React, { useState, useEffect } from 'react';
import { generateBabyImage } from '../services/geminiService';
import { Info, Sparkles, Wand2, Stars } from 'lucide-react';

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
      console.error("Visualizer Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisual();
  }, [week]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-2 bg-pink-50 px-3 py-1 rounded-full text-pink-600 text-[10px] font-bold uppercase tracking-widest mb-1">
          <Stars size={12} />
          Week {week} Development
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-800">My Little One</h2>
        <p className="text-pink-500 font-medium text-sm flex items-center justify-center gap-2">
          Size of a <span className="font-bold underline underline-offset-4 decoration-pink-200">{fruit.name}</span> {fruit.emoji}
        </p>
      </div>

      <div className="relative aspect-square bg-gray-50 rounded-[2.5rem] overflow-hidden shadow-inner flex items-center justify-center border-4 border-pink-50/50 group">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-pink-400">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
              <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 animate-pulse" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold tracking-tight">Visualizing Week {week}...</p>
              <p className="text-[10px] opacity-70">Creating a unique medical illustration</p>
            </div>
          </div>
        ) : imageUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={imageUrl} 
              alt={`AI visualization of baby at week ${week}`} 
              className="w-full h-full object-cover transition-all duration-700" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="text-pink-200">
            <Wand2 size={48} className="animate-pulse" />
          </div>
        )}
        
        {!loading && (
          <button 
            onClick={loadVisual}
            className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl hover:bg-white transition-all active:scale-95 border border-pink-100 flex items-center gap-2 group/btn"
          >
            <Sparkles className="w-5 h-5 text-pink-500 group-hover/btn:rotate-12 transition-transform" />
            <span className="text-xs font-bold text-pink-600">RE-IMAGINE</span>
          </button>
        )}
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-pink-100/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Info size={80} />
        </div>
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-pink-100 p-2 rounded-xl">
            <Info className="w-5 h-5 text-pink-600" />
          </div>
          <h3 className="font-bold text-gray-800">What's Happening Now</h3>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {week <= 4 ? 
              "This week, your baby is a tiny ball of cells called a blastocyst. It's making its very first home in your womb, a miracle in the making." : 
              week <= 12 ?
              `By week ${week}, your baby's major organs are forming. Tiny fingers and toes are starting to peek out, and the heart is beating fast with life.` :
              week <= 24 ?
              `At week ${week}, your baby can now hear your heartbeat and even muffled sounds from the outside world. They are becoming more active every day!` :
              `You're in the home stretch! At week ${week}, your baby is practicing breathing and opening their eyes, getting ready to meet you very soon.`
            }
          </p>
          <div className="flex items-center gap-2 py-2">
            <div className="h-px flex-1 bg-pink-100"></div>
            <Stars className="text-pink-200 w-4 h-4" />
            <div className="h-px flex-1 bg-pink-100"></div>
          </div>
          <p className="text-[10px] text-gray-400 italic text-center">
            These images are artistic AI interpretations of fetal growth stages and are not intended for medical diagnostic use.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BabyVisualizer;
