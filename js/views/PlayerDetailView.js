/* ==========================================
   SPORT ZONE - Player Detail View Component
   Player Stats, Photo, Biography & Rating
   ========================================== */

export function PlayerDetailView({ player }) {
  if (!player) return '';

  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Player Header Card -->
      <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900 mb-8 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
        
        <!-- Player Photo -->
        <div class="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl overflow-hidden border-2 border-emerald-500/50 shadow-xl shrink-0">
          <img src="${player.photo}" alt="${player.name}" class="w-full h-full object-cover" />
        </div>

        <!-- Info -->
        <div class="flex-1 text-center sm:text-right">
          <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
            <span class="px-3 py-1 text-xs font-black bg-emerald-500 text-gray-950 rounded-full">#${player.number}</span>
            <span class="px-3 py-1 text-xs font-extrabold bg-gray-800 text-emerald-400 rounded-full border border-gray-700">${player.position}</span>
            <span class="px-3 py-1 text-xs font-bold bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">${player.country}</span>
          </div>

          <h1 class="text-3xl font-black text-white mb-2">${player.name}</h1>
          <p class="text-sm text-gray-300 font-medium">النادي الحالي: <span class="text-emerald-400 font-bold">${player.club}</span> • العمر: ${player.age} سنة</p>
        </div>

      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 text-center bg-gray-900">
          <span class="text-xs text-gray-400 block mb-1">المباريات</span>
          <span class="text-2xl font-black text-white">${player.stats.matches}</span>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 text-center bg-gray-900">
          <span class="text-xs text-gray-400 block mb-1">الأهداف</span>
          <span class="text-2xl font-black text-emerald-400">${player.stats.goals}</span>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 text-center bg-gray-900">
          <span class="text-xs text-gray-400 block mb-1">التمريرات الحاسمة</span>
          <span class="text-2xl font-black text-amber-400">${player.stats.assists}</span>
        </div>
        <div class="glass-panel p-5 rounded-2xl border border-gray-800 text-center bg-gray-900">
          <span class="text-xs text-gray-400 block mb-1">معدل التقييم</span>
          <span class="text-2xl font-black text-cyan-400">${player.stats.rating}</span>
        </div>
      </div>

      <!-- Biography -->
      <div class="glass-panel p-6 rounded-3xl border border-gray-800 bg-gray-900">
        <h3 class="text-xl font-black text-white mb-4 border-r-4 border-emerald-500 pr-3">السيرة الذاتية والأداء</h3>
        <p class="text-sm text-gray-300 leading-relaxed font-medium">
          ${player.bio}
        </p>
      </div>

    </div>
  `;
}
