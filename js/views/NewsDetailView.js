/* ==========================================
   SPORT ZONE - News Detail View Component
   Full Article Page, Original Source Link & Comments
   ========================================== */

export function NewsDetailView({ article, relatedNews = [] }) {
  if (!article) return '';

  return `
    <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Category & Breadcrumbs -->
      <div class="flex items-center gap-2 text-xs font-extrabold text-emerald-400 mb-4">
        <span>الرئيسية</span>
        <span>/</span>
        <span>${article.category}</span>
      </div>

      <!-- Main Headline -->
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-4">
        ${article.title}
      </h1>

      <!-- Meta Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-800 text-xs text-gray-400 mb-6">
        <div class="flex items-center gap-4">
          <span class="font-bold text-gray-200">✍️ المصدر: ${article.author || 'SPORT ZONE'}</span>
          <span>📅 ${article.date}</span>
          <span>⏱️ زمن القراءة: ${article.readTime}</span>
        </div>

        ${article.sourceUrl ? `
          <a 
            href="${article.sourceUrl}" 
            target="_blank" 
            rel="noopener noreferrer" 
            class="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-extrabold hover:bg-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <span>رابط المصدر الأصلي</span>
            <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
            </svg>
          </a>
        ` : ''}
      </div>

      <!-- Featured Main Image -->
      <div class="rounded-3xl overflow-hidden mb-8 border border-gray-800 shadow-2xl">
        <img 
          src="${article.image}" 
          alt="${article.title}" 
          class="w-full h-[350px] sm:h-[450px] object-cover" 
          onerror="this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'"
        />
      </div>

      <!-- Article Lead Summary -->
      <div class="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 font-bold text-base leading-relaxed mb-8">
        ${article.summary}
      </div>

      <!-- Main Body Text -->
      <div class="prose prose-invert max-w-none text-gray-200 text-base leading-loose font-medium space-y-6 mb-12">
        ${article.content.split('\n').map(p => p.trim() ? `<p>${p}</p>` : '').join('')}
      </div>

      <!-- Share & Original Source Box -->
      <div class="p-5 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
        <div class="flex items-center gap-2">
          <span class="font-extrabold text-sm text-white">المصدر الرسمي:</span>
          <span class="text-xs text-emerald-400 font-bold">${article.author || 'Google News / Sky Sports'}</span>
        </div>

        <div class="flex items-center gap-3">
          ${article.sourceUrl ? `
            <a href="${article.sourceUrl}" target="_blank" class="btn-glow px-5 py-2 rounded-xl text-xs font-extrabold">
              الانتقال للخبر في الموقع الأصلي 🌐
            </a>
          ` : ''}
        </div>
      </div>

      <!-- Interactive Comments Section -->
      <section class="my-12 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/90">
        <h3 class="text-xl font-black text-white mb-6 flex items-center gap-2">
          <span>التعليقات والمناقشات</span>
          <span class="px-2.5 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 rounded-full">
            ${(article.comments || []).length}
          </span>
        </h3>

        <form id="comment-form" class="space-y-4 mb-8">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input 
              type="text" 
              id="comment-name" 
              placeholder="اسمك الكريم..." 
              required 
              class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <textarea 
            id="comment-text" 
            rows="3" 
            placeholder="اكتب تعليقك ورأيك حول هذا الخبر الرياضي..." 
            required 
            class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-sm text-white focus:outline-none focus:border-emerald-500"
          ></textarea>
          <button type="submit" class="btn-glow px-6 py-2.5 rounded-xl text-sm font-bold">
            نشر التعليق
          </button>
        </form>

        <div class="space-y-4" id="comments-container">
          ${(article.comments || []).map(c => `
            <div class="p-4 rounded-2xl bg-gray-950/80 border border-gray-800/80">
              <div class="flex items-center justify-between mb-2">
                <span class="font-extrabold text-sm text-emerald-400">${c.user}</span>
                <span class="text-[11px] text-gray-500">${c.date}</span>
              </div>
              <p class="text-sm text-gray-300 leading-relaxed">${c.text}</p>
            </div>
          `).join('')}
        </div>

      </section>

    </article>
  `;
}
