/* ==========================================
   SPORT ZONE - Contact View Component
   Arabic Interactive Contact Us Form & Direct Support
   ========================================== */

export function ContactView({ submitted = false }) {
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div class="text-center mb-10">
        <span class="px-3.5 py-1 text-xs font-extrabold bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
          تواصل معنا
        </span>
        <h1 class="text-3xl sm:text-4xl font-black text-white mt-3">نحن يسعدنا الاستماع إليك!</h1>
        <p class="text-sm text-gray-400 max-w-xl mx-auto mt-2">
          سواء كان لديك استفسار، اقتراح تغطية رياضية، أو رغبة في الإعلان والشراكة على شبكة SPORT ZONE.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <!-- Contact Cards -->
        <div class="space-y-4">
          <div class="glass-panel p-5 rounded-2xl border border-gray-800 bg-gray-900">
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-lg mb-3">
              📧
            </div>
            <h4 class="text-sm font-bold text-white mb-1">البريد الإلكتروني</h4>
            <p class="text-xs text-gray-400">contact@sportzone.com</p>
          </div>

          <div class="glass-panel p-5 rounded-2xl border border-gray-800 bg-gray-900">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-lg mb-3">
              📞
            </div>
            <h4 class="text-sm font-bold text-white mb-1">الهاتف المباشر</h4>
            <p class="text-xs text-gray-400" dir="ltr">+20 100 200 3000</p>
          </div>

          <div class="glass-panel p-5 rounded-2xl border border-gray-800 bg-gray-900">
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-lg mb-3">
              📍
            </div>
            <h4 class="text-sm font-bold text-white mb-1">المقر الرئيسي</h4>
            <p class="text-xs text-gray-400">القاهرة - جمهورية مصر العربية</p>
          </div>
        </div>

        <!-- Interactive Form -->
        <div class="md:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-gray-800 bg-gray-900/90 shadow-2xl">
          ${submitted ? `
            <div class="p-8 text-center space-y-4">
              <div class="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 text-3xl flex items-center justify-center mx-auto border border-emerald-500/40">
                ✓
              </div>
              <h3 class="text-2xl font-black text-white">تم إرسال رسالتك بنجاح!</h3>
              <p class="text-sm text-gray-300">نشكرك على التواصل مع فريق SPORT ZONE. سيقوم أحد أفراد فريق الدعم بالرد عليك في أقرب وقت.</p>
              <button id="reset-contact-btn" class="btn-glow px-6 py-2.5 rounded-xl text-xs font-bold mt-4">
                إرسال رسالة جديدة
              </button>
            </div>
          ` : `
            <form id="contact-form" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-gray-300 mb-1">الاسم الكامل *</label>
                  <input type="text" required placeholder="أدخل اسمك..." class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500" />
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-300 mb-1">البريد الإلكتروني *</label>
                  <input type="email" required placeholder="name@domain.com" class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500" />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">موضوع الرسالة *</label>
                <select required class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500">
                  <option value="">اختر موضوع الرسالة...</option>
                  <option value="news">اقتراح خبر أو تغطية صحفية</option>
                  <option value="ads">الرعاية والإعلانات</option>
                  <option value="tech">الملاحظات الفنية والموقع</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-300 mb-1">تفاصيل الرسالة *</label>
                <textarea rows="4" required placeholder="اكتب نص رسالتك بالتفصيل هنا..." class="w-full px-4 py-3 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white focus:outline-none focus:border-emerald-500"></textarea>
              </div>

              <button type="submit" class="w-full btn-glow py-3 rounded-xl text-sm font-extrabold">
                إرسال الرسالة الآن
              </button>
            </form>
          `}
        </div>

      </div>

    </div>
  `;
}
