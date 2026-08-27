/* ==========================================
   SPORT ZONE - Matches View & Match Detail Modal
   Complete Matches Page with Live Timeline & Lineups
   ========================================== */

export function MatchesView({ matches = [], activeTab = 'today', selectedLeague = 'all' }) {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- View Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div class="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-1">
            <span>⚽</span>
            <span>جدول المباريات اليومية والنتائج المباشرة</span>
          </div>
          <h1 class="text-3xl font-black text-white">المباريات والنتائج</h1>
        </div>

        <!-- Filter Tabs -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar bg-gray-900 p-1.5 rounded-2xl border border-gray-800">
          <button data-matches-tab="today" class="px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'today' ? 'bg-emerald-500 text-gray-950 shadow-md' : 'text-gray-400 hover:text-white'}">اليوم</button>
          <button data-matches-tab="tomorrow" class="px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'tomorrow' ? 'bg-emerald-500 text-gray-950 shadow-md' : 'text-gray-400 hover:text-white'}">الغد</button>
          <button data-matches-tab="finished" class="px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${activeTab === 'finished' ? 'bg-emerald-500 text-gray-950 shadow-md' : 'text-gray-400 hover:text-white'}">النتائج السابقة</button>
          <button data-matches-tab="live" class="px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1 ${activeTab === 'live' ? 'bg-red-600 text-white shadow-md' : 'text-red-400 hover:bg-red-500/10'}">
            <span class="w-2 h-2 rounded-full bg-red-400 animate-ping"></span>
            <span>مباشر الآن</span>
          </button>
        </div>
      </div>

      <!-- Matches Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${matches.map(m => {
          const isLive = m.status === 'LIVE';
          const isFinished = m.status === 'FINISHED';

          return `
            <div 
              data-match-id="${m.id}"
              class="glass-panel rounded-3xl p-6 border border-gray-800 card-hover cursor-pointer bg-gray-900/90 relative group"
            >
              
              <!-- Header -->
              <div class="flex items-center justify-between text-xs text-gray-400 mb-4 pb-3 border-b border-gray-800">
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

              <!-- Teams & Scores -->
              <div class="flex items-center justify-between gap-4 py-4">
                
                <!-- Home Team -->
                <div class="flex-1 flex flex-col items-center text-center gap-2">
                  <div class="w-16 h-16 p-2 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700/60 shadow-inner group-hover:scale-105 transition-transform">
                    <img src="${m.homeTeam.logo}" alt="${m.homeTeam.name}" class="w-11 h-11 object-contain" />
                  </div>
                  <span class="text-sm font-extrabold text-white">${m.homeTeam.name}</span>
                </div>

                <!-- Center Score Box -->
                <div class="flex flex-col items-center px-2">
                  ${isLive || isFinished ? `
                    <div class="flex items-center gap-2 text-3xl font-black text-white bg-gray-950 px-4 py-2 rounded-2xl border border-gray-800 shadow-md">
                      <span class="${m.homeTeam.score > m.awayTeam.score ? 'text-emerald-400' : ''}">${m.homeTeam.score}</span>
                      <span class="text-gray-600 text-lg">:</span>
                      <span class="${m.awayTeam.score > m.homeTeam.score ? 'text-emerald-400' : ''}">${m.awayTeam.score}</span>
                    </div>
                  ` : `
                    <div class="text-xs font-black text-gray-400 bg-gray-800 px-3.5 py-2 rounded-xl border border-gray-700">
                      VS
                    </div>
                  `}
                </div>

                <!-- Away Team -->
                <div class="flex-1 flex flex-col items-center text-center gap-2">
                  <div class="w-16 h-16 p-2 bg-gray-800 rounded-2xl flex items-center justify-center border border-gray-700/60 shadow-inner group-hover:scale-105 transition-transform">
                    <img src="${m.awayTeam.logo}" alt="${m.awayTeam.name}" class="w-11 h-11 object-contain" />
                  </div>
                  <span class="text-sm font-extrabold text-white">${m.awayTeam.name}</span>
                </div>

              </div>

              <!-- Events Highlight -->
              ${(m.events || []).length > 0 ? `
                <div class="my-3 px-3 py-2 rounded-xl bg-gray-950/60 text-[11px] text-gray-300 space-y-1">
                  ${m.events.slice(0, 2).map(e => `
                    <div class="flex items-center justify-between">
                      <span class="flex items-center gap-1 font-semibold">
                        <span>⚽</span> ${e.player} (${e.minute})
                      </span>
                      <span class="text-gray-500 text-[10px]">${e.team === 'home' ? m.homeTeam.name : m.awayTeam.name}</span>
                    </div>
                  `).join('')}
                </div>
              ` : ''}

              <!-- Stadium & Details CTA -->
              <div class="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400">
                <span class="truncate">📍 ${m.stadium || 'استاد رياضي'}</span>
                <span class="text-emerald-400 font-bold group-hover:underline">التفاصيل والتشكيل ←</span>
              </div>

            </div>
          `;
        }).join('')}
      </div>

    </div>
  `;
}

/**
 * Match Detail Modal View Component
 */
export function MatchDetailModal({ match }) {
  if (!match) return '';

  return `
    <div id="match-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-fade-in">
      <div class="bg-gray-900 border border-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
        
        <!-- Close Button -->
        <button id="close-modal-btn" class="absolute top-6 left-6 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <!-- Match Header Info -->
        <div class="text-center mb-6">
          <span class="px-3 py-1 text-xs font-bold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
            🏆 ${match.league}
          </span>
          <p class="text-xs text-gray-400 mt-2">📍 ${match.stadium} • الحكم: ${match.referee}</p>
        </div>

        <!-- Scoreboard Header -->
        <div class="flex items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-b from-gray-950 to-gray-900 border border-gray-800 mb-8">
          
          <!-- Home -->
          <div class="flex-1 flex flex-col items-center text-center">
            <img src="${match.homeTeam.logo}" alt="${match.homeTeam.name}" class="w-16 h-16 object-contain mb-2" />
            <h3 class="text-lg font-black text-white">${match.homeTeam.name}</h3>
          </div>

          <!-- Score -->
          <div class="text-center px-4">
            <div class="text-4xl font-black text-white tracking-widest bg-gray-950 px-6 py-3 rounded-2xl border border-gray-800 mb-2">
              ${match.homeTeam.score} : ${match.awayTeam.score}
            </div>
            <span class="text-xs font-bold text-red-400 animate-pulse">
              ${match.status === 'LIVE' ? `مباشر (${match.time})` : match.status === 'FINISHED' ? 'انتهت المباراة' : match.time}
            </span>
          </div>

          <!-- Away -->
          <div class="flex-1 flex flex-col items-center text-center">
            <img src="${match.awayTeam.logo}" alt="${match.awayTeam.name}" class="w-16 h-16 object-contain mb-2" />
            <h3 class="text-lg font-black text-white">${match.awayTeam.name}</h3>
          </div>

        </div>

        <!-- Match Events Timeline -->
        <div class="mb-8">
          <h4 class="text-sm font-extrabold text-white mb-4 border-r-4 border-emerald-500 pr-2">أحداث المباراة والتسجيل</h4>
          ${(match.events || []).length > 0 ? `
            <div class="space-y-3">
              ${match.events.map(e => `
                <div class="flex items-center justify-between p-3 rounded-xl bg-gray-950/70 text-xs border border-gray-800">
                  <span class="font-black text-amber-400 w-10 text-center">${e.minute}</span>
                  <span class="font-bold text-white flex-1">${e.player}</span>
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold ${e.team === 'home' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}">
                    ${e.team === 'home' ? match.homeTeam.name : match.awayTeam.name}
                  </span>
                </div>
              `).join('')}
            </div>
          ` : `
            <p class="text-xs text-gray-500 text-center py-4">لم تسجل أي أحداث بعد في هذه المباراة.</p>
          `}
        </div>

        <!-- Match Statistics -->
        ${match.stats ? `
          <div>
            <h4 class="text-sm font-extrabold text-white mb-4 border-r-4 border-cyan-400 pr-2">إحصائيات المباراة</h4>
            <div class="space-y-4 text-xs">
              
              <!-- Possession -->
              <div>
                <div class="flex justify-between font-bold mb-1">
                  <span class="text-emerald-400">${match.stats.possession.home}%</span>
                  <span class="text-gray-300">الاستحواذ</span>
                  <span class="text-cyan-400">${match.stats.possession.away}%</span>
                </div>
                <div class="h-2 rounded-full bg-gray-800 overflow-hidden flex">
                  <div class="h-full bg-emerald-500" style="width: ${match.stats.possession.home}%"></div>
                  <div class="h-full bg-cyan-500" style="width: ${match.stats.possession.away}%"></div>
                </div>
              </div>

              <!-- Shots -->
              <div>
                <div class="flex justify-between font-bold mb-1">
                  <span class="text-emerald-400">${match.stats.shots.home}</span>
                  <span class="text-gray-300">إجمالي التسديدات</span>
                  <span class="text-cyan-400">${match.stats.shots.away}</span>
                </div>
                <div class="h-2 rounded-full bg-gray-800 overflow-hidden flex">
                  <div class="h-full bg-emerald-500" style="width: ${(match.stats.shots.home / (match.stats.shots.home + match.stats.shots.away)) * 100}%"></div>
                  <div class="h-full bg-cyan-500" style="width: ${(match.stats.shots.away / (match.stats.shots.home + match.stats.shots.away)) * 100}%"></div>
                </div>
              </div>

            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}
