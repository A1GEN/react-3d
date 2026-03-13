import React, { useState, useEffect } from 'react';
import { 
  Terminal, Cpu, Settings, Search, Bell, Ghost, 
  Layers, Hexagon, Clock, Edit3, Fingerprint, 
  Play, SkipForward, Volume2, TrendingUp, Maximize2
} from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [isGlitch, setIsGlitch] = useState(false);
  const [btcPrice, setBtcPrice] = useState(64230);
  const [currentTime, setCurrentTime] = useState('');
  const [activeWindow, setActiveWindow] = useState('terminal');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('ru-RU', { hour12: false }));
      setBtcPrice(prev => prev + (Math.random() * 20 - 10));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 100, damping: 25 });
  const mouseY = useSpring(y, { stiffness: 100, damping: 25 });

  const rotateX = useTransform(mouseY, [-400, 400], [12, -12]);
  const rotateY = useTransform(mouseX, [-400, 400], [-12, 12]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  };

  if (isLocked) {
    return (
      <div className="min-h-screen bg-[#020202] flex items-center justify-center font-mono">
        <motion.div 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setIsLocked(false)}
          className="relative p-16 rounded-[4rem] border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-3xl cursor-pointer group flex flex-col items-center shadow-[0_0_50px_rgba(6,182,212,0.1)]"
        >
          <div className="absolute inset-0 rounded-[4rem] bg-cyan-500/10 animate-pulse" />
          <Fingerprint size={100} className="text-cyan-500 mb-8 relative z-10" />
          <p className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.8em] animate-pulse">Access Required</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div 
      className={`min-h-screen flex items-center justify-center overflow-hidden font-mono transition-all duration-700 ${isGlitch ? 'bg-white invert contrast-125' : 'bg-[#030303]'}`}
      onMouseMove={handleMouseMove}
      style={{ perspective: '2000px' }}
    >
      {/* 3. Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: Math.random() * 1000, x: Math.random() * 1000, opacity: 0.1 }}
            animate={{ 
              y: [null, Math.random() * -100], 
              opacity: [0.1, 0.4, 0.1],
              scale: [1, 1.5, 1] 
            }}
            transition={{ duration: Math.random() * 10 + 10, repeat: Infinity }}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full blur-[1px]"
          />
        ))}
      </div>

      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative w-[92%] max-w-7xl aspect-video rounded-[4rem] flex items-center justify-center"
      >
        <motion.div style={{ translateZ: '-250px' }} className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] scale-150" />

        {/* 1. Crypto Widget (Draggable) */}
        <motion.div 
          drag dragMomentum={false}
          style={{ translateZ: '150px' }}
          onMouseEnter={() => setActiveWindow('crypto')}
          className={`absolute top-12 left-12 p-8 bg-black/60 border border-white/10 rounded-[2.5rem] backdrop-blur-3xl shadow-2xl cursor-grab active:cursor-grabbing transition-all z-30 ${activeWindow !== 'crypto' && 'blur-[1px] opacity-80'}`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-2 bg-emerald-500/20 rounded-lg"><TrendingUp size={18} className="text-emerald-400" /></div>
            <span className="text-[10px] font-black text-slate-400 tracking-widest">CORE_INDEX</span>
          </div>
          <div className="text-4xl font-black text-white tracking-tighter tabular-nums">${btcPrice.toFixed(2)}</div>
          <div className="h-1 w-full bg-emerald-500/20 rounded-full mt-4 overflow-hidden">
             <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ duration: 2, repeat: Infinity }} className="h-full w-1/2 bg-emerald-400" />
          </div>
        </motion.div>

        {/* 4. Music Player (Draggable) */}
        <motion.div 
          drag dragMomentum={false}
          style={{ translateZ: '120px' }}
          onMouseEnter={() => setActiveWindow('music')}
          className={`absolute top-12 right-12 w-72 p-6 bg-white/5 border border-white/10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl cursor-grab z-30 transition-all ${activeWindow !== 'music' && 'blur-[1px] opacity-80'}`}
        >
          <div className="flex gap-4 items-center mb-8">
            <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center animate-pulse"><Play fill="white" size={18} /></div>
            <div className="overflow-hidden">
              <p className="text-[10px] font-black text-white truncate uppercase">Cyber_Atmosphere.flac</p>
              <p className="text-[8px] text-cyan-400/60 font-bold tracking-widest uppercase italic">Active</p>
            </div>
          </div>
          <div className="flex justify-between items-center opacity-60">
            <Volume2 size={16} /> <div className="flex gap-1"> {[1,2,3].map(i => <div key={i} className="w-1 h-3 bg-cyan-400 rounded-full" />)} </div> <SkipForward size={16} />
          </div>
        </motion.div>

        {/* Main Terminal */}
        <motion.div 
          style={{ translateZ: '50px' }}
          onMouseEnter={() => setActiveWindow('terminal')}
          className={`w-full max-w-4xl bg-[#070707]/95 rounded-[3.5rem] border border-white/10 overflow-hidden shadow-2xl backdrop-blur-xl transition-all z-10 ${activeWindow !== 'terminal' && 'scale-[0.98] opacity-90'}`}
        >
          <div className="bg-white/5 px-8 py-4 flex justify-between items-center border-b border-white/5">
            <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-rose-500/40" /><div className="w-3 h-3 rounded-full bg-amber-500/40" /><div className="w-3 h-3 rounded-full bg-emerald-500/40" /></div>
            <div className="flex items-center gap-4 text-cyan-500">
               <Clock size={14} /> <span className="text-[11px] font-black tracking-widest">{currentTime}</span>
            </div>
            <Maximize2 size={14} className="text-slate-600" />
          </div>
          <div className="p-12 text-[13px] text-slate-400 space-y-4">
            <p className="text-emerald-400 font-bold">$ system.status()</p>
            <p> User: <span className="text-white">Admin_Developer</span></p>
            <p> Node: <span className="text-white font-black underline italic">Bishkek_Main_Station</span></p>
            <p className="text-cyan-500 animate-pulse">! INTERFACE_OPTIMIZED_FOR_3D_VIEWPORT</p>
            <div className="h-20" />
            <div className="pt-8 border-t border-white/5 flex items-center justify-between opacity-30">
               <span className="text-[9px] uppercase font-black tracking-[0.4em]">Connection: Secure</span>
               <Cpu size={18} />
            </div>
          </div>
        </motion.div>

        {/* 3. Glitch Controls */}
        <motion.div style={{ translateZ: '200px' }} className="absolute bottom-12 right-12">
          <button 
            onClick={() => { setIsGlitch(true); setTimeout(() => setIsGlitch(false), 300); }}
            className="p-6 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-3xl transition-all group backdrop-blur-xl"
          >
            <Ghost className="group-hover:scale-125 transition-transform text-rose-500" size={28} />
          </button>
        </motion.div>

        {/* Sticky Note */}
        <motion.div style={{ translateZ: '180px' }} className="absolute bottom-12 left-12 p-8 bg-amber-400/5 border border-amber-400/10 rounded-[2.5rem] backdrop-blur-3xl rotate-[-2deg] w-72 shadow-2xl">
          <div className="flex items-center gap-3 mb-6 text-amber-400/60 font-black uppercase text-[9px] tracking-widest"><Edit3 size={16} /> Note</div>
          <textarea className="w-full bg-transparent text-amber-200/80 text-[12px] h-28 resize-none outline-none" defaultValue="Every pixel matters. Build the future." />
        </motion.div>

      </motion.div>

      <div className="fixed bottom-10 left-10 text-[9px] text-slate-700 font-black uppercase tracking-[0.5em]">
        System_v5 // Perspective_Engine_Active
      </div>
    </div>
  );
}