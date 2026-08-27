/* ==========================================
   SPORT ZONE - Navbar Component
   Categories, League Tabs & Links
   ========================================== */

export function Navbar({ activeCategory = 'home' }) {
  const links = [
    { id: 'home', label: 'الرئيسية', icon: '🏠' },
    { id: 'matches', label: 'المباريات والنتائج', icon: '⚽', badge: 'مباشر' },
    { id: 'champions', label: 'دوري أبطال أوروبا', icon: '🏆' },
    { id: 'premier', label: 'الدوري الإنجليزي', icon: '🦁' },
    { id: 'laliga', label: 'الدوري الإسباني', icon: '🇪🇸' },
    { id: 'seriea', label: 'الدوري الإيطالي', icon: '🇮🇹' },
    { id: 'ligue1', label: 'الدوري الفرنسي', icon: '🇫🇷' },
    { id: 'national', label: 'أخبار المنتخبات', icon: '🌍' },
    { id: 'videos', label: 'فيديوهات رياضية', icon: '🎥' },
    { id: 'contact', label: 'اتصل بنا', icon: '📞' },
    { id: 'admin', label: 'لوحة التحكم', icon: '⚙️' }
  ];

  return `
    <nav class="bg-gray-900/90 border-b border-gray-800 shadow-lg sticky top-20 z-40 overflow-x-auto no-scrollbar">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ul class="flex items-center gap-1 py-2 text-sm font-semibold whitespace-nowrap">
          ${links.map(link => {
            const isActive = activeCategory === link.id;
            return `
              <li>
                <button 
                  data-nav-id="${link.id}"
                  class="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold shadow-sm' 
                      : link.id === 'admin'
                        ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white border border-transparent'
                  }"
                >
                  <span class="text-base">${link.icon}</span>
                  <span>${link.label}</span>
                  ${link.badge ? `
                    <span class="px-1.5 py-0.5 text-[10px] font-extrabold bg-red-500 text-white rounded-full animate-pulse">${link.badge}</span>
                  ` : ''}
                </button>
              </li>
            `;
          }).join('')}
        </ul>
      </div>
    </nav>
  `;
}
