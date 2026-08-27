/* ==========================================
   SPORT ZONE - Hero News Section Component
   Featured Main Sports Story Showcase & Source Link
   ========================================== */

export function HeroSection({ heroArticle }) {
  if (!heroArticle) return '';

  return `
    <section class="my-6">
      <div class="relative rounded-3xl overflow-hidden shadow-2xl group border border-gray-800 bg-gray-900">
        
        <!-- Hero Background Image with Overlay -->
        <div class="h-[420px] sm:h-[480px] md:h-[520px] w-full overflow-hidden relative">
          <img 
            src="${heroArticle.image}" 
            alt="${heroArticle.title}"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            onerror="this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent"></div>
        </div>

        <!-- Content Overlay -->
        <div class="absolute bottom-0 inset-x-0 p-6 sm:p-8 md:p-10 flex flex-col justify-end">
          
          <div class="flex flex-wrap items-center gap-3 mb-3">
            <span class="px-3.5 py-1 text-xs font-black bg-emerald-500 text-gray-950 rounded-full shadow-lg shadow-emerald-500/20">
              ${heroArticle.category}
            </span>
            <span class="text-xs text-gray-300 font-semibold flex items-center gap-1">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              ${heroArticle.date}
            </span>
            <span class="text-xs text-gray-300 font-semibold flex items-center gap-1">
              ✍️ ${heroArticle.author || 'SPORT ZONE'}
            </span>
          </div>

          <h2 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-snug sm:leading-tight mb-3 group-hover:text-emerald-300 transition-colors cursor-pointer" data-read-news="${heroArticle.id}">
            ${heroArticle.title}
          </h2>

          <p class="text-sm sm:text-base text-gray-300 line-clamp-2 max-w-4xl mb-6 font-normal">
            ${heroArticle.summary}
          </p>

          <div class="flex flex-wrap items-center gap-4">
            <button 
              data-read-news="${heroArticle.id}"
              class="btn-glow px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2"
            >
              <span>اقرأ التفاصيل بالموقع</span>
              <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
            </button>

            ${heroArticle.sourceUrl ? `
              <a 
                href="${heroArticle.sourceUrl}" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="px-5 py-3 rounded-2xl bg-gray-800/90 border border-gray-700 text-gray-200 hover:text-white hover:border-emerald-500 font-bold text-sm flex items-center gap-2 transition-all"
              >
                <span>رابط المصدر الأصلي 🌐</span>
              </a>
            ` : ''}
          </div>

        </div>

      </div>
    </section>
  `;
}
