
import React, { useState, useEffect, useRef } from 'react';
import { generateBabyImage } from '../services/geminiService';
import { Info, Sparkles, Wand2, Stars, AlertCircle } from 'lucide-react';

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);

  const fruit = getFruit(week);

  const startCooldown = () => {
    setCooldown(5);
    if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    cooldownTimer.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          if (cooldownTimer.current) clearInterval(cooldownTimer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const loadVisual = async () => {
    if (loading || cooldown > 0) return;

    setError(null);
    setImageUrl(null);
    setLoading(true);
    setRefreshKey(prev => prev + 1);
    
    try {
      const url = await generateBabyImage(week);
      setImageUrl(url);
      startCooldown();
    } catch (err: any) {
      console.error("Visualizer Error:", err);
      setError("We're having trouble reaching the stars. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisual();
    return () => {
      if (cooldownTimer.current) clearInterval(cooldownTimer.current);
    };
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
            <div className="text-center px-6">
              <p className="text-sm font-bold tracking-tight">Re-imagining Week {week}...</p>
              <p className="text-[10px] opacity-70">Please wait while we weave a new vision. Miracles take a moment!</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 text-pink-400 px-10 text-center">
            <AlertCircle size={48} className="text-pink-300" />
            <div>
              <p className="text-sm font-bold text-pink-600">Dreaming interrupted</p>
              <p className="text-xs opacity-70 mt-1">{error}</p>
            </div>
            <button 
              onClick={loadVisual}
              className="mt-2 bg-pink-100 text-pink-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-pink-200 transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        ) : imageUrl ? (
          <div key={`${week}-${refreshKey}`} className="relative w-full h-full animate-in zoom-in-95 fade-in duration-700">
            <img 
              src={imageUrl} 
              alt={`AI visualization of baby at week ${week}`} 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </div>
        ) : (
          <div className="text-pink-200">
            <Wand2 size={48} className="animate-pulse" />
          </div>
        )}
        
        {!loading && !error && (
          <button 
            onClick={loadVisual}
            disabled={cooldown > 0}
            className={`absolute bottom-6 right-6 backdrop-blur-sm p-3 rounded-2xl shadow-xl transition-all active:scale-95 border flex items-center gap-2 z-10 ${
              cooldown > 0 
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
              : 'bg-white/95 text-pink-600 border-pink-100 hover:bg-white'
            }`}
          >
            <Sparkles className={`w-5 h-5 ${cooldown > 0 ? 'text-gray-300' : 'text-pink-500'}`} />
            <span className="text-xs font-bold">
              {cooldown > 0 ? `RESTING (${cooldown}s)` : 'RE-IMAGINE'}
            </span>
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
          <h3 className="font-bold text-gray-800">Growth Milestone</h3>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed font-medium">
            {week <= 4 ? 
              "Your baby is a tiny miracle settling into its new home. Every single cell is part of an incredible plan." : 
              week <= 12 ?
              `In week ${week}, major organs are starting to flourish. Tiny heartbeats are echoing the rhythm of life.` :
              week <= 24 ?
              `At week ${week}, your baby can sense your presence and hear the soft sounds of your world. A beautiful connection is growing.` :
              `You're almost there! At week ${week}, your baby is practicing life skills like opening eyes and breathing, getting ready for your first hello.`
            }
          </p>
          <div className="flex items-center gap-2 py-2">
            <div className="h-px flex-1 bg-pink-100"></div>
            <Stars className="text-pink-200 w-4 h-4" />
            <div className="h-px flex-1 bg-pink-100"></div>
          </div>
          <p className="text-[10px] text-gray-400 italic text-center px-4">
            Note: These images are unique artistic AI interpretations of growth stages. If we hit high traffic limits, we'll use a beautiful memory of a similar stage.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BabyVisualizer;
