"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getPrayers, Prayer } from "@/lib/store";
import { getCat } from "@/lib/constants";
import { fmtDate, relativeDate } from "@/lib/utils";

export default function AnsweredPage() {
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPrayers(getPrayers().filter((p) => p.isAnswered));
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-6 md:p-8 bg-parchment-50 min-h-screen">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-7">
        <h1 className="font-serif text-3xl text-ink-900">Answered Prayers</h1>
        <p className="text-ink-600/45 text-sm font-sans mt-0.5">
          A testimony of God&apos;s faithfulness — {prayers.length} answered {prayers.length === 1 ? "prayer" : "prayers"}
        </p>
      </motion.div>

      {prayers.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="text-6xl mb-4">✨</div>
          <p className="font-serif text-xl text-ink-900 mb-2">Your testimony awaits</p>
          <p className="text-ink-600/45 text-sm font-sans max-w-sm mx-auto leading-relaxed">
            When God answers a prayer, open it and tap <strong>Answered!</strong> to record His faithfulness here.
          </p>
        </motion.div>
      ) : (
        <>
          {/* Banner */}
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-ink-900 to-ink-800 rounded-2xl p-6 mb-7 text-center">
            <div className="flex items-center justify-center gap-3 mb-1">
              <span className="text-3xl">✨</span>
              <span className="font-serif text-5xl text-emerald-300 font-bold">{prayers.length}</span>
              <span className="text-3xl">✨</span>
            </div>
            <p className="text-white/50 font-sans text-sm">prayers answered by God</p>
            <p className="text-emerald-500/40 text-xs font-sans mt-1.5 italic font-serif">
              &ldquo;He has done great things for us, and we are filled with joy.&rdquo; — Psalm 126:3
            </p>
          </motion.div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {prayers.map((prayer, i) => {
              const cat = getCat(prayer.category);
              return (
                <motion.div key={prayer.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="bg-white/70 border border-emerald-200/50 rounded-2xl p-5 prayer-card relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/25 to-transparent pointer-events-none" />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{cat.icon}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>{cat.label}</span>
                      </div>
                      <span className="text-lg">✨</span>
                    </div>
                    <h3 className="font-serif text-ink-900 font-medium mb-1.5">{prayer.title}</h3>
                    {prayer.description && <p className="text-ink-600/45 text-xs font-sans line-clamp-2 mb-3">{prayer.description}</p>}
                    <div className="pt-3 border-t border-emerald-100 flex flex-wrap gap-2 items-center justify-between text-[11px] text-ink-600/35 font-sans">
                      <span>🙏 Prayed {prayer.entries.length}× faithfully</span>
                      {prayer.answeredAt && <span className="text-emerald-600/70">Answered {fmtDate(prayer.answeredAt)}</span>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
