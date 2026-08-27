/* ==========================================
   SPORT ZONE - Videos View Component
   Full Sports Videos Gallery & Modal Player
   ========================================== */

export function VideosView({ videos = [] }) {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="mb-8">
        <div class="flex items-center gap-2 text-xs text-cyan-400 font-bold mb-1">
          <span>🎥</span>
          <span>مكتبة الأهداف والملخصات التلفزيونية</span>
        </div>
        <h1 class="text-3xl font-black text-white">فيديوهات رياضية</h1>
      </div>

      <!-- Videos Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        ${videos.map(v => `
          <div 
            data-play-video="${v.id}"
            class="glass-panel rounded-3xl overflow-hidden border border-gray-800 card-hover cursor-pointer group bg-gray-900"
          >
            <div class="relative h-52 overflow-hidden bg-gray-950">
              <img src="${v.thumbnail}" alt="${v.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div class="w-16 h-16 rounded-full bg-emerald-500/90 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40 group-hover:scale-110 transition-transform">
                  <svg class="w-8 h-8 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
              <span class="absolute bottom-3 right-3 px-2.5 py-1 text-xs font-black bg-gray-950/80 text-white rounded-md">
                ${v.duration}
              </span>
            </div>

            <div class="p-5">
              <span class="text-xs font-extrabold text-cyan-400">${v.category}</span>
              <h3 class="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-snug mt-1">
                ${v.title}
              </h3>
              <div class="flex items-center gap-3 text-xs text-gray-400 mt-3">
                <span>👁️ ${v.views} مشاهدة</span>
                <span>•</span>
                <span>${v.date}</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>

    </div>
  `;
}

/**
 * Video Modal View
 */
export function VideoModal({ video }) {
  if (!video) return '';

  return `
    <div id="video-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md modal-fade-in">
      <div class="bg-gray-900 border border-gray-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl relative">
        <button id="close-video-modal-btn" class="absolute top-4 left-4 p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>

        <h3 class="text-lg font-black text-white mb-4 pl-10 leading-snug">${video.title}</h3>
        
        <div class="relative pt-[56.25%] rounded-2xl overflow-hidden bg-black border border-gray-800">
          <iframe 
            class="absolute inset-0 w-full h-full" 
            src="https://www.youtube.com/embed/${video.youtubeId}?autoplay=1" 
            title="${video.title}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </div>
      </div>
    </div>
  `;
}
