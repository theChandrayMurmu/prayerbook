"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { getPrayers, addPrayer, logPrayer, markAnswered, deletePrayer, Prayer } from "@/lib/store";
import { PRAYER_CATEGORIES, getCat } from "@/lib/constants";
import { relativeDate, fmtDate } from "@/lib/utils";
import type { PrayerCategory } from "@/lib/store";

export default function PrayersPage() {
  const searchParams   = useSearchParams();
  const [prayers, setPrayers]     = useState<Prayer[]>([]);
  const [filter, setFilter]       = useState("ALL");
  const [showAdd, setShowAdd]     = useState(false);
  const [selected, setSelected]   = useState<Prayer | null>(null);
  const [prayingId, setPrayingId] = useState<string | null>(null);
  const [mounted, setMounted]     = useState(false);

  const load = useCallback(() => {
    const all = getPrayers();
    setPrayers(filter === "ALL" ? all : all.filter((p) => p.category === filter));
  }, [filter]);

  useEffect(() => {
    setMounted(true);
    const cat = searchParams.get("cat");
    if (cat) setFilter(cat);
  }, [searchParams]);

  useEffect(() => { if (mounted) load(); }, [mounted, filter, load]);

  const handleLog = (id: string) => {
    setPrayingId(id);
    logPrayer(id);
    setTimeout(() => { setPrayingId(null); load(); }, 600);
  };

  const handleAnswered = (id: string) => {
    markAnswered(id);
    setSelected(null);
    load();
  };

  const handleDelete = (id: string) => {
    if (!confirm("Remove this prayer?")) return;
    deletePrayer(id);
    setSelected(null);
    load();
  };

  if (!mounted) return null;

  return (
    <div className="p-6 md:p-8 bg-parchment-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl text-ink-900">My Prayers</h1>
          <p className="text-ink-600/45 text-sm font-sans mt-0.5">{prayers.length} prayer{prayers.length !== 1 ? "s" : ""}</p>
        </div>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowAdd(true)}
          className="btn-gold px-5 py-2.5 rounded-xl text-ink-900 font-semibold font-sans text-sm flex items-center gap-1.5 flex-shrink-0">
          + Add Prayer
        </motion.button>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {["ALL", ...PRAYER_CATEGORIES.map((c) => c.id)].map((id) => {
          const cat = id !== "ALL" ? getCat(id) : null;
          return (
            <button key={id} onClick={() => setFilter(id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans transition-all ${
                filter === id ? "bg-ink-900 text-yellow-300" : "bg-white/60 text-ink-700/55 hover:bg-white border border-parchment-300/50"
              }`}>
              {cat ? <>{cat.icon} {cat.label}</> : "All"}
            </button>
          );
        })}
      </div>

      {/* Prayer grid */}
      {prayers.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="text-6xl mb-4">🙏</div>
          <p className="font-serif text-xl text-ink-900 mb-2">Begin your prayer journey</p>
          <p className="text-ink-600/45 text-sm font-sans mb-6 max-w-xs mx-auto">Add your first prayer request and start tracking your walk with God.</p>
          <button onClick={() => setShowAdd(true)} className="btn-gold px-6 py-3 rounded-xl text-ink-900 font-semibold font-sans text-sm">
            Add First Prayer
          </button>
        </motion.div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {prayers.map((prayer, i) => {
              const cat = getCat(prayer.category);
              return (
                <motion.div key={prayer.id} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ delay: i * 0.04 }}
                  onClick={() => setSelected(prayer)}
                  className={`bg-white/70 border rounded-2xl p-5 prayer-card cursor-pointer ${prayer.isAnswered ? "border-emerald-200/60" : "border-parchment-300/40"}`}>
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{cat.icon}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans ${cat.bg} ${cat.text}`}>{cat.label}</span>
                    </div>
                    {prayer.isAnswered && <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-sans flex-shrink-0">✨ Answered</span>}
                  </div>

                  <h3 className="font-serif text-ink-900 font-medium text-base mb-1.5 line-clamp-2">{prayer.title}</h3>
                  {prayer.description && <p className="text-ink-600/45 text-xs font-sans line-clamp-2 mb-3">{prayer.description}</p>}

                  {/* Footer row */}
                  <div className="flex items-center justify-between pt-3 border-t border-parchment-200 mt-auto">
                    <span className="text-[11px] text-ink-600/35 font-sans">🙏 {prayer.entries.length}× · {relativeDate(prayer.createdAt)}</span>
                    {!prayer.isAnswered && (
                      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                        onClick={(e) => { e.stopPropagation(); handleLog(prayer.id); }}
                        className={`text-[11px] px-3 py-1.5 rounded-lg font-sans font-medium transition-colors flex-shrink-0 ${
                          prayingId === prayer.id ? "bg-emerald-100 text-emerald-700" : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        }`}>
                        {prayingId === prayer.id ? "✓ Prayed!" : "🙏 Prayed"}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && <AddModal onClose={() => setShowAdd(false)} onDone={() => { load(); setShowAdd(false); }} />}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <DetailModal prayer={selected} onClose={() => setSelected(null)}
            onLog={() => { handleLog(selected.id); setSelected(null); }}
            onAnswered={() => handleAnswered(selected.id)}
            onDelete={() => handleDelete(selected.id)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Add Modal ───────────────────────────────────────────── */
function AddModal({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [title, setTitle]   = useState("");
  const [desc, setDesc]     = useState("");
  const [cat, setCat]       = useState<PrayerCategory>("DAILY");
  const [saving, setSaving] = useState(false);

  const submit = () => {
    if (!title.trim()) return;
    setSaving(true);
    addPrayer({ title: title.trim(), description: desc.trim(), category: cat });
    setTimeout(onDone, 200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-5" onClick={onClose}>
      <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-parchment-50 border border-parchment-300 rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="font-serif text-2xl text-ink-900 mb-1">New Prayer</h2>
        <p className="text-ink-600/40 text-xs font-sans mb-5">Bring your request before God</p>

        <div className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-wide text-ink-600/50 font-sans mb-1 block">Prayer Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What are you praying for?" className="pb-input" autoFocus />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wide text-ink-600/50 font-sans mb-1 block">Details (optional)</label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Share more about this request..." rows={3} className="pb-input resize-none" />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wide text-ink-600/50 font-sans mb-2 block">Category</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRAYER_CATEGORIES.map((c) => (
                <button key={c.id} onClick={() => setCat(c.id as PrayerCategory)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-sans transition-all text-left ${
                    cat === c.id ? "border-yellow-400 bg-yellow-50 text-yellow-800" : "border-parchment-300/50 bg-white/50 text-ink-700/55 hover:border-yellow-300"
                  }`}>
                  <span>{c.icon}</span><span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-parchment-300/50 text-ink-600/50 font-sans text-sm hover:bg-parchment-100 transition-colors">Cancel</button>
            <motion.button onClick={submit} disabled={saving || !title.trim()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex-1 py-3 rounded-xl btn-gold text-ink-900 font-semibold font-sans text-sm">
              {saving ? "Adding…" : "Add Prayer 🙏"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Detail Modal ────────────────────────────────────────── */
function DetailModal({ prayer, onClose, onLog, onAnswered, onDelete }:
  { prayer: Prayer; onClose: () => void; onLog: () => void; onAnswered: () => void; onDelete: () => void }) {
  const cat = getCat(prayer.category);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-5" onClick={onClose}>
      <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-parchment-50 border border-parchment-300 rounded-3xl p-6 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">{cat.icon}</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full ${cat.bg} ${cat.text}`}>{cat.label}</span>
          </div>
          <button onClick={onClose} className="text-ink-600/30 hover:text-ink-600/60 text-2xl leading-none">×</button>
        </div>

        <h2 className="font-serif text-xl text-ink-900 mb-2">{prayer.title}</h2>
        {prayer.description && <p className="text-ink-600/55 text-sm font-sans leading-relaxed mb-4">{prayer.description}</p>}

        <div className="flex flex-wrap gap-3 text-xs text-ink-600/40 font-sans mb-4 pb-4 border-b border-parchment-200">
          <span>🙏 Prayed {prayer.entries.length}×</span>
          <span>📅 Added {fmtDate(prayer.createdAt)}</span>
          {prayer.isAnswered && prayer.answeredAt && <span className="text-emerald-600">✨ Answered {fmtDate(prayer.answeredAt)}</span>}
        </div>

        {/* Recent log */}
        {prayer.entries.length > 0 && (
          <div className="mb-4">
            <p className="text-[10px] text-ink-600/35 uppercase tracking-wide font-sans mb-2">Recent Prayer Log</p>
            <div className="space-y-1 max-h-28 overflow-y-auto">
              {prayer.entries.slice(0, 5).map((e) => (
                <div key={e.id} className="flex items-center gap-2 text-xs text-ink-600/45 font-sans">
                  <span className="w-1 h-1 rounded-full bg-yellow-400/60 flex-shrink-0" />
                  <span>{relativeDate(e.prayedAt)}</span>
                  {e.note && <span className="text-ink-600/25 truncate">— {e.note}</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          {!prayer.isAnswered && (
            <>
              <motion.button whileTap={{ scale: 0.96 }} onClick={onLog} className="py-2.5 rounded-xl btn-gold text-ink-900 text-sm font-semibold font-sans">🙏 Mark Prayed</motion.button>
              <motion.button whileTap={{ scale: 0.96 }} onClick={onAnswered} className="py-2.5 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-semibold font-sans hover:bg-emerald-200 transition-colors">✨ Answered!</motion.button>
            </>
          )}
          <button onClick={onDelete} className={`py-2.5 rounded-xl bg-red-50 text-red-400 text-sm font-sans hover:bg-red-100 transition-colors ${prayer.isAnswered ? "col-span-2" : ""}`}>
            Delete Prayer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
