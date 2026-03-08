import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PrayerBook — Track Your Prayer Journey",
  description: "Record, track, and grow in your daily prayer life. Build faith through consistency and celebrate answered prayers.",
  keywords: ["prayer", "christian", "faith", "devotional", "spiritual growth", "Seventh-day Adventist"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
