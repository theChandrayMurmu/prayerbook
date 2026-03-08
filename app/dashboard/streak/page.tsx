"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPrayers, getStreak, buildHeatmap } from "@/lib/store";
import { MILESTONES } from "@/lib/constants";

const MONTHS   = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LBLS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function cellColor(n: number) {
  if (n === 0) return "bg-parchment-200/60";
  if (n === 1) return "bg-emerald-200";
  if (n === 2) return "bg-emerald-400";
  if (n === 3) return "bg-teal-500";
  return "bg-teal-700";
}

export default function StreakPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const prayers = getPrayers();
  const streak  = getStreak();
  const heatmap = buildHeatmap(prayers);

  const year  = new Date().getFullYear();
  const start = new Date(year, 0, 1);
  const end   = new Date(year, 11, 31);

  /* Build array of all days in year */
  const allDays: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    allDays.push(new Date(d));
  }

  /* Pad to start from Sunday */
  const pad = start.getDay();
  const paddedDays: (Date | null)[] = [...Array(pad).fill(null), ...allDays];

  /* Chunk into weeks */
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < paddedDays.length; i += 7) weeks.push(paddedDays.slice(i, i + 7));

  /* Month labels */
  const monthLabels: { label: string; col: number }[] = [];
  let lastM = -1;
  weeks.forEach((week, wi) => {
    const first = week.find(Boolean) as Date | undefined;
    if (first) {
      const m = first.getMonth();
      if (m !== lastM) { monthLabels.push({ label: MONTHS[m], col: wi }); lastM = m; }
    }
  });

  const todayStr     = new Date().toISOString().split("T")[0];
  const prayedToday  = streak.lastPrayedAt === todayStr;

  return (
    <div className="p-6 md:p-8 bg-parchment-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="font-serif text-3xl text-ink-900">Streak & Progress</h1>
        <p className="text-ink-600/45 text-sm font-sans mt-0.5">Your prayer journey visualised through {year}</p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-7">
        {[
          { label: "Current Streak", value: streak.currentStreak, icon: "🔥", fire: true },
          { label: "Longest Streak", value: streak.longestStreak, icon: "🏆" },
          { label: "Total Prayer Days", value: streak.totalDays, icon: "📅" },
          { label: "Prayed Today", value: prayedToday ? "Yes ✓" : "Not yet", icon: prayedToday ? "✅" : "⏰" },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-white/70 border border-parchment-300/40 rounded-2xl p-5">
            <div className={`text-3xl mb-2 ${s.fire && streak.currentStreak > 0 ? "streak-fire" : ""}`}>{s.icon}</div>
            <div className="font-serif text-2xl font-bold text-ink-900">{s.value}</div>
            <p className="text-ink-600/45 text-xs font-sans mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Heatmap */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-white/70 border border-parchment-300/40 rounded-2xl p-5 mb-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="font-serif text-lg text-ink-900">{year} Prayer Heatmap</h2>
            <p className="text-ink-600/40 text-xs font-sans mt-0.5">Each cell = one day. Darker = more prayers logged.</p>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-ink-600/40 font-sans">
            <span>Less</span>
            {[0,1,2,3,4].map((n) => <div key={n} className={`w-3 h-3 rounded-sm ${cellColor(n)}`} />)}
            <span>More</span>
          </div>
        </div>

        <div className="flex gap-2.5">
          {/* Day-of-week labels */}
          <div className="flex flex-col gap-px pt-6">
            {DAY_LBLS.map((d, i) => (
              <div key={d} className={`h-[11px] text-[8px] text-ink-600/30 font-sans leading-none ${i % 2 === 0 ? "opacity-0" : ""}`}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div>
            {/* Month labels row */}
            <div className="relative h-5 mb-0.5" style={{ width: weeks.length * 13 }}>
              {monthLabels.map(({ label, col }) => (
                <span key={label} className="absolute text-[9px] text-ink-600/35 font-sans" style={{ left: col * 13 }}>{label}</span>
              ))}
            </div>
            {/* Cell grid */}
            <div className="flex gap-px">
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-px">
                  {week.map((day, di) => {
                    if (!day) return <div key={di} className="w-[11px] h-[11px]" />;
                    const key     = day.toISOString().split("T")[0];
                    const count   = heatmap[key] ?? 0;
                    const isToday = key === todayStr;
                    const future  = day > new Date();
                    return (
                      <motion.div key={di}
                        title={`${day.toLocaleDateString("en-US",{month:"short",day:"numeric"})}: ${count} prayer${count!==1?"s":""}`}
                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: wi * 0.003 }}
                        className={`w-[11px] h-[11px] rounded-[2px] hm-cell ${
                          future ? "bg-parchment-200/20"
                          : isToday ? `${cellColor(count)} ring-1 ring-emerald-500 ring-offset-1 ring-offset-parchment-50`
                          : cellColor(count)
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Milestones */}
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white/70 border border-parchment-300/40 rounded-2xl p-5">
        <h2 className="font-serif text-lg text-ink-900 mb-4">Streak Milestones</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
          {MILESTONES.map((m) => {
            const achieved = streak.longestStreak >= m;
            return (
              <motion.div key={m} whileHover={{ scale: 1.05 }}
                className={`text-center p-3 rounded-xl border transition-all ${
                  achieved ? "border-emerald-300 bg-emerald-50" : "border-parchment-300/40 bg-parchment-50/50 opacity-50"
                }`}>
                <div className="text-xl mb-0.5">{achieved ? "🏆" : "🔒"}</div>
                <div className="font-serif text-sm font-bold text-ink-900">{m}</div>
                <div className="text-[10px] text-ink-600/40 font-sans">days</div>
              </motion.div>
            );
          })}
        </div>
        {streak.longestStreak === 0 && (
          <p className="text-center text-ink-600/35 text-xs font-sans mt-4">Log your first prayer to start earning milestones!</p>
        )}
      </motion.div>
    </div>
  );
}
