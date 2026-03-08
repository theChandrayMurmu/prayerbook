# 🙏 PrayerBook

A beautiful prayer tracking web app built with **Next.js 14** and **Framer Motion**. No backend, no database, no login required — everything is stored in your browser's localStorage and works offline.

## ✨ Features

- **Landing page** with animated Bible verse slideshow + nature photography
- **10 Prayer Categories** — Daily, Special Needs, Health, Revival, Family, Nation, Missions, Thanksgiving, Guidance, Protection
- **Prayer Streaks** — consecutive prayer day tracking with milestone badges
- **Year Heatmap** — GitHub-style visual of your entire prayer year
- **Answered Prayer Testimony** — celebrate God's faithfulness
- **Micro-animations** throughout via Framer Motion
- **No login, no database** — data saved in localStorage, works instantly

---

## 🚀 Deploy to Vercel (2 minutes)

### Option 1 — Vercel CLI (fastest)
```bash
npm i -g vercel
vercel
```

### Option 2 — GitHub + Vercel Dashboard
1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: PrayerBook"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/prayerbook.git
git push -u origin main
```
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import your repo
3. Click **Deploy** — no environment variables needed!

---

## 💻 Run Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 🗂 Project Structure

```
prayerbook/
├── app/
│   ├── page.tsx                    # Landing page (verse slideshow, principles)
│   ├── globals.css
│   ├── layout.tsx
│   └── dashboard/
│       ├── layout.tsx              # Sidebar shell
│       ├── page.tsx                # Overview / stats
│       ├── prayers/page.tsx        # Full prayer management
│       ├── streak/page.tsx         # Heatmap + milestones
│       └── answered/page.tsx       # Testimony board
├── components/
│   └── dashboard/Sidebar.tsx
├── lib/
│   ├── store.ts                    # All data logic (localStorage)
│   ├── constants.ts                # Categories, verses, principles
│   └── utils.ts
└── ...config files
```

---

## 🔮 Future Features (Phase 2)

- Google / Email login
- Cloud sync across devices (PostgreSQL via Neon)
- Prayer sharing & community
- Push notification reminders
- Export testimony as PDF

---

## 🎨 Design

Warm **parchment aesthetic** with deep ink backgrounds on the landing page and cream tones on the dashboard. Typography: Playfair Display (serif) + DM Sans. Gold accents throughout.

---

© PrayerBook · Built for the faithful · ✝
