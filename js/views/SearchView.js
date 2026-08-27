/* ==========================================
   SPORT ZONE - Search View & Modal Component
   Instant Arabic Search across News, Teams, Players
   ========================================== */

export function SearchModal({ query = '', results = { news: [], teams: [], players: [] } }) {
  return `
    <div id="search-modal" class="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/80 backdrop-blur-md modal-fade-in">
      <div class="bg-gray-900 border border-gray-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
        
        <!-- Search Input Bar -->
        <div class="flex items-center gap-3 pb-4 border-b border-gray-800">
          <svg class="w-6 h-6 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input 
            type="text" 
            id="search-input-field" 
            value="${query}" 
            placeholder="اكتب اسم فريق (مثال: ريال مدريد، ليفربول) أو لاعب (صلاح) أو بطولة..." 
            class="w-full bg-transparent text-white text-base font-medium placeholder-gray-500 focus:outline-none" 
            autofocus
          />
          <button id="close-search-modal-btn" class="p-1 rounded-lg text-gray-400 hover:text-white">
            إلغاء
          </button>
        </div>

        <!-- Search Results List -->
        <div class="mt-4 max-h-[60vh] overflow-y-auto space-y-6">
          
          ${query.trim() === '' ? `
            <div class="text-center py-8 text-xs text-gray-500">
              💡 ابدأ الكتابة للبحث المباشر عن الأخبار والمباريات واللاعبين...
            </div>
          ` : ''}

          <!-- News Results -->
          ${results.news.length > 0 ? `
            <div>
              <h4 class="text-xs font-black text-emerald-400 uppercase tracking-wider mb-3">📰 المقالات والأخبار (${results.news.length})</h4>
              <div class="space-y-2">
                ${results.news.map(n => `
                  <div 
                    data-read-news="${n.id}"
                    class="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between"
                  >
                    <div class="flex items-center gap-3">
                      <img src="${n.image}" class="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <h5 class="text-xs font-bold text-white line-clamp-1">${n.title}</h5>
                        <span class="text-[10px] text-gray-400">${n.category}</span>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Teams Results -->
          ${results.teams.length > 0 ? `
            <div>
              <h4 class="text-xs font-black text-cyan-400 uppercase tracking-wider mb-3">🛡️ الفرق والنوادي (${results.teams.length})</h4>
              <div class="space-y-2">
                ${results.teams.map(t => `
                  <div 
                    data-view-team="${t.id}"
                    class="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 hover:border-cyan-500/40 cursor-pointer flex items-center gap-3"
                  >
                    <img src="${t.logo}" class="w-8 h-8 object-contain" />
                    <div>
                      <h5 class="text-xs font-bold text-white">${t.name}</h5>
                      <span class="text-[10px] text-gray-400">${t.country} • ${t.stadium}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Players Results -->
          ${results.players.length > 0 ? `
            <div>
              <h4 class="text-xs font-black text-amber-400 uppercase tracking-wider mb-3">⭐ اللاعبون (${results.players.length})</h4>
              <div class="space-y-2">
                ${results.players.map(p => `
                  <div 
                    data-view-player="${p.id}"
                    class="p-3 rounded-xl bg-gray-950/60 border border-gray-800/80 hover:border-amber-500/40 cursor-pointer flex items-center gap-3"
                  >
                    <img src="${p.photo}" class="w-8 h-8 rounded-full object-cover" />
                    <div>
                      <h5 class="text-xs font-bold text-white">${p.name} (#${p.number})</h5>
                      <span class="text-[10px] text-gray-400">${p.club} • ${p.position}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${query.trim() !== '' && results.news.length === 0 && results.teams.length === 0 && results.players.length === 0 ? `
            <div class="text-center py-10 text-xs text-gray-400">
              لم يتم العثور على أي نتائج تطابق "${query}". حاول البحث عن كلمة أخرى.
            </div>
          ` : ''}

        </div>

      </div>
    </div>
  `;
}
