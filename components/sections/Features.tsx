"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Clock,
    Zap,
    BarChart3,
    MessageSquare,
    Shield,
    Sparkles,
} from "lucide-react";
import { features, C } from "@/lib/landing-data";
import { cn } from "@/lib/utils";

// --- Ultra-Compact Minimalist Visuals ---

const VisualScheduling = () => {
    return (
        <div className="relative flex items-center justify-center w-full h-[180px]">
            <div className="relative w-32 h-32 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.01]">
                {/* Clock Hands */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[1px] h-12 bg-gradient-to-t from-white/40 to-transparent origin-bottom bottom-1/2 left-[calc(50%-0.5px)]"
                />
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[1px] h-8 bg-white/60 origin-bottom bottom-1/2 left-[calc(50%-0.5px)]"
                />
                
                 {/* Subtle Ticks */}
                {[0, 3, 6, 9].map((i) => (
                    <div
                        key={i}
                        className="absolute w-1 h-1 bg-white/20 rounded-full"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-60px)`,
                        }}
                    />
                ))}
            </div>
             
             {/* Floating Compact Posts */}
            {[0, 1].map((i) => (
                <motion.div
                    key={i}
                    className="absolute w-20 h-6 rounded-full border border-white/10 flex items-center justify-center bg-[#050505] shadow-lg"
                    initial={{ opacity: 0, scale: 0.8, x: 0 }}
                    animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0.9, 1, 1, 0.9],
                        x: [0, (i === 0 ? 1 : -1) * 50],
                         y: [0, (i === 0 ? -1 : 1) * 30],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "easeInOut",
                    }}
                >
                    <div className="w-8 h-0.5 bg-white/20 rounded-full" />
                </motion.div>
            ))}
        </div>
    );
};

const VisualAutoPlug = () => {
    return (
        <div className="relative flex items-center justify-center w-full h-[180px]">
             {/* Center Node */}
             <div className="relative w-16 h-16 rounded-xl flex items-center justify-center bg-white/[0.03] border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <Zap className="w-6 h-6 text-white" strokeWidth={1.5} />
             </div>
             
             {/* Pulses moving out */}
              {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 border border-white/5 rounded-xl"
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.6,
                        ease: "easeOut"
                    }}
                  />
              ))}

            {/* Connecting Lines */}
            <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent top-1/2 -translate-y-1/2" />
        </div>
    );
};

const VisualAnalytics = () => {
    return (
        <div className="relative flex items-end justify-center gap-2 w-full h-[180px] pb-8 px-12">
            {[40, 70, 50, 90, 60, 85].map((height, i) => (
                <motion.div
                    key={i}
                    className="w-8 bg-white/5 rounded-t-sm relative overflow-hidden border-t border-x border-white/5"
                    initial={{ height: 0 }}
                    whileInView={{ height: height * 1.2 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                    <motion.div 
                        className="absolute bottom-0 left-0 w-full bg-white"
                        animate={{ 
                            height: ["0%", "100%", "0%"],
                            opacity: [0, 0.5, 0]
                        }}
                        transition={{ 
                            duration: 3, 
                            delay: i * 0.2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </motion.div>
            ))}
        </div>
    );
};

const VisualTemplates = () => {
    return (
        <div className="relative flex items-center justify-center w-full h-[180px]">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute w-40 h-24 bg-[#0A0A0A] border border-white/10 rounded-lg shadow-xl flex flex-col p-3 gap-2"
                    initial={{ y: 0, scale: 0.9, opacity: 0 }}
                    animate={{
                        y: i * -12 + 12,
                        scale: 1 - i * 0.04,
                        opacity: 1 - i * 0.2,
                        zIndex: 3 - i,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="flex items-center gap-2">
                         <div className="w-5 h-5 rounded-full bg-white/10" />
                         <div className="w-16 h-1.5 bg-white/10 rounded-full" />
                    </div>
                     <div className="w-full h-1.5 bg-white/5 rounded-full mt-1" />
                     <div className="w-2/3 h-1.5 bg-white/5 rounded-full" />
                </motion.div>
            ))}
        </div>
    );
};

const VisualX = () => {
    return (
        <div className="relative flex items-center justify-center w-full h-[180px]">
             <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12 text-white relative z-10"
            >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
             
             {[0, 1].map(i => (
                 <motion.div
                    key={i}
                    className="absolute w-[140px] h-[70px] rounded-[100%] border border-white/10"
                    style={{ rotate: i * 45 }}
                    animate={{ rotate: [i * 45, i * 45 + 360] }}
                    transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
                 >
                     <div className="absolute top-0 left-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_white]" />
                 </motion.div>
             ))}
        </div>
    );
};

const FEATURE_VISUALS = [
    VisualScheduling,
    VisualAutoPlug,
    VisualAnalytics,
    VisualTemplates,
    VisualX,
];

export function Features() {
    const [activeIndex, setActiveIndex] = useState(0);
    const ActiveVisual = FEATURE_VISUALS[activeIndex] || VisualScheduling;
    const activeFeature = features[activeIndex];

    return (
        <section id="features" className="py-16 md:py-20">
             {/* Header */}
            <div className="mb-10 text-center">
                <div
                    className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium tracking-wide uppercase"
                    style={{
                        borderColor: C.border,
                        color: C.textMuted,
                        background: "transparent",
                    }}
                >
                    <Sparkles className="h-3 w-3" />
                    Power Tools
                </div>
                <h2
                    className="font-serif font-medium tracking-tight leading-[1.1]"
                    style={{
                        color: C.text,
                        fontSize: "clamp(28px, 4vw, 40px)",
                    }}
                >
                    Built for growth.
                </h2>
            </div>

            {/* Compact Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
                {features.map((feature, i) => {
                    const isActive = activeIndex === i;
                    const Icon = feature.icon;
                    return (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={cn(
                                "relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 whitespace-nowrap",
                                isActive 
                                    ? "text-black" 
                                    : "text-zinc-500 hover:text-zinc-300"
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-white rounded-full"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                <Icon size={14} strokeWidth={isActive ? 2 : 1.5} />
                                {feature.title}
                            </span>
                        </button>
                    )
                })}
            </div>

            {/* Compact Display Card */}
            <div className="relative mx-auto w-full max-w-2xl">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeIndex}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="rounded-xl overflow-hidden border shadow-sm group"
                        style={{
                            background: C.surface,
                            borderColor: C.border,
                        }}
                    >
                        {/* Visual Area - Reduced Height */}
                        <div className="w-full h-[200px] bg-gradient-to-b from-white/[0.01] to-transparent flex items-center justify-center border-b border-white/5 relative overflow-hidden">
                             {/* Static Grid Background */}
                             <div 
                                className="absolute inset-0 opacity-[0.03]" 
                                style={{ 
                                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                                    backgroundSize: '24px 24px' 
                                }} 
                             />
                            <ActiveVisual />
                        </div>

                        {/* Text Content - Compact */}
                        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                                     <activeFeature.icon size={18} className="text-zinc-400" />
                                    {activeFeature.title}
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed max-w-md">
                                    {activeFeature.desc}
                                </p>
                            </div>
                            
                            {/* Optional: Small 'Learn' arrow or indicator could go here */}
                             <div className="hidden md:block">
                                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:border-white/20 transition-colors">
                                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M2.5 6H9.5M9.5 6L6 2.5M9.5 6L6 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </div>
                             </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
                
                {/* Refined Glow */}
                <div 
                    className="absolute -inset-1 bg-white/5 blur-xl -z-10 rounded-[2rem] opacity-0 transition-opacity duration-700 active-glow" 
                    style={{ opacity: 0.3 }}
                />
            </div>
        </section>
    );
}

// Global stylesheet for hiding scrollbar if needed
// .no-scrollbar::-webkit-scrollbar { display: none; }
// .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
