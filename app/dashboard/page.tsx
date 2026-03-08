"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getPrayers, getStreak, getStats } from "@/lib/store";
import { yearProgress } from "@/lib/utils";
import { getCat } from "@/lib/constants";

export default function Overview() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const prayers  = getPrayers();
  const streak   = getStreak();
  const stats    = getStats(prayers);
  const yp       = yearProgress();

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const prayedToday = streak.lastPrayedAt === new Date().toISOString().split("T")[0];

  return (
    <div className="p-6 md:p-8 bg-parchment-50 min-h-screen">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <p className="text-ink-600/50 text-xs font-sans mb-1">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
        <h1 className="font-serif text-3xl text-ink-900">{greet()}, <span className="italic text-yellow-600">faithful one</span> 🙏</h1>
      </motion.div>

      {/* Year progress */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/70 border border-parchment-300/50 rounded-2xl p-5 mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <p className="font-serif text-ink-900 font-medium">Your {new Date().getFullYear()} Prayer Journey</p>
            <p className="text-ink-600/45 text-xs font-sans mt-0.5">Day {yp.day} of {yp.total} · {yp.pct}% through the year</p>
          </div>
          <span className="font-serif text-3xl font-bold text-yellow-600">{yp.pct}%</span>
        </div>
        <div className="h-2 bg-parchment-200 rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${yp.pct}%` }} transition={{ duration: 1.1, delay: 0.3 }}
            className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-400" />
        </div>
        <p className="text-ink-600/35 text-[11px] font-sans mt-1.5">{yp.total - yp.day} days left to pray faithfully this year</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
        {[
          { label: "Total Prayers",    value: stats.total,        icon: "📖", grad: "from-amber-400 to-yellow-500" },
          { label: "Answered",         value: stats.answered,     icon: "✨", grad: "from-emerald-400 to-teal-500" },
          { label: "Prayer Sessions",  value: stats.totalEntries, icon: "🙏", grad: "from-violet-400 to-purple-500" },
          { label: "Day Streak",       value: streak.currentStreak, icon: "🔥", grad: "from-orange-400 to-red-500" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 * i + 0.2 }}
            className="bg-white/70 border border-parchment-300/40 rounded-2xl p-5">
            <div className="text-2xl mb-2.5">{s.icon}</div>
            <div className={`font-serif text-3xl font-bold bg-gradient-to-r ${s.grad} bg-clip-text text-transparent`}>{s.value}</div>
            <p className="text-ink-600/50 text-xs font-sans mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Streak banner */}
      {streak.currentStreak > 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-ink-900 to-ink-800 rounded-2xl p-5 mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="streak-fire text-2xl">🔥</span>
              <span className="font-serif text-2xl text-white">{streak.currentStreak} Day Streak!</span>
            </div>
            <p className="text-white/40 text-xs font-sans">Longest: {streak.longestStreak} days · Total: {streak.totalDays} prayer days</p>
          </div>
          <Link href="/dashboard/prayers" className="btn-gold px-4 py-2 rounded-xl text-ink-900 text-xs font-semibold font-sans whitespace-nowrap flex-shrink-0">
            + Log Prayer
          </Link>
        </motion.div>
      )}

      {/* Prayed today badge */}
      {!prayedToday && prayers.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <span className="text-2xl">⏰</span>
          <div className="flex-1">
            <p className="font-sans text-sm font-medium text-amber-800">You haven&apos;t prayed today yet</p>
            <p className="font-sans text-xs text-amber-600/70">Open a prayer and tap <strong>Mark Prayed</strong> to keep your streak alive.</p>
          </div>
          <Link href="/dashboard/prayers" className="text-amber-700 text-xs font-semibold font-sans hover:text-amber-800">Go →</Link>
        </motion.div>
      )}

      {/* Category breakdown */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-white/70 border border-parchment-300/40 rounded-2xl p-5 mb-5">
        <h2 className="font-serif text-lg text-ink-900 mb-4">Prayer Categories</h2>
        {stats.categoryBreakdown.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-ink-600/40 text-sm font-sans mb-2">No prayers yet.</p>
            <Link href="/dashboard/prayers" className="text-yellow-600 text-sm font-medium hover:text-yellow-700">Add your first prayer →</Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {stats.categoryBreakdown.slice(0, 6).map((item) => {
              const cat = getCat(item.category);
              const max = stats.categoryBreakdown[0].count;
              return (
                <div key={item.category} className="flex items-center gap-3">
                  <span className="text-base w-5 text-center">{cat.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-sans text-ink-700/60">{cat.label}</span>
                      <span className="text-xs font-sans text-ink-600/40">{item.count}</span>
                    </div>
                    <div className="h-1.5 bg-parchment-200 rounded-full">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(item.count / max) * 100}%` }} transition={{ duration: 0.8, delay: 0.7 }}
                        className="h-full rounded-full bg-gradient-to-r from-yellow-500 to-amber-400" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Quick links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { href: "/dashboard/prayers",           icon: "➕", label: "Add Prayer",     sub: "New request" },
          { href: "/dashboard/streak",            icon: "📊", label: "Heatmap",        sub: "Year overview" },
          { href: "/dashboard/answered",          icon: "✨", label: "Testimonies",    sub: "Answered prayers" },
          { href: "/dashboard/prayers?cat=DAILY", icon: "🌅", label: "Daily Prayer",   sub: "Today's routine" },
        ].map((l, i) => (
          <motion.div key={l.href} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 + i * 0.05 }}>
            <Link href={l.href} className="block bg-white/50 border border-parchment-300/40 rounded-xl p-4 hover:bg-white/80 transition-all duration-200 prayer-card group">
              <span className="text-2xl block mb-2 group-hover:scale-110 transition-transform duration-200">{l.icon}</span>
              <p className="font-sans font-medium text-ink-900 text-sm">{l.label}</p>
              <p className="font-sans text-ink-600/40 text-xs mt-0.5">{l.sub}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
