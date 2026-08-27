/* ==========================================
   SPORT ZONE - Team Detail View Component
   Team Header, Stadium Info, Squad & Trophies
   ========================================== */

export function TeamDetailView({ team }) {
  if (!team) return '';

  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Team Header Banner -->
      <div class="relative rounded-3xl overflow-hidden border border-gray-800 bg-gray-900 mb-10 shadow-2xl">
        <div class="h-64 sm:h-80 relative overflow-hidden">
          <img src="${team.banner}" alt="${team.name}" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent"></div>
        </div>

        <div class="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-right">
          <div class="w-24 h-24 sm:w-28 sm:h-28 p-3 rounded-3xl bg-gray-900 border-2 border-emerald-500/50 shadow-2xl flex items-center justify-center shrink-0">
            <img src="${team.logo}" alt="${team.name}" class="w-full h-full object-contain" />
          </div>

          <div class="flex-1">
            <div class="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 class="text-3xl font-black text-white">${team.name}</h1>
              <span class="px-2.5 py-0.5 text-xs font-bold bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">${team.country}</span>
            </div>
            <p class="text-sm text-gray-300">📍 ${team.stadium} • 👔 المدير الفني: ${team.manager}</p>
          </div>
        </div>
      </div>

      <!-- Grid Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Squad List -->
        <div class="lg:col-span-2 space-y-6">
          <div class="glass-panel p-6 rounded-3xl border border-gray-800 bg-gray-900">
            <h3 class="text-xl font-black text-white mb-6 border-r-4 border-emerald-500 pr-3">قائمة أبطال الفريق (اللاعبون)</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              ${(team.squad || []).map(p => `
                <div class="p-4 rounded-2xl bg-gray-950/80 border border-gray-800 flex items-center justify-between hover:border-emerald-500/40 transition-colors">
                  <div class="flex items-center gap-3">
                    <span class="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 font-black text-sm flex items-center justify-center border border-emerald-500/20">
                      #${p.number}
                    </span>
                    <div>
                      <h4 class="text-sm font-bold text-white">${p.name}</h4>
                      <span class="text-[11px] text-gray-400">${p.position} • ${p.nationality}</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>

          </div>
        </div>

        <!-- Trophy Room & Stats -->
        <div class="space-y-6">
          <div class="glass-panel p-6 rounded-3xl border border-gray-800 bg-gray-900">
            <h3 class="text-xl font-black text-white mb-6 border-r-4 border-amber-400 pr-3">خزينة البطولات والتحف</h3>
            
            <div class="space-y-4 text-sm font-bold">
              <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-300">
                <span>🏆 دوري أبطال أوروبا</span>
                <span class="text-2xl font-black">${team.trophies?.champions || 0}</span>
              </div>
              <div class="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-emerald-300">
                <span>🥇 الدوري المحلي</span>
                <span class="text-2xl font-black">${team.trophies?.laliga || team.trophies?.premier || 0}</span>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  `;
}
