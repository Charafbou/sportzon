/* ==========================================
   SPORT ZONE - Admin Panel View Component
   Full Dashboard to Add/Edit News, Matches & Ticker
   ========================================== */

export function AdminView({ news = [], matches = [], ticker = [] }) {
  return `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <!-- Admin Header -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-800">
        <div>
          <div class="flex items-center gap-2 text-xs font-black text-emerald-400 mb-1">
            <span>⚙️</span>
            <span>لوحة التحكم والإدارة الذكية</span>
          </div>
          <h1 class="text-3xl font-black text-white">لوحة تحكم SPORT ZONE</h1>
          <p class="text-xs text-gray-400 mt-1">أضف الأخبار، عدّل نتائج المباريات مباشرة، أو قم بتصدير ملف JSON المحدث.</p>
        </div>

        <!-- Export & Actions -->
        <div class="flex items-center gap-3">
          <button id="admin-export-json-btn" class="btn-glow px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2">
            <span>📥 تصدير ملف JSON المحدث</span>
          </button>
          <button id="admin-reset-data-btn" class="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold hover:bg-red-500/20">
            إعادة الضبط
          </button>
        </div>
      </div>

      <!-- Admin Tabs Navigation -->
      <div class="flex items-center gap-3 mb-8 overflow-x-auto no-scrollbar bg-gray-900 p-1.5 rounded-2xl border border-gray-800 w-fit">
        <button id="admin-tab-btn-news" class="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-emerald-500 text-gray-950 shadow-md">
          📰 إضافة/إدارة الأخبار
        </button>
        <button id="admin-tab-btn-matches" class="px-5 py-2.5 rounded-xl text-xs font-extrabold text-gray-400 hover:text-white">
          ⚽ تعديل المباريات والنتائج
        </button>
        <button id="admin-tab-btn-ticker" class="px-5 py-2.5 rounded-xl text-xs font-extrabold text-gray-400 hover:text-white">
          🔥 الشريط العاجل
        </button>
      </div>

      <!-- Section 1: Add/Edit News Form -->
      <div id="admin-section-news" class="space-y-8">
        
        <!-- Add News Form -->
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/90 shadow-2xl">
          <h3 class="text-xl font-black text-white mb-6 border-r-4 border-emerald-500 pr-3 flex items-center justify-between">
            <span>إضافة خبر رياضي جديد</span>
            <span class="text-xs font-normal text-gray-400">سيظهر الخبر فوراً في الصفحة الرئيسية</span>
          </h3>

          <form id="admin-add-news-form" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">عنوان الخبر الرئيسي *</label>
                <input type="text" id="admin-news-title" required placeholder="مثال: رسمياً.. الأهلي يحسم صفقة المهاجم الجديد" class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">البطولة / القسم *</label>
                <select id="admin-news-category" required class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500">
                  <option value="الدوري الإنجليزي|premier">الدوري الإنجليزي</option>
                  <option value="الدوري الإسباني|laliga">الدوري الإسباني</option>
                  <option value="دوري أبطال أوروبا|champions">دوري أبطال أوروبا</option>
                  <option value="الدوري الإيطالي|seriea">الدوري الإيطالي</option>
                  <option value="الدوري الفرنسي|ligue1">الدوري الفرنسي</option>
                  <option value="أخبار المنتخبات|national">أخبار المنتخبات</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">رابط الصورة (Image URL) *</label>
                <input type="url" id="admin-news-image" required value="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80" class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">اسم المحرر / الكاتب</label>
                <input type="text" id="admin-news-author" value="فريق التحرير - SPORT ZONE" class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-300 mb-1">الملخص القصير (يقدم للخبر في الرئيسية) *</label>
              <textarea id="admin-news-summary" rows="2" required placeholder="اكتب ملخصاً وجيزاً لـ 2-3 أسطر..." class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500"></textarea>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-300 mb-1">محتوى الخبر الكامل *</label>
              <textarea id="admin-news-content" rows="5" required placeholder="اكتب التفاصيل الكاملة للخبر هنا..." class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500"></textarea>
            </div>

            <div class="flex items-center gap-4 py-2">
              <label class="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                <input type="checkbox" id="admin-news-is-hero" class="w-4 h-4 rounded text-emerald-500 focus:ring-0 bg-gray-950 border-gray-800" />
                <span>تعيين كـ الخبر الرئيسي البارز (Hero Section)</span>
              </label>
            </div>

            <button type="submit" class="btn-glow w-full py-3 rounded-xl text-sm font-extrabold">
              ➕ إضافة الخبر الآن
            </button>
          </form>
        </div>

        <!-- List of Existing News with Delete -->
        <div class="glass-panel p-6 rounded-3xl border border-gray-800 bg-gray-900">
          <h4 class="text-base font-extrabold text-white mb-4">الأخبار الحالية بالموقع (${news.length})</h4>
          <div class="space-y-3">
            ${news.map(item => `
              <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-950/80 border border-gray-800 gap-4">
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <img src="${item.image}" class="w-12 h-12 rounded-xl object-cover" />
                  <div class="min-w-0 flex-1">
                    <h5 class="text-xs font-bold text-white truncate">${item.title}</h5>
                    <span class="text-[10px] text-emerald-400 font-medium">${item.category} • ${item.date}</span>
                  </div>
                </div>
                <button data-admin-delete-news="${item.id}" class="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 border border-red-500/30">
                  حذف
                </button>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Section 2: Matches Management -->
      <div id="admin-section-matches" class="hidden space-y-8">
        
        <!-- Add Match Form -->
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/90 shadow-2xl">
          <h3 class="text-xl font-black text-white mb-6 border-r-4 border-cyan-400 pr-3">إضافة مباراة جديدة أو تعديل نتيجتها</h3>
          
          <form id="admin-add-match-form" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">اسم الفريق الأول (صاحب الأرض) *</label>
                <input type="text" id="admin-match-home-name" required placeholder="مثال: ريال مدريد" class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">اسم الفريق الثاني (الضيف) *</label>
                <input type="text" id="admin-match-away-name" required placeholder="مثال: برشلونة" class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500" />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">نتيجة الفريق الأول</label>
                <input type="number" id="admin-match-home-score" min="0" value="0" class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">نتيجة الفريق الثاني</label>
                <input type="number" id="admin-match-away-score" min="0" value="0" class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">حالة المباراة *</label>
                <select id="admin-match-status" required class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500">
                  <option value="LIVE">مباشر (LIVE)</option>
                  <option value="FINISHED">انتهت (FINISHED)</option>
                  <option value="SCHEDULED">لم تبدأ بعد (SCHEDULED)</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">البطولة *</label>
                <input type="text" id="admin-match-league" value="دوري أبطال أوروبا" required class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">التوقيت / الدقيقة</label>
                <input type="text" id="admin-match-time" value="65'" placeholder="مثال: 45' أو 21:00" class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-cyan-500" />
              </div>
            </div>

            <button type="submit" class="btn-glow w-full py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600">
              ⚽ إضافة / تحديث المباراة
            </button>
          </form>
        </div>

        <!-- Matches List -->
        <div class="glass-panel p-6 rounded-3xl border border-gray-800 bg-gray-900">
          <h4 class="text-base font-extrabold text-white mb-4">المباريات الحالية بالموقع (${matches.length})</h4>
          <div class="space-y-3">
            ${matches.map(m => `
              <div class="flex items-center justify-between p-4 rounded-2xl bg-gray-950/80 border border-gray-800 gap-4">
                <div class="flex items-center gap-3 font-bold text-xs text-white">
                  <span>${m.homeTeam.name} (${m.homeTeam.score})</span>
                  <span class="text-emerald-400">VS</span>
                  <span>${m.awayTeam.name} (${m.awayTeam.score})</span>
                  <span class="px-2 py-0.5 text-[10px] rounded ${m.status === 'LIVE' ? 'bg-red-500/20 text-red-400' : 'bg-gray-800 text-gray-400'}">${m.status}</span>
                </div>
                <button data-admin-delete-match="${m.id}" class="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-bold hover:bg-red-500/20 border border-red-500/30">
                  حذف
                </button>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

      <!-- Section 3: Ticker Management -->
      <div id="admin-section-ticker" class="hidden space-y-8">
        
        <div class="glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/90 shadow-2xl">
          <h3 class="text-xl font-black text-white mb-6 border-r-4 border-amber-400 pr-3">إضافة خبر عاجل جديد</h3>
          
          <form id="admin-add-ticker-form" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-1">نص الخبر العاجل *</label>
              <input type="text" id="admin-ticker-text" required placeholder="🔥 عاجل: ..." class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-amber-500" />
            </div>
            <button type="submit" class="btn-glow w-full py-3 rounded-xl text-sm font-extrabold bg-gradient-to-r from-amber-500 to-orange-500">
              🔥 نشر في الشريط العاجل
            </button>
          </form>
        </div>

        <div class="glass-panel p-6 rounded-3xl border border-gray-800 bg-gray-900">
          <h4 class="text-base font-extrabold text-white mb-4">الأخبار العاجلة الحالية</h4>
          <div class="space-y-2">
            ${ticker.map((item, idx) => `
              <div class="flex items-center justify-between p-3 rounded-xl bg-gray-950/80 border border-gray-800 text-xs text-gray-200">
                <span class="truncate flex-1 font-medium">${item}</span>
                <button data-admin-delete-ticker="${idx}" class="px-2.5 py-1 rounded bg-red-500/10 text-red-400 font-bold hover:bg-red-500/20">
                  حذف
                </button>
              </div>
            `).join('')}
          </div>
        </div>

      </div>

    </div>
  `;
}
