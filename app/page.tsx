"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BIBLE_VERSES } from "@/lib/constants";

export default function Landing() {
  const [slide, setSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  /* auto-advance verse slideshow */
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % BIBLE_VERSES.length), 15000);
    return () => clearInterval(t);
  }, []);

  /* parallax */
  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const v = BIBLE_VERSES[slide];

  return (
    <div className="grain bg-[#0d0a06] min-h-screen overflow-x-hidden">

      {/* ════════════ HERO ════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Background image with parallax + crossfade */}
        <div className="absolute inset-0" style={{ transform: `translateY(${scrollY * 0.35}px)` }}>
          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.6 }} className="absolute inset-0">
              <Image src={v.img} alt="" fill className="object-cover" priority />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d0a06]/75 via-[#0d0a06]/40 to-[#0d0a06]/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0a06]/50 via-transparent to-[#0d0a06]/50" />
        </div>

        {/* Floating particles */}
        {[...Array(14)].map((_, i) => (
          <motion.span
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full bg-emerald-300/30 pointer-events-none"
            style={{ left: `${6 + i * 6.5}%`, top: `${15 + (i % 5) * 16}%` }}
            animate={{ y: [0, -18, 0], opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}

        {/* ── Navbar ── */}
        <nav className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 md:px-10 py-5">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full border border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center">
              <span className="text-emerald-300 text-base leading-none">✝</span>
              <span className="absolute inset-0 rounded-full animate-ping bg-emerald-400/10" />
            </div>
            <span className="font-serif text-xl text-white tracking-wide">Prayer<span className="text-emerald-400">Book</span></span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Link href="/dashboard" className="px-5 py-2 rounded-full border border-emerald-500/40 text-emerald-200 text-sm font-sans backdrop-blur-sm hover:bg-emerald-500/15 transition-all duration-200">
              Open App →
            </Link>
          </motion.div>
        </nav>

        {/* ── Hero copy ── */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center justify-center h-full pb-32">
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 1.2 }} className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.08] drop-shadow-lg">
            Grow in Faith<br />
            <span className="italic text-emerald-300">One Prayer</span><br />
            at a Time
          </motion.h1>
        </div>

        {/* ── Verse slide strip ── */}
        <div className="absolute bottom-10 inset-x-0 z-30 pb-6 px-4">
          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.7 }} className="text-center bg-black/45 backdrop-blur-md p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto border border-white/10 shadow-2xl">
              <p className="text-white text-xl md:text-2xl lg:text-3xl font-serif italic max-w-3xl mx-auto leading-relaxed drop-shadow-md">
                &ldquo;{v.verse}&rdquo;
              </p>
              <p className="text-emerald-400 text-sm md:text-base mt-4 font-sans uppercase tracking-[0.2em] font-medium">— {v.ref}</p>
            </motion.div>
          </AnimatePresence>
          {/* dots */}
          <div className="flex justify-center gap-2 mt-8 z-40 relative">
            {BIBLE_VERSES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} className={`rounded-full transition-all duration-300 ${i === slide ? "w-8 h-1.5 bg-emerald-400" : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50"}`} />
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
