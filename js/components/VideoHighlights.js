/* ==========================================
   SPORT ZONE - Video Highlights Component
   Video Highlights Carousel & Modal Player
   ========================================== */

export function VideoHighlights({ videos = [] }) {
  if (!videos || videos.length === 0) return '';

  return `
    <section class="my-10">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <div class="w-3 h-8 bg-cyan-400 rounded-full"></div>
          <h2 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <span>فيديوهات وملخصات رياضية</span>
            <span class="text-xs font-normal px-2.5 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30">HD</span>
          </h2>
        </div>
        <button id="btn-view-all-videos" class="text-sm font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
          <span>شاهد الكل</span>
          <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>

      <!-- Videos Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${videos.map(v => `
          <div 
            data-play-video="${v.id}"
            class="glass-panel rounded-2xl overflow-hidden border border-gray-800 card-hover cursor-pointer group bg-gray-900"
          >
            <!-- Thumbnail Container -->
            <div class="relative h-48 overflow-hidden bg-gray-950">
              <img 
                src="${v.thumbnail}" 
                alt="${v.title}" 
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <!-- Play Button Circle -->
                <div class="w-14 h-14 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                  <svg class="w-7 h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>

              <!-- Duration Badge -->
              <span class="absolute bottom-3 right-3 px-2 py-1 text-xs font-black bg-gray-950/80 text-white rounded">
                ${v.duration}
              </span>
            </div>

            <!-- Content Info -->
            <div class="p-4">
              <span class="text-[11px] font-extrabold text-cyan-400">${v.category}</span>
              <h3 class="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug mt-1">
                ${v.title}
              </h3>
              <div class="flex items-center gap-3 text-[11px] text-gray-400 mt-3">
                <span>👁️ ${v.views} مشاهدة</span>
                <span>•</span>
                <span>${v.date}</span>
              </div>
            </div>

          </div>
        `).join('')}
      </div>
    </section>
  `;
}
