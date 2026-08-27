/* ==========================================
   SPORT ZONE - Most Read Component
   Numbered Trending News Sidebar / Section
   ========================================== */

export function MostRead({ articles = [] }) {
  if (!articles || articles.length === 0) return '';

  return `
    <div class="glass-panel rounded-3xl p-6 border border-gray-800 bg-gray-900/90 shadow-xl">
      <div class="flex items-center gap-3 mb-6 pb-3 border-b border-gray-800">
        <div class="w-3 h-8 bg-amber-400 rounded-full"></div>
        <h3 class="text-xl font-extrabold text-white flex items-center gap-2">
          <span>الأكثر قراءة اليوم</span>
          <span class="text-amber-400">🔥</span>
        </h3>
      </div>

      <div class="space-y-4">
        ${articles.map((item, idx) => `
          <div 
            data-read-news="${item.id}"
            class="flex items-start gap-4 p-3 rounded-2xl hover:bg-gray-800/60 transition-colors cursor-pointer group border border-transparent hover:border-gray-800"
          >
            <!-- Big Number -->
            <span class="text-3xl font-black text-gray-700 group-hover:text-amber-400 transition-colors shrink-0 w-8 text-center">
              0${idx + 1}
            </span>

            <!-- Content -->
            <div class="flex-1">
              <span class="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ${item.category}
              </span>
              <h4 class="text-sm font-bold text-gray-200 group-hover:text-white leading-snug mt-1 line-clamp-2">
                ${item.title}
              </h4>
              <div class="flex items-center gap-3 text-[11px] text-gray-400 mt-2">
                <span>👁️ ${(item.views || 12000).toLocaleString()} قراءة</span>
                <span>•</span>
                <span>${item.date}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}
