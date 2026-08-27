/* ==========================================
   SPORT ZONE - Standings Table Component
   League Standings with Interactive League Selector
   ========================================== */

export function StandingsTable({ activeLeague = 'premier', standings = [] }) {
  const leagues = [
    { key: 'premier', name: 'الدوري الإنجليزي', flag: '🦁' },
    { key: 'laliga', name: 'الدوري الإسباني', flag: '🇪🇸' },
    { key: 'champions', name: 'دوري الأبطال', flag: '🏆' }
  ];

  return `
    <div class="glass-panel rounded-3xl p-6 border border-gray-800 bg-gray-900/90 shadow-xl">
      
      <!-- Section Title & Tabs -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
        <div class="flex items-center gap-3">
          <div class="w-3 h-8 bg-emerald-500 rounded-full"></div>
          <h2 class="text-xl font-extrabold text-white">جدول ترتيب أهم الدوريات</h2>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar">
          ${leagues.map(l => `
            <button 
              data-standings-league="${l.key}"
              class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeLeague === l.key 
                  ? 'bg-emerald-500 text-gray-950 shadow-md shadow-emerald-500/20' 
                  : 'bg-gray-800/80 text-gray-400 hover:text-white hover:bg-gray-700/80'
              }"
            >
              <span>${l.flag}</span>
              <span>${l.name}</span>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Table Container -->
      <div class="overflow-x-auto">
        <table class="w-full text-right text-sm">
          <thead>
            <tr class="text-xs text-gray-400 border-b border-gray-800 pb-2">
              <th class="py-3 px-2 text-center w-10">#</th>
              <th class="py-3 px-3">الفريق</th>
              <th class="py-3 px-2 text-center">لعب</th>
              <th class="py-3 px-2 text-center">فاز</th>
              <th class="py-3 px-2 text-center">تعادل</th>
              <th class="py-3 px-2 text-center">خسر</th>
              <th class="py-3 px-2 text-center hidden sm:table-cell">له/عليه</th>
              <th class="py-3 px-3 text-center font-extrabold text-white">النقاط</th>
              <th class="py-3 px-2 text-center hidden md:table-cell">النماذج</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/60 font-medium">
            ${standings.map((row) => `
              <tr class="hover:bg-gray-800/40 transition-colors ${row.rank <= 4 ? 'bg-emerald-500/5' : ''}">
                <td class="py-3.5 px-2 text-center font-black">
                  <span class="w-6 h-6 inline-flex items-center justify-center rounded-full text-xs ${
                    row.rank === 1 ? 'bg-amber-400 text-gray-950 font-black' :
                    row.rank <= 4 ? 'bg-emerald-500/20 text-emerald-400 font-bold' : 'text-gray-400'
                  }">
                    ${row.rank}
                  </span>
                </td>
                <td class="py-3.5 px-3 font-bold text-white flex items-center gap-2">
                  <span>${row.team}</span>
                </td>
                <td class="py-3.5 px-2 text-center text-gray-300">${row.played}</td>
                <td class="py-3.5 px-2 text-center text-emerald-400">${row.won}</td>
                <td class="py-3.5 px-2 text-center text-amber-400">${row.drawn}</td>
                <td class="py-3.5 px-2 text-center text-red-400">${row.lost}</td>
                <td class="py-3.5 px-2 text-center text-gray-400 hidden sm:table-cell text-xs">${row.gf}:${row.ga}</td>
                <td class="py-3.5 px-3 text-center text-base font-black text-emerald-400 bg-emerald-500/10 rounded-lg">${row.points}</td>
                <td class="py-3.5 px-2 text-center hidden md:table-cell">
                  <div class="flex items-center justify-center gap-1">
                    ${(row.form || []).map(f => `
                      <span class="w-4 h-4 rounded text-[9px] font-black flex items-center justify-center ${
                        f === 'W' ? 'bg-emerald-500 text-gray-950' :
                        f === 'D' ? 'bg-amber-500 text-gray-950' : 'bg-red-500 text-white'
                      }">
                        ${f === 'W' ? 'ف' : f === 'D' ? 'ت' : 'خ'}
                      </span>
                    `).join('')}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

    </div>
  `;
}
