/* ==========================================
   SPORT ZONE - Live Matches Widget Component
   Today's Matches, LIVE Status & Scoreboard
   ========================================== */

export function LiveMatchesWidget({ matches = [] }) {
  if (!matches || matches.length === 0) return '';

  return `
    <section class="my-8">
      <div class="flex items-center justify-between mb-5">
        <div class="flex items-center gap-3">
          <div class="w-3 h-8 bg-emerald-500 rounded-full"></div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>مباريات اليوم والمباشر</span>
            <span class="px-2 py-0.5 text-xs bg-red-500/20 text-red-400 border border-red-500/30 rounded-md font-bold">مباشر الآن</span>
          </h2>
        </div>
        <button id="btn-view-all-matches" class="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
          <span>عرض جميع المباريات</span>
          <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- Matches Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        ${matches.map(m => {
          const isLive = m.status === 'LIVE';
          const isFinished = m.status === 'FINISHED';

          return `
            <div 
              data-match-id="${m.id}"
              class="glass-panel rounded-2xl p-5 border border-gray-800 card-hover cursor-pointer relative overflow-hidden bg-gray-900/80 hover:border-emerald-500/40 transition-all"
            >
              
              <!-- League Name & Match Status Header -->
              <div class="flex items-center justify-between text-xs text-gray-400 mb-4 pb-3 border-b border-gray-800/80">
                <span class="font-bold text-gray-300 flex items-center gap-1">
                  <span class="text-emerald-400">🏆</span> ${m.league}
                </span>
                
                ${isLive ? `
                  <span class="live-badge">
                    <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                    <span>مباشر (${m.time})</span>
                  </span>
                ` : isFinished ? `
                  <span class="px-2.5 py-0.5 rounded-full bg-gray-800 text-gray-300 font-bold border border-gray-700">
                    انتهت
                  </span>
                ` : `
                  <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    ⏰ ${m.time}
                  </span>
                `}
              </div>

              <!-- Teams & Score Display -->
              <div class="flex items-center justify-between gap-4 py-2">
                
                <!-- Home Team -->
                <div class="flex-1 flex flex-col items-center text-center gap-2">
                  <div class="w-14 h-14 p-2 bg-gray-800/70 rounded-full flex items-center justify-center border border-gray-700/50 shadow-inner">
                    <img src="${m.homeTeam.logo}" alt="${m.homeTeam.name}" class="w-10 h-10 object-contain" onerror="this.src='https://via.placeholder.com/40'" />
                  </div>
                  <span class="text-sm font-extrabold text-white leading-snug line-clamp-1">${m.homeTeam.name}</span>
                </div>

                <!-- Score / VS Center Pill -->
                <div class="flex flex-col items-center justify-center px-3">
                  ${isLive || isFinished ? `
                    <div class="flex items-center gap-2 text-2xl font-black text-white bg-gray-950 px-4 py-2 rounded-xl border border-gray-800 shadow-md">
                      <span class="${isLive && m.homeTeam.score > m.awayTeam.score ? 'text-emerald-400' : ''}">${m.homeTeam.score}</span>
                      <span class="text-gray-600 text-lg">:</span>
                      <span class="${isLive && m.awayTeam.score > m.homeTeam.score ? 'text-emerald-400' : ''}">${m.awayTeam.score}</span>
                    </div>
                  ` : `
                    <div class="text-xs font-black text-gray-400 bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-700">
                      VS
                    </div>
                  `}
                </div>

                <!-- Away Team -->
                <div class="flex-1 flex flex-col items-center text-center gap-2">
                  <div class="w-14 h-14 p-2 bg-gray-800/70 rounded-full flex items-center justify-center border border-gray-700/50 shadow-inner">
                    <img src="${m.awayTeam.logo}" alt="${m.awayTeam.name}" class="w-10 h-10 object-contain" onerror="this.src='https://via.placeholder.com/40'" />
                  </div>
                  <span class="text-sm font-extrabold text-white leading-snug line-clamp-1">${m.awayTeam.name}</span>
                </div>

              </div>

              <!-- Footer Stadium & Action -->
              <div class="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-400">
                <span class="truncate flex items-center gap-1">
                  <span>📍</span> ${m.stadium || 'استاد رياضي'}
                </span>
                <span class="text-emerald-400 font-bold flex items-center gap-1 group-hover:underline">
                  تفاصيل المباراة
                  <svg class="w-3 h-3 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </div>

            </div>
          `;
        }).join('')}
      </div>
    </section>
  `;
}
