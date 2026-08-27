/* ==========================================
   SPORT ZONE - Footer Component
   Arabic Footer with Social, Legal & sportzone.biz Compliance
   ========================================== */

export function Footer() {
  return `
    <footer class="bg-gray-950 border-t border-gray-800 text-gray-400 text-sm mt-16 pt-12 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-gray-800">
          
          <!-- Column 1: Brand Info -->
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5">
                <div class="w-full h-full bg-gray-900 rounded-[10px] flex items-center justify-center">
                  <span class="text-lg font-black text-emerald-400">SZ</span>
                </div>
              </div>
              <span class="text-xl font-extrabold text-white">SPORT <span class="text-emerald-400">ZONE</span></span>
            </div>
            <p class="text-xs text-gray-400 leading-relaxed mb-4">
              المنصة الرياضية العربية الأولى لتغطية أبرز الأحداث والمباريات والنتائج المباشرة والأخبار الرياضية العالمية والمحلية على النطاق الرسمي <code class="text-emerald-400">sportzone.biz</code>.
            </p>
            <div class="flex items-center gap-3">
              <a href="#" class="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors">
                🐦
              </a>
              <a href="#" class="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors">
                📘
              </a>
              <a href="#" class="w-8 h-8 rounded-lg bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors">
                📷
              </a>
            </div>
          </div>

          <!-- Column 2: Quick Links -->
          <div>
            <h4 class="text-white font-extrabold mb-4 border-r-4 border-emerald-500 pr-2">روابط سريعة</h4>
            <ul class="space-y-2 text-xs">
              <li><button data-nav-id="home" class="hover:text-emerald-400 transition-colors">الرئيسية</button></li>
              <li><button data-nav-id="matches" class="hover:text-emerald-400 transition-colors">جدول مباريات اليوم</button></li>
              <li><button data-nav-id="champions" class="hover:text-emerald-400 transition-colors">دوري أبطال أوروبا</button></li>
              <li><button data-nav-id="premier" class="hover:text-emerald-400 transition-colors">الدوري الإنجليزي الممتاز</button></li>
              <li><button data-nav-id="laliga" class="hover:text-emerald-400 transition-colors">الدوري الإسباني (الليغا)</button></li>
            </ul>
          </div>

          <!-- Column 3: Legal & Compliance (صفحات الامتثال القانوني) -->
          <div>
            <h4 class="text-white font-extrabold mb-4 border-r-4 border-amber-400 pr-2">الوثائق والصفحات القانونية</h4>
            <ul class="space-y-2 text-xs">
              <li><button data-nav-id="privacy" class="hover:text-amber-400 transition-colors flex items-center gap-1.5"><span class="text-amber-400">📜</span> سياسة الخصوصية (Privacy Policy)</button></li>
              <li><button data-nav-id="terms" class="hover:text-amber-400 transition-colors flex items-center gap-1.5"><span class="text-amber-400">⚖️</span> الشروط والأحكام (Terms & Conditions)</button></li>
              <li><button data-nav-id="dmca" class="hover:text-amber-400 transition-colors flex items-center gap-1.5"><span class="text-amber-400">🛡️</span> إشعار حقوق الملكية (DMCA)</button></li>
              <li><button data-nav-id="contact" class="hover:text-amber-400 transition-colors flex items-center gap-1.5"><span>📞</span> اتصل بإدارة الموقع</button></li>
            </ul>
          </div>

          <!-- Column 4: Newsletter -->
          <div>
            <h4 class="text-white font-extrabold mb-4 border-r-4 border-cyan-400 pr-2">النشرة الإخبارية</h4>
            <p class="text-xs text-gray-400 mb-3">
              اشترك في نشرتنا البريدية لتصلك ملخصات المباريات والأخبار مجاناً.
            </p>
            <form id="newsletter-form" class="space-y-2">
              <input 
                type="email" 
                placeholder="أدخل بريدك الإلكتروني..." 
                required 
                class="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
              />
              <button type="submit" class="w-full btn-glow py-2.5 rounded-xl text-xs font-bold">
                اشترك الآن
              </button>
            </form>
          </div>

        </div>

        <!-- Copyright & Legal Footer Links -->
        <div class="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 SPORT ZONE (<span class="text-emerald-400">sportzone.biz</span>). جميع الحقوق محفوظة.</p>
          <div class="flex flex-wrap items-center gap-4">
            <button data-nav-id="privacy" class="hover:text-gray-300">سياسة الخصوصية</button>
            <span>•</span>
            <button data-nav-id="terms" class="hover:text-gray-300">الشروط والأحكام</button>
            <span>•</span>
            <button data-nav-id="dmca" class="hover:text-gray-300">حقوق الملكية DMCA</button>
          </div>
        </div>

      </div>
    </footer>
  `;
}
