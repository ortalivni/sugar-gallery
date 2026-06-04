import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'דפי סוכר - אורטל לבני',
  description: 'גלריית דפי סוכר — בחרי את העיצוב המושלם',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-[#fdf4ff]">{children}</body>
    </html>
  );
}
