"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BIBLE_VERSES, PRINCIPLES, PRAYER_CATEGORIES } from "@/lib/constants";

export default function Landing() {
  const [slide, setSlide]       = useState(0);
  const [scrollY, setScrollY]   = useState(0);

  /* auto-advance verse slideshow */
  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % BIBLE_VERSES.length), 6500);
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
            className="absolute w-[3px] h-[3px] rounded-full bg-yellow-300/30 pointer-events-none"
            style={{ left: `${6 + i * 6.5}%`, top: `${15 + (i % 5) * 16}%` }}
            animate={{ y: [0, -18, 0], opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.25 }}
          />
        ))}

        {/* ── Navbar ── */}
        <nav className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 md:px-10 py-5">
          <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="flex items-center gap-2.5">
            <div className="relative w-9 h-9 rounded-full border border-yellow-500/40 bg-yellow-500/10 flex items-center justify-center">
              <span className="text-yellow-300 text-base leading-none">✝</span>
              <span className="absolute inset-0 rounded-full animate-ping bg-yellow-400/10" />
            </div>
            <span className="font-serif text-xl text-white tracking-wide">Prayer<span className="text-yellow-400">Book</span></span>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Link href="/dashboard" className="px-5 py-2 rounded-full border border-yellow-500/40 text-yellow-200 text-sm font-sans backdrop-blur-sm hover:bg-yellow-500/15 transition-all duration-200">
              Open App →
            </Link>
          </motion.div>
        </nav>

        {/* ── Hero copy ── */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-yellow-400/70 text-[11px] uppercase tracking-[0.35em] mb-5 font-sans flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-yellow-500/40 inline-block" />
            Your Sacred Prayer Journal
            <span className="h-px w-10 bg-yellow-500/40 inline-block" />
          </motion.p>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.9 }} className="font-serif text-5xl md:text-7xl lg:text-8xl text-white mb-6 leading-[1.08]">
            Grow in Faith<br />
            <span className="italic text-yellow-300">One Prayer</span><br />
            at a Time
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="text-white/55 text-base md:text-lg max-w-xl mx-auto mb-10 font-sans leading-relaxed">
            Track every prayer, celebrate answered ones, build faithful streaks, and watch your walk with God deepen throughout the year.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-[#1a1209] font-semibold font-sans text-sm shadow-xl shadow-yellow-900/30">
              ✝ &nbsp;Start Praying Today
            </Link>
            <a href="#principles" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-white/20 text-white/70 font-sans text-sm hover:border-white/40 hover:text-white transition-all duration-200">
              Learn More ↓
            </a>
          </motion.div>
        </div>

        {/* ── Verse slide strip ── */}
        <div className="absolute bottom-0 inset-x-0 z-10 pb-6 px-6">
          <AnimatePresence mode="wait">
            <motion.div key={slide} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.7 }} className="text-center">
              <p className="text-white/75 text-sm md:text-base font-serif italic max-w-2xl mx-auto leading-relaxed">
                &ldquo;{v.verse}&rdquo;
              </p>
              <p className="text-yellow-400/60 text-xs mt-2 font-sans uppercase tracking-widest">— {v.ref}</p>
            </motion.div>
          </AnimatePresence>
          {/* dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            {BIBLE_VERSES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} className={`rounded-full transition-all duration-300 ${i === slide ? "w-5 h-1 bg-yellow-400" : "w-1 h-1 bg-white/25 hover:bg-white/50"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ PRINCIPLES ════════════ */}
      <section id="principles" className="py-24 px-6 bg-[#0d0a06]">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-yellow-500/50 text-[10px] uppercase tracking-[0.3em] mb-4 font-sans">Core Philosophy</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white mb-4">
              The Heart of <span className="italic text-yellow-300">PrayerBook</span>
            </h2>
            <p className="text-white/40 max-w-md mx-auto font-sans text-sm leading-relaxed">
              Six biblical principles that guide every prayer recorded in this journal.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PRINCIPLES.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} whileHover={{ y: -5 }}
                className="group relative p-6 rounded-2xl border border-yellow-900/25 bg-[#130f07]/70 overflow-hidden cursor-default">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/4 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative z-10">
                  <span className="text-3xl block mb-4">{p.icon}</span>
                  <h3 className="font-serif text-white text-lg mb-1">{p.title}</h3>
                  <p className="text-yellow-500/50 text-[10px] uppercase tracking-wider mb-3 font-sans">{p.verse}</p>
                  <p className="text-white/45 text-sm font-sans leading-relaxed">{p.desc}</p>
                </div>
                <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-yellow-700/30 to-transparent" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ CATEGORIES ════════════ */}
      <section className="py-20 px-6 bg-[#0f0c07]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-3">Every Prayer Has a <span className="italic text-yellow-300">Place</span></h2>
            <p className="text-white/40 text-sm font-sans">Ten categories to organise your prayer life.</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-2.5">
            {PRAYER_CATEGORIES.map((c, i) => (
              <motion.span key={c.id} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }} whileHover={{ scale: 1.06 }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-yellow-900/25 bg-[#1a1209]/60 text-white/65 text-sm font-sans cursor-default">
                {c.icon} {c.label}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════ FEATURES ════════════ */}
      <section className="py-20 px-6 bg-[#0d0a06]">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: "🔥", title: "Prayer Streaks",    desc: "Build momentum with daily prayer streaks and milestone badges." },
            { icon: "📊", title: "Year Heatmap",      desc: "A GitHub-style view of your entire prayer year at a glance." },
            { icon: "✨", title: "Answered Prayers",  desc: "Mark and celebrate every testimony of God's faithfulness." },
          ].map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }} className="text-center px-4">
              <div className="text-5xl mb-5">{f.icon}</div>
              <h3 className="font-serif text-xl text-white mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm font-sans leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════ CTA ════════════ */}
      <section className="py-28 px-6 relative overflow-hidden bg-[#0d0a06]">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-serif text-yellow-400 animate-cross-glow select-none" style={{ fontSize: "28vw", lineHeight: 1 }}>✝</span>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative z-10 text-center max-w-xl mx-auto">
          <h2 className="font-serif text-4xl md:text-6xl text-white mb-5 leading-tight">
            Your Prayer Life<br /><span className="italic text-yellow-300">Starts Here</span>
          </h2>
          <p className="text-white/40 text-sm font-sans mb-8 leading-relaxed">
            No account needed. Open the app, add your first prayer, and begin your journey.
          </p>
          <Link href="/dashboard" className="btn-gold inline-flex items-center gap-2 px-10 py-4 rounded-full text-[#1a1209] font-semibold font-sans text-base shadow-2xl shadow-yellow-900/40">
            ✝ &nbsp;Open PrayerBook
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-7 px-6 border-t border-yellow-900/15 text-center">
        <p className="text-white/20 text-xs font-sans">© {new Date().getFullYear()} PrayerBook · Built for the faithful · ✝</p>
      </footer>
    </div>
  );
}
