
import React, { useState, useRef, useEffect } from 'react';
import { generateStory, generateStoryAudio } from '../services/geminiService';
import { BookOpen, RefreshCw, Feather, Volume2, Loader2, Square, Puzzle, CheckCircle2 } from 'lucide-react';

interface StoryCornerProps {
  week: number;
}

const BABY_WORDS = ['BABY', 'BLOOM', 'HEART', 'DREAM', 'MAGIC', 'SMILE', 'PEACE', 'KICKS'];

const StoryCorner: React.FC<StoryCornerProps> = ({ week }) => {
  const [story, setStory] = useState<{ title: string, content: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mood, setMood] = useState('calm');
  const [puzzleWord, setPuzzleWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [guess, setGuess] = useState('');
  const [puzzleSolved, setPuzzleSolved] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

  const initPuzzle = () => {
    const word = BABY_WORDS[Math.floor(Math.random() * BABY_WORDS.length)];
    const shuffled = word.split('').sort(() => Math.random() - 0.5).join('');
    setPuzzleWord(word);
    setScrambled(shuffled);
    setGuess('');
    setPuzzleSolved(false);
  };

  useEffect(() => {
    initPuzzle();
  }, []);

  const handlePuzzleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.toUpperCase() === puzzleWord) {
      setPuzzleSolved(true);
    }
  };

  const decodeBase64 = (base64: string) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const decodeAudioData = async (
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number = 24000,
    numChannels: number = 1
  ): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  };

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const playStory = async () => {
    if (isPlaying) {
      stopAudio();
      return;
    }
    if (!story) return;

    setAudioLoading(true);
    try {
      const base64Audio = await generateStoryAudio(story.content);
      const audioBytes = decodeBase64(base64Audio);
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current);
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      
      source.onended = () => setIsPlaying(false);
      
      sourceNodeRef.current = source;
      source.start();
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback error:", error);
    } finally {
      setAudioLoading(false);
    }
  };

  const fetchStory = async () => {
    stopAudio();
    setLoading(true);
    try {
      const data = await generateStory(week, mood);
      setStory(data);
      initPuzzle();
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
        <p className="text-gray-500">Soft tales and gentle play</p>
      </div>

      {!story && !loading ? (
        <div className="bg-white border-2 border-dashed border-pink-200 rounded-3xl p-10 flex flex-col items-center text-center gap-6">
          <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center">
            <BookOpen className="text-pink-500 w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-800">Time for a story?</h3>
            <p className="text-sm text-gray-500">Choose a mood to begin a heartwarming tale for you and your baby.</p>
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
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-pink-50 space-y-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start gap-4">
              <h3 className="text-xl font-serif font-bold text-pink-800 italic flex-1">"{story.title}"</h3>
              <button 
                onClick={playStory}
                disabled={audioLoading}
                className={`p-3 rounded-full transition-all ${
                  isPlaying ? 'bg-pink-500 text-white animate-pulse' : 'bg-pink-50 text-pink-500 hover:bg-pink-100'
                } disabled:opacity-50`}
              >
                {audioLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : isPlaying ? <Square className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
            <div className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap font-medium">
              {story.content}
            </div>
            <div className="flex gap-4 pt-4 border-t border-pink-50">
              <button 
                onClick={fetchStory}
                className="flex items-center gap-2 text-pink-500 font-bold text-xs uppercase tracking-widest"
              >
                <RefreshCw size={14} />
                New story
              </button>
            </div>
          </div>

          {/* Word Unscramble Puzzle */}
          <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <Puzzle className="w-4 h-4 text-blue-500" />
              <h4 className="text-sm font-bold text-blue-900">Word Bloom Puzzle</h4>
            </div>
            
            {puzzleSolved ? (
              <div className="flex items-center gap-2 text-green-600 font-bold bg-white p-3 rounded-xl shadow-sm">
                <CheckCircle2 size={18} />
                <span>Wonderful! The word was {puzzleWord}.</span>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-blue-700 font-medium">Unscramble this gentle word:</p>
                <div className="flex gap-2">
                  {scrambled.split('').map((letter, i) => (
                    <div key={i} className="w-8 h-10 bg-white rounded-lg flex items-center justify-center font-bold text-blue-600 shadow-sm">
                      {letter}
                    </div>
                  ))}
                </div>
                <form onSubmit={handlePuzzleSubmit} className="flex gap-2">
                  <input 
                    type="text" 
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Your guess..."
                    className="flex-1 rounded-xl border-none text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-200"
                  />
                  <button type="submit" className="bg-blue-500 text-white px-4 rounded-xl font-bold text-xs">CHECK</button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoryCorner;
