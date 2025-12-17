
import React, { useState, useEffect } from 'react';
import { Wind, Brain, RotateCcw } from 'lucide-react';

const MiniGames: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'none' | 'breathing' | 'memory'>('none');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-serif font-bold text-gray-800">Play & Relax</h2>
        <p className="text-gray-500">Unwind with simple games</p>
      </div>

      {activeGame === 'none' && (
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => setActiveGame('breathing')}
            className="bg-blue-50 p-6 rounded-3xl flex items-center gap-6 text-left border border-blue-100 hover:shadow-md transition-all"
          >
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <Wind className="text-blue-500 w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-blue-900">Breathing Oasis</h3>
              <p className="text-xs text-blue-600 opacity-80 mt-1">Focus on your breath and find your center.</p>
            </div>
          </button>

          <button 
            onClick={() => setActiveGame('memory')}
            className="bg-purple-50 p-6 rounded-3xl flex items-center gap-6 text-left border border-purple-100 hover:shadow-md transition-all"
          >
            <div className="bg-white p-4 rounded-2xl shadow-sm">
              <Brain className="text-purple-500 w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900">Memory Bloom</h3>
              <p className="text-xs text-purple-600 opacity-80 mt-1">A gentle brain teaser with cute icons.</p>
            </div>
          </button>
        </div>
      )}

      {activeGame === 'breathing' && <BreathingGame onBack={() => setActiveGame('none')} />}
      {activeGame === 'memory' && <MemoryGame onBack={() => setActiveGame('none')} />}
    </div>
  );
};

const BreathingGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timer, setTimer] = useState(4);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          if (phase === 'Inhale') { setPhase('Hold'); return 4; }
          if (phase === 'Hold') { setPhase('Exhale'); return 4; }
          if (phase === 'Exhale') { setPhase('Inhale'); return 4; }
          return 4;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div className="bg-blue-50 rounded-3xl p-10 flex flex-col items-center gap-8 animate-in fade-in">
      <button onClick={onBack} className="self-start text-blue-600 text-sm font-bold">← Back</button>
      
      <div className="relative flex items-center justify-center">
        <div 
          className={`w-48 h-48 bg-blue-200/50 rounded-full transition-all duration-[4000ms] flex items-center justify-center ${
            phase === 'Inhale' ? 'scale-125' : phase === 'Exhale' ? 'scale-100' : 'scale-125 opacity-80'
          }`}
        >
          <div className="bg-blue-500 w-32 h-32 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl">
            {timer}
          </div>
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-2xl font-bold text-blue-900 mb-2">{phase}</h3>
        <p className="text-blue-600 text-sm">Gentle breaths for you and baby</p>
      </div>
    </div>
  );
};

const MemoryGame: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const icons = ['🍼', '👶', '🧸', '👣', '🎀', '🧺'];
  const [cards, setCards] = useState(() => [...icons, ...icons].sort(() => Math.random() - 0.5));
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const handleFlip = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]] === cards[newFlipped[1]]) {
        setMatched([...matched, ...newFlipped]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  const reset = () => {
    setCards([...icons, ...icons].sort(() => Math.random() - 0.5));
    setFlipped([]);
    setMatched([]);
  };

  return (
    <div className="bg-purple-50 rounded-3xl p-6 flex flex-col items-center gap-6 animate-in fade-in">
      <div className="w-full flex justify-between items-center">
        <button onClick={onBack} className="text-purple-600 text-sm font-bold">← Back</button>
        <button onClick={reset} className="text-purple-600"><RotateCcw size={20} /></button>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full max-w-[280px]">
        {cards.map((icon, idx) => (
          <button
            key={idx}
            onClick={() => handleFlip(idx)}
            className={`aspect-square rounded-2xl text-2xl flex items-center justify-center transition-all duration-300 ${
              flipped.includes(idx) || matched.includes(idx) 
              ? 'bg-white rotate-y-180 shadow-md' 
              : 'bg-purple-200'
            }`}
          >
            {(flipped.includes(idx) || matched.includes(idx)) ? icon : ''}
          </button>
        ))}
      </div>

      {matched.length === cards.length && (
        <div className="text-center animate-bounce text-purple-700 font-bold">
          Wonderful! You matched them all! 🎉
        </div>
      )}
    </div>
  );
};

export default MiniGames;
