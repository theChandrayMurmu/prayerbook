"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { href: "/dashboard",          icon: "⊞",  label: "Overview" },
  { href: "/dashboard/prayers",  icon: "🙏", label: "My Prayers" },
  { href: "/dashboard/streak",   icon: "🔥", label: "Streak" },
  { href: "/dashboard/answered", icon: "✨", label: "Answered" },
];

export default function Sidebar() {
  const path = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <motion.aside
      animate={{ width: open ? 240 : 64 }}
      transition={{ duration: 0.28, ease: "easeInOut" }}
      className="relative flex-shrink-0 h-screen sticky top-0 bg-ink-900 border-r border-yellow-900/20 flex flex-col overflow-hidden z-20"
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 py-5 border-b border-yellow-900/20 min-h-[64px]">
        <div className="relative w-8 h-8 rounded-full border border-yellow-500/35 bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
          <span className="text-yellow-300 text-sm">✝</span>
        </div>
        <AnimatePresence>
          {open && (
            <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="font-serif text-lg text-white whitespace-nowrap">
              Prayer<span className="text-yellow-400">Book</span>
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-[18px] -right-3 w-6 h-6 bg-yellow-600 hover:bg-yellow-500 rounded-full text-white text-xs flex items-center justify-center shadow-md transition-colors z-30"
      >
        {open ? "‹" : "›"}
      </button>

      {/* Nav links */}
      <nav className="flex-1 py-5 px-2 space-y-1">
        {NAV.map((item) => {
          const active = path === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 ${
                  active ? "bg-yellow-500/18 border border-yellow-500/25 text-yellow-300" : "text-white/45 hover:text-white/75 hover:bg-white/5"
                }`}
              >
                <span className="text-lg flex-shrink-0 leading-none">{item.icon}</span>
                <AnimatePresence>
                  {open && (
                    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm font-sans font-medium whitespace-nowrap">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {active && <motion.div layoutId="active-dot" className="absolute right-3 w-1.5 h-1.5 rounded-full bg-yellow-400" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: back to landing */}
      <div className="p-3 border-t border-yellow-900/20">
        <Link href="/">
          <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors ${open ? "" : "justify-center"}`}>
            <span className="text-base flex-shrink-0">←</span>
            {open && <span className="text-xs font-sans whitespace-nowrap">Back to Home</span>}
          </div>
        </Link>
      </div>
    </motion.aside>
  );
}
