/* ==========================================
   SPORT ZONE - Header Component
   Logo, Search, Theme Toggle, Live Pill & Admin Button
   ========================================== */

export function Header({ currentTheme, onToggleTheme, onOpenSearch, onNavigate }) {
  return `
    <header class="sticky top-0 z-50 glass-panel border-b border-gray-800 transition-colors">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
          
          <!-- Logo & Brand -->
          <div class="flex items-center gap-3 cursor-pointer" id="nav-brand-logo">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
              <div class="w-full h-full bg-gray-900 rounded-[10px] flex items-center justify-center">
                <span class="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">SZ</span>
              </div>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h1 class="text-2xl font-extrabold tracking-wider text-white font-sans">SPORT <span class="text-emerald-400">ZONE</span></h1>
                <span class="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">عربي</span>
              </div>
              <p class="text-[11px] text-gray-400 font-medium">المنصة الرياضية العربية الأولى</p>
            </div>
          </div>

          <!-- Quick Navigation Actions -->
          <div class="hidden md:flex items-center gap-4">
            
            <!-- Live Matches Quick Link -->
            <button id="nav-btn-live-matches" class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              <span>مباريات مباشرة</span>
              <span class="px-1.5 py-0.2 text-[10px] bg-red-600 text-white rounded-full">1</span>
            </button>

            <!-- Search Button Trigger -->
            <button id="nav-btn-search-trigger" class="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-800/80 border border-gray-700/60 text-gray-300 text-sm hover:border-emerald-500/50 hover:text-white transition-all">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span>ابحث عن خبر، فريق، أو لاعب...</span>
              <kbd class="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-gray-700 text-gray-400 rounded">Ctrl+K</kbd>
            </button>

            <!-- Admin Panel Button -->
            <button id="nav-btn-admin-panel" class="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-extrabold hover:bg-amber-500/20 transition-all">
              <span>⚙️</span>
              <span>لوحة التحكم</span>
            </button>

            <!-- Dark / Light Theme Toggle -->
            <button id="nav-btn-theme-toggle" class="p-2.5 rounded-xl bg-gray-800/80 border border-gray-700/60 text-gray-300 hover:text-amber-400 transition-colors" title="تغيير المظهر">
              ${currentTheme === 'dark' ? `
                <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                </svg>
              ` : `
                <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                </svg>
              `}
            </button>
          </div>

          <!-- Mobile Actions -->
          <div class="flex md:hidden items-center gap-2">
            <button id="mobile-admin-btn" class="p-2 text-amber-400 text-xs font-bold bg-amber-500/10 rounded-lg">⚙️ لوحة التحكم</button>
            <button id="mobile-search-btn" class="p-2 text-gray-300 hover:text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </header>
  `;
}
