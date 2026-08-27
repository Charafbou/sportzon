/**
 * SPORT ZONE - Complete Application Bundle
 * Pure Vanilla JS - Zero CORS / Zero Module Dependencies
 */

const LEAGUES = [
  { id: 'all', name: 'جميع البطولات', flag: '🌍', type: 'all' },
  // البطولات العربية والإقليمية
  { id: 'botola', name: 'البطولة المغربية', flag: '🇲🇦', group: 'عربية' },
  { id: 'saudi', name: 'دوري روشن السعودي', flag: '🇸🇦', group: 'عربية' },
  { id: 'egypt', name: 'الدوري المصري', flag: '🇪🇬', group: 'عربية' },
  { id: 'uae', name: 'دوري أدنوك الإماراتي', flag: '🇦🇪', group: 'عربية' },
  { id: 'qatar', name: 'دوري نجوم قطر', flag: '🇶🇦', group: 'عربية' },
  { id: 'algeria', name: 'الرابطة الجزائرية 1', flag: '🇩🇿', group: 'عربية' },
  { id: 'tunisia', name: 'الرابطة التونسية 1', flag: '🇹🇳', group: 'عربية' },
  { id: 'caf_cl', name: 'دوري أبطال إفريقيا', flag: '🌍', group: 'إقليمية' },
  { id: 'afc_cl', name: 'دوري أبطال آسيا للنخبة', flag: '🏆', group: 'إقليمية' },
  // الدوريات العالمية الكبرى
  { id: 'ucl', name: 'دوري أبطال أوروبا', flag: '🏆', group: 'عالمية' },
  { id: 'epl', name: 'الدوري الإنجليزي الممتاز', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', group: 'عالمية' },
  { id: 'laliga', name: 'الدوري الإسباني', flag: '🇪🇸', group: 'عالمية' },
  { id: 'seriea', name: 'الدوري الإيطالي', flag: '🇮🇹', group: 'عالمية' },
  { id: 'bundesliga', name: 'الدوري الألماني', flag: '🇩🇪', group: 'عالمية' },
  { id: 'ligue1', name: 'الدوري الفرنسي', flag: '🇫🇷', group: 'عالمية' }
];

const MATCHES = [
  // Upcoming
  { id: 1, type: 'upcoming', league: 'botola', leagueName: 'البطولة المغربية', home: 'الوداد الرياضي', away: 'الرجاء الرياضي', time: '20:00', date: 'اليوم', homeLogo: '🔴', awayLogo: '🟢', stadium: 'مركب محمد الخامس' },
  { id: 2, type: 'upcoming', league: 'saudi', leagueName: 'دوري روشن السعودي', home: 'الهلال', away: 'النصر', time: '21:00', date: 'اليوم', homeLogo: '🔵', awayLogo: '🟡', stadium: 'المملكة أرينا' },
  { id: 3, type: 'upcoming', league: 'epl', leagueName: 'الدوري الإنجليزي', home: 'مانشستر سيتي', away: 'ليفربول', time: '17:30', date: 'غداً', homeLogo: '🔵', awayLogo: '🔴', stadium: 'ملعب الاتحاد' },
  { id: 4, type: 'upcoming', league: 'laliga', leagueName: 'الدوري الإسباني', home: 'ريال مدريد', away: 'برشلونة', time: '21:00', date: 'الأحد', homeLogo: '⚪', awayLogo: '🔵🔴', stadium: 'سانتياغو برنابيو' },
  { id: 5, type: 'upcoming', league: 'egypt', leagueName: 'الدوري المصري', home: 'الأهلي', away: 'الزمالك', time: '19:00', date: 'السبت', homeLogo: '🦅', awayLogo: '🏹', stadium: 'ستاد القاهرة' },
  { id: 6, type: 'upcoming', league: 'ucl', leagueName: 'دوري أبطال أوروبا', home: 'بايرن ميونخ', away: 'باريس سان جيرمان', time: '20:00', date: 'الثلاثاء', homeLogo: '🔴', awayLogo: '🔵', stadium: 'أليانز أرينا' },
  
  // Results
  { id: 7, type: 'results', league: 'botola', leagueName: 'البطولة المغربية', home: 'الجيش الملكي', away: 'نهضة بركان', homeScore: 2, awayScore: 1, status: 'انتهت', date: 'أمس', homeLogo: '🟢', awayLogo: '🟠' },
  { id: 8, type: 'results', league: 'epl', leagueName: 'الدوري الإنجليزي', home: 'أرسنال', away: 'تشيلسي', homeScore: 3, awayScore: 1, status: 'انتهت', date: 'أمس', homeLogo: '🔴', awayLogo: '🔵' },
  { id: 9, type: 'results', league: 'saudi', leagueName: 'دوري روشن السعودي', home: 'الاتحاد', away: 'الأهلي', homeScore: 2, awayScore: 2, status: 'انتهت', date: 'أمس', homeLogo: '🟡', awayLogo: '🟢' },
  { id: 10, type: 'results', league: 'ucl', leagueName: 'دوري أبطال أوروبا', home: 'إنتر ميلان', away: 'أتلتيكو مدريد', homeScore: 1, awayScore: 0, status: 'انتهت', date: 'منذ يومين', homeLogo: '🔵⚫', awayLogo: '🔴⚪' }
];

const NEWS = [
  {
    id: 1,
    title: 'قمة نارية مرتقبة في ديربي الدار البيضاء وسط حضور جماهيري قياسي',
    summary: 'استعدادات مكثفة من الفريقين لحسم صدارة الترتيب وسط ترقب كبير من عشاق الكرة المغربية.',
    category: 'البطولة المغربية',
    time: 'منذ 30 دقيقة',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'صراع الصدارة يشتعل في الدوري الإنجليزي بعد تعثر حامل اللقب',
    summary: 'نتائج الجولة الأخيرة تقلب موازين المربع الذهبي وتفتح المنافسة على مصراعيها بين الثلاثي المتصدر.',
    category: 'الدوري الإنجليزي',
    time: 'منذ ساعتين',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'دوري روشن: الهلال والنصر في كلاسيكو الحسم نحو اللقب',
    summary: 'مواجهة تكتيكية مرتقبة تجمع ألمع نجوم العالم في أمسية كروية استثنائية على أرضية المملكة أرينا.',
    category: 'دوري روشن',
    time: 'منذ 3 ساعات',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'قرعة دوري أبطال أوروبا تسفر عن مواجهات ثأرية حارقة في الأدوار الإقصائية',
    summary: 'صدامات قوية تجمع عمالقة القارة العجوز في رحلة البحث عن التتويج بالكأس ذات الأذنين.',
    category: 'دوري أبطال أوروبا',
    time: 'منذ 5 ساعات',
    image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&w=800&q=80'
  }
];

const VIDEOS = [
  {
    id: 1,
    title: 'ملخص وأهداف قمة الدوري الإسباني: أهداف عالمية ولمحات ساحرة',
    duration: '10:45',
    views: '240K',
    thumbnail: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/'
  },
  {
    id: 2,
    title: 'أفضل 10 تصديات وإثارة الدقائق الأخيرة في البطولة الوطنية',
    duration: '08:20',
    views: '185K',
    thumbnail: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/'
  },
  {
    id: 3,
    title: 'ملخص كلاسيكو السعودية: إثارة جنونية وأهداف لا تضيع',
    duration: '12:15',
    views: '310K',
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/'
  }
];

const BREAKING_NEWS = [
  '🚨 رسميًا: كلاسيكو الأرض ينطلق الأحد القادم في تمام الساعة 21:00 بتوقيت مكة المكرمة.',
  '⚽ البطولة المغربية: اكتمال جاهزية مركب محمد الخامس لاحتضان ديربي البيضاء.',
  '🏆 قرعة نصف نهائي دوري أبطال إفريقيا تُجرى الأسبوع المقبل في القاهرة.',
  '🔥 صراع الهدافين يشتعل في دوري روشن السعودي وصدارة مشتركة على الحذاء الذهبي.'
];

let selectedLeague = 'all';
let selectedMatchTab = 'upcoming'; // 'upcoming' | 'results'

function renderApp() {
  const root = document.getElementById('app-root');
  if (!root) return;

  root.innerHTML = `
    <!-- Header Navigation -->
    <header class="sticky top-0 z-50 bg-[#0c1222]/95 backdrop-blur-md border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="text-3xl">⚽</span>
          <div>
            <a href="/" class="text-2xl font-black tracking-wider bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">SPORT ZONE</a>
            <span class="text-[10px] block text-gray-400 font-mono -mt-1">sportzon.biz</span>
          </div>
        </div>
        
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <a href="#matches" class="hover:text-emerald-400 transition-colors">مركز المباريات</a>
          <a href="#news" class="hover:text-emerald-400 transition-colors">الأخبار</a>
          <a href="#videos" class="hover:text-emerald-400 transition-colors">الفيديوهات</a>
          <a href="#leagues" class="hover:text-emerald-400 transition-colors">الدوريات</a>
        </nav>

        <div class="flex items-center gap-3">
          <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1.5"></span> مباشر الآن
          </span>
        </div>
      </div>
    </header>

    <!-- 1. Breaking News Ticker -->
    <section class="bg-gradient-to-r from-red-950/60 via-gray-900 to-black border-y border-red-900/30 overflow-hidden py-2.5">
      <div class="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <div class="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded shadow-md flex items-center gap-1 shrink-0 uppercase tracking-wider">
          <span class="animate-ping w-2 h-2 rounded-full bg-white ml-1"></span> عاجل
        </div>
        <div class="overflow-hidden relative w-full">
          <div class="whitespace-nowrap inline-block animate-marquee text-sm text-gray-200 font-medium">
            ${BREAKING_NEWS.join(' &nbsp;&nbsp;&nbsp;&nbsp;✦&nbsp;&nbsp;&nbsp;&nbsp; ')}
          </div>
        </div>
      </div>
    </section>

    <!-- 2. Leagues Filter Bar (Scrollable) -->
    <section id="leagues" class="bg-[#0e1626] border-b border-gray-800/80 py-3 sticky top-16 z-40 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          ${LEAGUES.map(league => `
            <button onclick="setLeague('${league.id}')" 
              class="shrink-0 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-200 ${
                selectedLeague === league.id 
                  ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20 font-black' 
                  : 'bg-gray-800/70 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700/50'
              }">
              <span>${league.flag}</span>
              <span>${league.name}</span>
            </button>
          `).join('')}
        </div>
      </div>
    </section>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      <!-- 3. Interactive Match Center -->
      <section id="matches" class="space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-800 pb-3">
          <div>
            <h2 class="text-xl font-black text-white flex items-center gap-2">
              <span class="text-emerald-400">📊</span> مركز المباريات والنتائج
            </h2>
            <p class="text-xs text-gray-400 mt-0.5">مواعيد ونتائج حية للدوريات العربية والعالمية</p>
          </div>
          
          <!-- Match Tabs -->
          <div class="flex items-center bg-gray-900 p-1 rounded-xl border border-gray-800 self-start">
            <button onclick="setMatchTab('upcoming')" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMatchTab === 'upcoming' ? 'bg-emerald-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }">المباريات القادمة</button>
            <button onclick="setMatchTab('results')" class="px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedMatchTab === 'results' ? 'bg-emerald-500 text-black shadow' : 'text-gray-400 hover:text-white'
            }">النتائج الأخيرة</button>
          </div>
        </div>

        <!-- Matches Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          ${getFilteredMatches().length > 0 ? getFilteredMatches().map(match => `
            <div class="bg-[#111827]/80 hover:bg-[#151f33] border border-gray-800 hover:border-emerald-500/40 rounded-2xl p-4 transition-all duration-300 shadow-lg relative overflow-hidden group">
              <div class="flex items-center justify-between text-[11px] font-semibold text-gray-400 mb-3 border-b border-gray-800/60 pb-2">
                <span class="text-emerald-400 font-bold">${match.leagueName}</span>
                <span class="bg-gray-800 px-2 py-0.5 rounded text-gray-300">${match.date}</span>
              </div>
              
              <div class="flex items-center justify-between py-2">
                <div class="flex flex-col items-center flex-1 text-center">
                  <div class="text-3xl mb-1">${match.homeLogo}</div>
                  <span class="text-xs font-bold text-gray-200 line-clamp-1">${match.home}</span>
                </div>

                <div class="px-4 flex flex-col items-center justify-center">
                  ${match.type === 'upcoming' ? `
                    <span class="text-sm font-black text-emerald-400 bg-emerald-950/40 px-3 py-1 rounded-lg border border-emerald-800/30">${match.time}</span>
                    <span class="text-[10px] text-gray-500 mt-1 font-mono">${match.stadium || 'الملعب الرئيسي'}</span>
                  ` : `
                    <div class="flex items-center gap-2">
                      <span class="text-lg font-black text-white">${match.homeScore}</span>
                      <span class="text-gray-600 font-bold">-</span>
                      <span class="text-lg font-black text-white">${match.awayScore}</span>
                    </div>
                    <span class="text-[10px] text-red-400 font-bold mt-1 bg-red-950/30 px-2 py-0.5 rounded">${match.status}</span>
                  `}
                </div>

                <div class="flex flex-col items-center flex-1 text-center">
                  <div class="text-3xl mb-1">${match.awayLogo}</div>
                  <span class="text-xs font-bold text-gray-200 line-clamp-1">${match.away}</span>
                </div>
              </div>
            </div>
          `).join('') : `
            <div class="col-span-full py-12 text-center text-gray-500 bg-gray-900/40 rounded-2xl border border-dashed border-gray-800">
              لا توجد مباريات مدرجة لهذا الدوري حالياً.
            </div>
          `}
        </div>
      </section>

      <!-- 4. Photo News Section -->
      <section id="news" class="space-y-4">
        <div class="border-b border-gray-800 pb-3 flex items-center justify-between">
          <h2 class="text-xl font-black text-white flex items-center gap-2">
            <span class="text-emerald-400">📰</span> آخر الأخبار والمقالات
          </h2>
          <span class="text-xs text-emerald-400 font-semibold cursor-pointer hover:underline">تحديث مستمر</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          ${NEWS.map(item => `
            <article class="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all duration-300 group flex flex-col">
              <div class="relative h-44 overflow-hidden">
                <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span class="absolute top-3 right-3 bg-emerald-500 text-black text-[10px] font-black px-2.5 py-1 rounded-md shadow">
                  ${item.category}
                </span>
              </div>
              <div class="p-4 flex-1 flex flex-col justify-between space-y-3">
                <h3 class="text-sm font-bold text-gray-100 group-hover:text-emerald-400 transition-colors leading-relaxed line-clamp-2">
                  ${item.title}
                </h3>
                <p class="text-xs text-gray-400 line-clamp-2 leading-normal">
                  ${item.summary}
                </p>
                <div class="text-[10px] text-gray-500 flex items-center justify-between pt-2 border-t border-gray-800/80">
                  <span>⏱ ${item.time}</span>
                  <span class="text-emerald-400 font-bold group-hover:translate-x-[-2px] transition-transform">قراءة المزيد ←</span>
                </div>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- 5. Video Highlights Section -->
      <section id="videos" class="space-y-4">
        <div class="border-b border-gray-800 pb-3 flex items-center justify-between">
          <h2 class="text-xl font-black text-white flex items-center gap-2">
            <span class="text-red-500">🎬</span> ملخصات وأهداف بالفيديو
          </h2>
          <span class="text-xs text-gray-400 font-mono">HD Highlights</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          ${VIDEOS.map(video => `
            <div class="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden group hover:border-red-500/50 transition-all duration-300">
              <div class="relative h-48 overflow-hidden cursor-pointer">
                <img src="${video.thumbnail}" alt="${video.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div class="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center text-xl shadow-xl group-hover:scale-110 group-hover:bg-red-500 transition-all">
                    ▶
                  </div>
                </div>
                <span class="absolute bottom-2 left-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  ${video.duration}
                </span>
              </div>
              <div class="p-4 space-y-2">
                <h3 class="text-xs font-bold text-gray-200 group-hover:text-white line-clamp-2 leading-relaxed">
                  ${video.title}
                </h3>
                <div class="flex items-center justify-between text-[10px] text-gray-500 pt-1">
                  <span>👁 ${video.views} مشاهدة</span>
                  <span class="text-red-400 font-semibold">مشاهدة الهدف</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

    </main>

    <!-- Footer Legal & Navigation -->
    <footer class="bg-[#080c14] border-t border-gray-800/80 mt-16 text-gray-400 text-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <span class="text-2xl">⚽</span>
            <div>
              <span class="text-lg font-black text-white">SPORT ZONE</span>
              <p class="text-[11px] text-gray-500">منصة الأخبار والنتائج الرياضية على مدار الساعة</p>
            </div>
          </div>
          
          <div class="flex flex-wrap justify-center gap-6 text-xs text-gray-300 font-medium">
            <a href="/privacy-policy.html" class="hover:text-emerald-400 transition-colors">سياسة الخصوصية</a>
            <a href="/terms.html" class="hover:text-emerald-400 transition-colors">شروط الاستخدام</a>
            <a href="/about.html" class="hover:text-emerald-400 transition-colors">من نحن</a>
            <a href="/contact.html" class="hover:text-emerald-400 transition-colors">اتصل بنا</a>
          </div>
        </div>

        <div class="border-t border-gray-800/60 pt-6 text-center text-gray-500 text-[11px]">
          <p>© 2026 SPORT ZONE (sportzon.biz) - جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  `;
}

function setLeague(id) {
  selectedLeague = id;
  renderApp();
}

function setMatchTab(tab) {
  selectedMatchTab = tab;
  renderApp();
}

function getFilteredMatches() {
  return MATCHES.filter(m => {
    const matchType = m.type === selectedMatchTab;
    const matchLeague = selectedLeague === 'all' || m.league === selectedLeague;
    return matchType && matchLeague;
  });
}

// Add CSS marquee style dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes marquee {
    0% { transform: translateX(100%); }
    100% { transform: translateX(-100%); }
  }
  .animate-marquee {
    display: inline-block;
    animation: marquee 30s linear infinite;
  }
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
document.head.appendChild(style);

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', renderApp);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  renderApp();
}