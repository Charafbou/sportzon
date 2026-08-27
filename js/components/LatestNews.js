/* ==========================================
   SPORT ZONE - Latest News Grid Component
   Responsive Article Cards, Source Links & Skeleton Loader
   ========================================== */

export function LatestNews({ newsList = [], isLoading = false }) {
  // Skeleton Shimmer Loading State
  if (isLoading) {
    return `
      <section class="my-10">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-3 h-8 bg-emerald-500 rounded-full"></div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-white">جاري جلب أحدث الأخبار الرياضية المباشرة...</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${[1, 2, 3, 4, 5, 6].map(() => `
            <div class="bg-gray-900 rounded-2xl p-4 border border-gray-800 space-y-3">
              <div class="h-48 skeleton w-full"></div>
              <div class="h-4 skeleton w-3/4"></div>
              <div class="h-3 skeleton w-full"></div>
              <div class="h-3 skeleton w-1/2"></div>
            </div>
          `).join('')}
        </div>
      </section>
    `;
  }

  if (!newsList || newsList.length === 0) return '';

  return `
    <section class="my-10">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <div class="w-3 h-8 bg-emerald-500 rounded-full"></div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>آخر الأخبار الرياضية الحية</span>
            <span class="px-2 py-0.5 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-md font-bold">مباشر الآن</span>
          </h2>
        </div>
      </div>

      <!-- Articles Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${newsList.map(item => `
          <article 
            class="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 card-hover group flex flex-col justify-between"
          >
            <!-- Image Container -->
            <div class="relative h-48 sm:h-52 overflow-hidden bg-gray-950 cursor-pointer" data-read-news="${item.id}">
              <img 
                src="${item.image}" 
                alt="${item.title}" 
                class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                loading="lazy"
                onerror="this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'"
              />
              <span class="absolute top-3 right-3 px-3 py-1 text-[11px] font-extrabold bg-gray-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/30 rounded-full">
                ${item.category}
              </span>
            </div>

            <!-- Content Container -->
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-base font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug mb-3 cursor-pointer" data-read-news="${item.id}">
                  ${item.title}
                </h3>
                <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                  ${item.summary}
                </p>
              </div>

              <!-- Meta Footer & Direct Source Link -->
              <div class="space-y-3 pt-3 border-t border-gray-800/80">
                
                <div class="flex items-center justify-between text-[11px] text-gray-400">
                  <span class="flex items-center gap-1 font-medium text-gray-300">
                    <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    ${item.date}
                  </span>
                  <span class="text-gray-400 font-bold truncate max-w-[140px]">✍️ ${item.author || 'SPORT ZONE'}</span>
                </div>

                <!-- Direct Original News Source Link -->
                ${item.sourceUrl ? `
                  <a 
                    href="${item.sourceUrl}" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    class="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    <span>قراءة الخبر الأصلي كاملاً</span>
                    <svg class="w-3.5 h-3.5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                ` : ''}

              </div>

            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;
}
