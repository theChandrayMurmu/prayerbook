// ─── Types ────────────────────────────────────────────────────────────────────

export type PrayerCategory =
  | "DAILY" | "SPECIAL_NEEDS" | "HEALTH" | "REVIVAL"
  | "FAMILY" | "NATION" | "MISSIONS" | "THANKSGIVING"
  | "GUIDANCE" | "PROTECTION";

export interface PrayerEntry {
  id: string;
  note: string;
  prayedAt: string; // ISO
}

export interface Prayer {
  id: string;
  title: string;
  description: string;
  category: PrayerCategory;
  isAnswered: boolean;
  answeredAt: string | null;
  entries: PrayerEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastPrayedAt: string | null; // ISO date string YYYY-MM-DD
}

// ─── Keys ─────────────────────────────────────────────────────────────────────

const PRAYERS_KEY = "pb_prayers";
const STREAK_KEY  = "pb_streak";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function today(): string {
  return new Date().toISOString().split("T")[0];
}

function isClient(): boolean {
  return typeof window !== "undefined";
}

// ─── Prayers ──────────────────────────────────────────────────────────────────

export function getPrayers(): Prayer[] {
  if (!isClient()) return [];
  try {
    return JSON.parse(localStorage.getItem(PRAYERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function savePrayers(prayers: Prayer[]) {
  localStorage.setItem(PRAYERS_KEY, JSON.stringify(prayers));
}

export function addPrayer(data: {
  title: string;
  description: string;
  category: PrayerCategory;
}): Prayer {
  const prayers = getPrayers();
  const now = new Date().toISOString();
  const prayer: Prayer = {
    id: uid(),
    title: data.title,
    description: data.description,
    category: data.category,
    isAnswered: false,
    answeredAt: null,
    entries: [],
    createdAt: now,
    updatedAt: now,
  };
  prayers.unshift(prayer);
  savePrayers(prayers);
  return prayer;
}

export function logPrayer(id: string, note = ""): void {
  const prayers = getPrayers();
  const idx = prayers.findIndex((p) => p.id === id);
  if (idx === -1) return;
  const entry: PrayerEntry = {
    id: uid(),
    note,
    prayedAt: new Date().toISOString(),
  };
  prayers[idx].entries.unshift(entry);
  prayers[idx].updatedAt = new Date().toISOString();
  savePrayers(prayers);
  updateStreak();
}

export function markAnswered(id: string): void {
  const prayers = getPrayers();
  const idx = prayers.findIndex((p) => p.id === id);
  if (idx === -1) return;
  prayers[idx].isAnswered = true;
  prayers[idx].answeredAt = new Date().toISOString();
  prayers[idx].updatedAt  = new Date().toISOString();
  savePrayers(prayers);
}

export function deletePrayer(id: string): void {
  savePrayers(getPrayers().filter((p) => p.id !== id));
}

export function updatePrayer(id: string, data: Partial<Pick<Prayer, "title" | "description" | "category">>): void {
  const prayers = getPrayers();
  const idx = prayers.findIndex((p) => p.id === id);
  if (idx === -1) return;
  prayers[idx] = { ...prayers[idx], ...data, updatedAt: new Date().toISOString() };
  savePrayers(prayers);
}

// ─── Streak ───────────────────────────────────────────────────────────────────

export function getStreak(): StreakData {
  if (!isClient()) return { currentStreak: 0, longestStreak: 0, totalDays: 0, lastPrayedAt: null };
  try {
    return JSON.parse(localStorage.getItem(STREAK_KEY) || "null") ?? {
      currentStreak: 0, longestStreak: 0, totalDays: 0, lastPrayedAt: null,
    };
  } catch {
    return { currentStreak: 0, longestStreak: 0, totalDays: 0, lastPrayedAt: null };
  }
}

function updateStreak(): void {
  const streak = getStreak();
  const t = today();

  if (streak.lastPrayedAt === t) return; // already prayed today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yd = yesterday.toISOString().split("T")[0];

  const isConsecutive = streak.lastPrayedAt === yd;
  const newCurrent    = isConsecutive ? streak.currentStreak + 1 : 1;

  const updated: StreakData = {
    currentStreak: newCurrent,
    longestStreak: Math.max(newCurrent, streak.longestStreak),
    totalDays:     streak.totalDays + 1,
    lastPrayedAt:  t,
  };
  localStorage.setItem(STREAK_KEY, JSON.stringify(updated));
}

// ─── Heatmap helper ───────────────────────────────────────────────────────────

export function buildHeatmap(prayers: Prayer[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const prayer of prayers) {
    for (const entry of prayer.entries) {
      const key = entry.prayedAt.split("T")[0];
      map[key] = (map[key] || 0) + 1;
    }
  }
  return map;
}

// ─── Stats helper ─────────────────────────────────────────────────────────────

export function getStats(prayers: Prayer[]) {
  const answered   = prayers.filter((p) => p.isAnswered).length;
  const totalEntries = prayers.reduce((s, p) => s + p.entries.length, 0);

  const catMap: Record<string, number> = {};
  for (const p of prayers) {
    catMap[p.category] = (catMap[p.category] || 0) + 1;
  }
  const categoryBreakdown = Object.entries(catMap)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  return { total: prayers.length, answered, totalEntries, categoryBreakdown };
}
