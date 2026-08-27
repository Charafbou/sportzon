/* ==========================================
   SPORT ZONE - DMCA & Copyright Disclaimer View
   Intellectual Property Notice & Takedown Form for sportzone.biz
   ========================================== */

export function DmcaView({ submitted = false }) {
  return `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      <!-- Header Banner -->
      <div class="text-center mb-10 pb-6 border-b border-gray-800">
        <span class="px-3.5 py-1 text-xs font-extrabold bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
          الملكية الفكرية • sportzone.biz
        </span>
        <h1 class="text-3xl sm:text-4xl font-black text-white mt-3">إشعار حقوق الملكية والـ DMCA</h1>
        <p class="text-xs text-gray-400 mt-2">إخلاء مسؤولية حقوق النشر وسياسة طلبات الإزالة</p>
      </div>

      <!-- Legal Content Body -->
      <div class="glass-panel p-6 sm:p-10 rounded-3xl border border-gray-800 bg-gray-900/90 shadow-2xl space-y-8 text-sm text-gray-300 leading-relaxed font-medium">
        
        <!-- Fair Use Notice -->
        <section>
          <h2 class="text-lg font-black text-white mb-3 border-r-4 border-amber-400 pr-3">1. بيان الاستخدام العادل (Fair Use Disclaimer)</h2>
          <p class="mb-3">
            جميع الشعارات، والعلامات التجارية، وأسماء الأندية والاتشارات الرياضية المنشورة على موقع **sportzone.biz** هي ملك حصري لأصحابها الأصليين والاتحادات والفرق المعنية.
          </p>
          <p>
            يستخدم موقع **SPORT ZONE** هذه المواد والصور لأغراض التغطية الصحفية، الإعلامية، والإخبارية الشفافة بموجب ممارسة <strong>الاستخدام العادل (Fair Use)</strong> لعام 2026، ودون أي ادعاء لملكية هذه العلامات أو الانتساب الرسمي لتلك الأندية ما لم يُذكر خلاف ذلك.
          </p>
        </section>

        <!-- Copyright Policy -->
        <section>
          <h2 class="text-lg font-black text-white mb-3 border-r-4 border-emerald-500 pr-3">2. سياسة احترام حقوق النشر</h2>
          <p>
            نحن نلتزم بقانون حقوق المؤلف للألفية الرقمية (DMCA) وكافة التشريعات الدولية ذات الصلة. إذا كنت مالكاً لحقوق ملكية فكرية أو وكيلاً معتمداً وتعتقد أن أي محتوى مدرج في موقعنا ينتهك حقوق النشر الخاصة بك، فإننا نرحب بتواصلك وحذف هذا المحتوى فوراً بعد التحقق.
          </p>
        </section>

        <!-- DMCA Takedown Form / Contact -->
        <section class="p-6 rounded-2xl bg-gray-950/80 border border-gray-800 space-y-4">
          <h3 class="text-base font-extrabold text-white flex items-center gap-2">
            <span>📩 إرسال طلب إزالة محتوى (DMCA Takedown Request)</span>
          </h3>

          ${submitted ? `
            <div class="p-4 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40 text-center">
              ✓ تم استلام طلب الإزالة الخاص بك بنجاح. سيتم مراجعة الطلب وحذف المحتوى فوراً خلال 24 ساعة.
            </div>
          ` : `
            <p class="text-xs text-gray-400">
              يرجى ملء النموذج أدناه مبيناً رابط المحتوى المنتهِك ودليل الملكية وسيقوم القسم القانوني بمعالجة طلبك فوراً:
            </p>

            <form id="dmca-form" class="space-y-3">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" required placeholder="اسم مالك الحقوق / الوكيل..." class="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-amber-500" />
                <input type="email" required placeholder="البريد الإلكتروني للتواصل..." class="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-amber-500" />
              </div>
              <input type="url" required placeholder="رابط الصفحة التي تحتوي على المحتوى في sportzone.biz..." class="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-amber-500" />
              <textarea rows="3" required placeholder="تفاصيل الانتهاك ودليل إثبات الملكية..." class="w-full px-3.5 py-2.5 rounded-xl bg-gray-900 border border-gray-800 text-xs text-white focus:outline-none focus:border-amber-500"></textarea>
              
              <button type="submit" class="btn-glow w-full py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-500 to-orange-500">
                إرسال طلب إزالة المحتوى كـ DMCA Notice
              </button>
            </form>
          `}

          <div class="pt-3 border-t border-gray-800 text-[11px] text-gray-400">
            يمكنك أيضاً مراسلتنا مباشرة عبر البريد الإلكتروني المخصص لحقوق النشر: <a href="mailto:dmca@sportzone.biz" class="text-amber-400 font-bold">dmca@sportzone.biz</a>
          </div>
        </section>

      </div>

    </div>
  `;
}
