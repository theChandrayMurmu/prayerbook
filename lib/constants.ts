export const PRAYER_CATEGORIES = [
  { id: "DAILY", label: "Daily Prayer", icon: "🌅", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  { id: "SPECIAL_NEEDS", label: "Special Needs", icon: "🙏", bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  { id: "HEALTH", label: "Health & Healing", icon: "💚", bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  { id: "REVIVAL", label: "Revival of Spirit", icon: "🔥", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  { id: "FAMILY", label: "Family", icon: "🏠", bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  { id: "NATION", label: "Nation & World", icon: "🌍", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  { id: "MISSIONS", label: "Missions", icon: "✝️", bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  { id: "THANKSGIVING", label: "Thanksgiving", icon: "🌟", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  { id: "GUIDANCE", label: "Guidance", icon: "🧭", bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  { id: "PROTECTION", label: "Protection", icon: "🛡️", bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
] as const;

export function getCat(id: string) {
  return PRAYER_CATEGORIES.find((c) => c.id === id) ?? PRAYER_CATEGORIES[0];
}

export const BIBLE_VERSES = [
  {
    verse: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.",
    ref: "Philippians 4:6",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=80",
  },
  {
    verse: "If you believe, you will receive whatever you ask for in prayer.",
    ref: "Matthew 21:22",
    img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80",
  },
  {
    verse: "Call to me and I will answer you and tell you great and unsearchable things you do not know.",
    ref: "Jeremiah 33:3",
    img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=1600&q=80",
  },
  {
    verse: "The Lord is near to all who call on him, to all who call on him in truth.",
    ref: "Psalm 145:18",
    img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600&q=80",
  },
  {
    verse: "Pray continually, give thanks in all circumstances; for this is God's will for you in Christ Jesus.",
    ref: "1 Thessalonians 5:17-18",
    img: "https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=1600&q=80",
  },
  {
    verse: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you.",
    ref: "Matthew 7:7",
    img: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=1600&q=80",
  },
  {
    verse: "This is the confidence we have in approaching God: that if we ask anything according to his will, he hears us.",
    ref: "1 John 5:14",
    img: "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?w=1600&q=80",
  },
  {
    verse: "Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.",
    ref: "Mark 11:24",
    img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1600&q=80",
  },
  {
    verse: "Be joyful in hope, patient in affliction, faithful in prayer.",
    ref: "Romans 12:12",
    img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1600&q=80",
  },
  {
    verse: "Devote yourselves to prayer, being watchful and thankful.",
    ref: "Colossians 4:2",
    img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1600&q=80",
  },
];

export const PRINCIPLES = [
  { icon: "✝", title: "Pray with Faith", verse: "James 5:16", desc: "The prayer of a righteous person is powerful and effective." },
  { icon: "🕊", title: "Pray in God's Will", verse: "Luke 22:42", desc: "Submit your requests to God's wisdom, not my will but Yours." },
  { icon: "📖", title: "Be Specific", verse: "Philippians 4:6", desc: "Bring every detail before God — He cares about every need." },
  { icon: "🔥", title: "Pray Persistently", verse: "Luke 18:1", desc: "Pray and do not give up. Keep bringing every need before God." },
  { icon: "🌟", title: "Pray in Jesus' Name", verse: "John 16:23-24", desc: "Access the Father through Jesus Christ with confidence." },
  { icon: "💛", title: "Pray with Compassion", verse: "Romans 8:26", desc: "Let love move your intercession for others as the Spirit helps." },
];

export const MILESTONES = [3, 7, 14, 21, 30, 50, 75, 100, 150, 200, 300, 365];
