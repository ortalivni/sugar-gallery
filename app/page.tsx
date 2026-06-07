'use client';

import { useEffect, useState, useMemo } from 'react';
import type { GalleryImage } from './api/images/route';

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '972547450606';

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selected, setSelected] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetch('/api/images')
      .then(r => r.json())
      .then(data => { setImages(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { setError('שגיאה בטעינת התמונות'); setLoading(false); });
  }, []);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    images.forEach(img => img.tags.forEach(t => set.add(t)));
    return [...set].sort((a, b) => a.localeCompare(b, 'he'));
  }, [images]);

  const filtered = useMemo(() => {
    return images.filter(img => {
      const matchesTag = !activeTag || img.tags.includes(activeTag);
      const q = search.toLowerCase();
      const matchesSearch = !search || img.tags.some(t => t.toLowerCase().includes(q)) || img.name.toLowerCase().includes(q);
      return matchesTag && matchesSearch;
    });
  }, [images, activeTag, search]);

  const waLink = (img: GalleryImage) => {
    const text = encodeURIComponent(`היי אורטל! אשמח לקבל מידע על דף הסוכר: ${img.tags[0] ?? img.name}\n${img.url}`);
    return `https://wa.me/${WA_NUMBER}?text=${text}`;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-gradient-to-l from-pink-400 to-purple-500 text-white shadow-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-3">
          <span className="text-3xl">🍰</span>
          <div>
            <h1 className="text-xl font-bold leading-tight">דפי סוכר</h1>
            <p className="text-pink-100 text-sm">אורטל לבני</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">

        {/* Sidebar — tags */}
        <aside className="hidden md:flex flex-col gap-1 w-52 shrink-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">קטגוריות</p>
          <button
            onClick={() => { setActiveTag(null); setSearch(''); }}
            className={`text-right px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              !activeTag && !search
                ? 'bg-purple-500 text-white shadow'
                : 'text-purple-700 hover:bg-purple-50'
            }`}
          >
            הכל
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => { setActiveTag(tag); setSearch(''); }}
              className={`text-right px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTag === tag
                  ? 'bg-purple-500 text-white shadow'
                  : 'text-purple-700 hover:bg-purple-50'
              }`}
            >
              {tag}
            </button>
          ))}
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Featured category buttons */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => { setActiveTag('עוגות גן'); setSearch(''); }}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                activeTag === 'עוגות גן'
                  ? 'bg-pink-500 text-white shadow-pink-200'
                  : 'bg-pink-50 text-pink-600 border border-pink-200 hover:bg-pink-100'
              }`}
            >
              🎂 עוגות גן
            </button>
            <button
              onClick={() => { setActiveTag('חיתוך'); setSearch(''); }}
              className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm ${
                activeTag === 'חיתוך'
                  ? 'bg-purple-500 text-white shadow-purple-200'
                  : 'bg-purple-50 text-purple-600 border border-purple-200 hover:bg-purple-100'
              }`}
            >
              ✂️ דפי חיתוך
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <span className="absolute top-1/2 -translate-y-1/2 end-3 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="חיפוש חופשי..."
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveTag(null); }}
              className="w-full bg-white border border-purple-200 rounded-2xl px-4 py-3 pe-10 text-base shadow-sm focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Mobile tags — scrollable row */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 md:hidden scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <button onClick={() => { setActiveTag(null); setSearch(''); }}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-all ${!activeTag && !search ? 'bg-purple-500 text-white' : 'bg-white text-purple-600 border border-purple-200'}`}>
              הכל
            </button>
            {allTags.map(tag => (
              <button key={tag} onClick={() => { setActiveTag(tag); setSearch(''); }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap shrink-0 transition-all ${activeTag === tag ? 'bg-purple-500 text-white' : 'bg-white text-purple-600 border border-purple-200'}`}>
                {tag}
              </button>
            ))}
          </div>

          {/* Results count */}
          {!loading && !error && (
            <p className="text-sm text-gray-400 mb-4">{filtered.length} עיצובים</p>
          )}

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
              <p className="text-purple-400">טוענת עיצובים...</p>
            </div>
          )}

          {/* Error */}
          {error && <p className="text-center text-red-500 py-12">{error}</p>}

          {/* Empty */}
          {!loading && !error && filtered.length === 0 && (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-gray-400">לא נמצאו עיצובים תואמים</p>
            </div>
          )}

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(img => (
              <div
                key={img.id}
                onClick={() => setSelected(img)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5 border border-pink-50"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={img.url}
                    alt={img.tags[0] ?? img.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="px-2 py-1.5">
                  <p className="text-xs text-gray-500 truncate">{img.tags[0] ?? ''}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={selected.url}
              alt={selected.tags[0] ?? selected.name}
              className="w-full max-h-[60vh] object-contain bg-gray-50"
            />
            <div className="p-5">
              <div className="flex flex-wrap gap-2 mb-4">
                {selected.tags.map(t => (
                  <span key={t} className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full font-medium">
                    {t}
                  </span>
                ))}
              </div>

              <a
                href={waLink(selected)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl text-base transition-colors shadow"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.12 1.523 5.851L0 24l6.335-1.508A11.933 11.933 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.012-1.374l-.36-.214-3.76.895.952-3.667-.234-.376A9.818 9.818 0 1112 21.818z"/>
                </svg>
                שלחי לי בוואטסאפ
              </a>

              <button
                onClick={() => setSelected(null)}
                className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600"
              >
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
