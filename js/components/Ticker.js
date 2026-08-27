/* ==========================================
   SPORT ZONE - Breaking News Ticker Component
   Animated Marquee with Flame Indicator
   ========================================== */

export function Ticker({ newsList = [] }) {
  if (!newsList || newsList.length === 0) return '';

  return `
    <div class="bg-gray-900 border-b border-gray-800 text-xs sm:text-sm">
      <div class="max-w-7xl mx-auto flex items-center">
        
        <!-- Fixed Breaking Tag Label -->
        <div class="bg-gradient-to-r from-red-600 to-red-700 text-white font-extrabold px-4 py-2.5 flex items-center gap-2 shadow-md z-10 shrink-0">
          <span class="animate-bounce">🔥</span>
          <span>أخبار عاجلة</span>
        </div>

        <!-- Scrolling News Marquee -->
        <div class="ticker-wrap py-2.5 flex-1 text-gray-200">
          <div class="ticker-content flex items-center gap-8 font-medium">
            ${newsList.map(item => `
              <span class="inline-flex items-center gap-2 cursor-pointer hover:text-emerald-400 transition-colors">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>${item}</span>
              </span>
            `).join('')}
          </div>
        </div>

      </div>
    </div>
  `;
}
