/* =========================================================
   SPORT ZONE - Production Sports SPA
   - Live Kooora & Sports RSS News Ticker with Auto-Refresh (60s)
   - Yesterday / Today / Tomorrow filtering
   - Local device timezone
   - Dynamic league matches
   - Dynamic standings
   - Null-safe DOM
   ========================================================= */

(function () {
  "use strict";

  const OFFICIAL_DOMAIN = "sportzon.biz";
  const CONTACT_EMAIL = "contact@sportzon.biz";
  const POLL_STORAGE_KEY = "sz_user_poll_vote_v2026";

  const FALLBACK_CREST =
    "https://cdn-icons-png.flaticon.com/512/53/53283.png";

  const COMPETITIONS = {
    PL: {
      name: "الدوري الإنجليزي الممتاز",
      flag: "🏴",
      id: "PL"
    },
    PD: {
      name: "الدوري الإسباني (الليغا)",
      flag: "🇪🇸",
      id: "PD"
    },
    SA: {
      name: "الدوري الإيطالي (الكالتشيو)",
      flag: "🇮🇹",
      id: "SA"
    },
    BL1: {
      name: "الدوري الألماني (البوندسليغا)",
      flag: "🇩🇪",
      id: "BL1"
    },
    CL: {
      name: "دوري أبطال أوروبا",
      flag: "🏆",
      id: "CL"
    }
  };

  const SIDEBAR_LEAGUES = [
    {
      name: "الدوري الإنجليزي الممتاز",
      flag: "🏴",
      code: "PL"
    },
    {
      name: "الدوري الإسباني",
      flag: "🇪🇸",
      code: "PD"
    },
    {
      name: "الدوري الإيطالي",
      flag: "🇮🇹",
      code: "SA"
    },
    {
      name: "الدوري الألماني",
      flag: "🇩🇪",
      code: "BL1"
    },
    {
      name: "دوري أبطال أوروبا",
      flag: "🏆",
      code: "CL"
    }
  ];

  /* =========================================================
     FALLBACK STANDINGS
     ========================================================= */

  const NATIVE_STANDINGS_MAP = {
    PL: [
      {
        position: 1,
        team: {
          name: "ليفربول",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/0/0c/Liverpool_FC.svg"
        },
        points: 18,
        playedGames: 7,
        goalsFor: 13,
        goalsAgainst: 2
      },
      {
        position: 2,
        team: {
          name: "مانشستر سيتي",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg"
        },
        points: 17,
        playedGames: 7,
        goalsFor: 17,
        goalsAgainst: 8
      },
      {
        position: 3,
        team: {
          name: "أرسنال",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg"
        },
        points: 17,
        playedGames: 7,
        goalsFor: 15,
        goalsAgainst: 6
      },
      {
        position: 4,
        team: {
          name: "أستون فيلا",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/f/f9/Aston_Villa_FC_crest_%282016%29.svg"
        },
        points: 14,
        playedGames: 7,
        goalsFor: 12,
        goalsAgainst: 9
      }
    ],

    PD: [
      {
        position: 1,
        team: {
          name: "برشلونة",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona.svg"
        },
        points: 24,
        playedGames: 9,
        goalsFor: 28,
        goalsAgainst: 10
      },
      {
        position: 2,
        team: {
          name: "ريال مدريد",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg"
        },
        points: 21,
        playedGames: 9,
        goalsFor: 19,
        goalsAgainst: 6
      },
      {
        position: 3,
        team: {
          name: "أتلتيكو مدريد",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg"
        },
        points: 17,
        playedGames: 9,
        goalsFor: 13,
        goalsAgainst: 5
      },
      {
        position: 4,
        team: {
          name: "جيرونا",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/9/90/Girona_FC_Logo.svg"
        },
        points: 12,
        playedGames: 9,
        goalsFor: 11,
        goalsAgainst: 12
      }
    ],

    SA: [
      {
        position: 1,
        team: {
          name: "نابولي",
          crest:
            "https://upload.wikimedia.org/wikipedia/commons/2/28/S.S.C._Napoli_logo.svg"
        },
        points: 16,
        playedGames: 7,
        goalsFor: 14,
        goalsAgainst: 5
      },
      {
        position: 2,
        team: {
          name: "إنتر ميلان",
          crest:
            "https://upload.wikimedia.org/wikipedia/commons/0/05/FC_Internazionale_Milano_2021.svg"
        },
        points: 14,
        playedGames: 7,
        goalsFor: 16,
        goalsAgainst: 9
      },
      {
        position: 3,
        team: {
          name: "يوفنتوس",
          crest:
            "https://upload.wikimedia.org/wikipedia/commons/b/bc/Juventus_FC_2017_icon_%28black%29.svg"
        },
        points: 13,
        playedGames: 7,
        goalsFor: 10,
        goalsAgainst: 1
      }
    ],

    BL1: [
      {
        position: 1,
        team: {
          name: "بايرن ميونخ",
          crest:
            "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg"
        },
        points: 14,
        playedGames: 6,
        goalsFor: 20,
        goalsAgainst: 7
      },
      {
        position: 2,
        team: {
          name: "أربيل لايبزيج",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/0/04/RB_Leipzig_2014_logo.svg"
        },
        points: 14,
        playedGames: 6,
        goalsFor: 9,
        goalsAgainst: 2
      },
      {
        position: 3,
        team: {
          name: "باير ليفركوزن",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/5/59/Bayer_04_Leverkusen_logo.svg"
        },
        points: 11,
        playedGames: 6,
        goalsFor: 16,
        goalsAgainst: 12
      }
    ],

    CL: [
      {
        position: 1,
        team: {
          name: "برشلونة",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona.svg"
        },
        points: 6,
        playedGames: 2,
        goalsFor: 7,
        goalsAgainst: 2
      },
      {
        position: 2,
        team: {
          name: "ريال مدريد",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg"
        },
        points: 3,
        playedGames: 2,
        goalsFor: 3,
        goalsAgainst: 2
      },
      {
        position: 3,
        team: {
          name: "مانشستر سيتي",
          crest:
            "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg"
        },
        points: 4,
        playedGames: 2,
        goalsFor: 4,
        goalsAgainst: 0
      }
    ]
  };

  const EDITORIAL_ARTICLES = [
    {
      id: "art-1",
      title: "التحولات الهجومية وبناء اللعب من الخلف في الكرة الحديثة",
      summary:
        "دراسة تحليلات التمرير والضغط العالي وتحركات خط الوسط في كرة القدم الأوروبية.",
      category: "تحليل تكتيكي ♟️",
      url: "./articles/tactics-modern-football.html",
      image:
        "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "art-2",
      title: "التوازن المالي وقواعد اللعب المالي النظيف في صفقات اللاعبين",
      summary:
        "قراءة في اقتصاديات كرة القدم وقواعد اللعب المالي النظيف والتحولات المالية بالميركاتو.",
      category: "اقتصاد الرياضة 💰",
      url: "./articles/mercato-economics.html",
      image:
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80"
    }
  ];

  /* =========================================================
     DATE HELPERS
     ========================================================= */

  function getLocalDateString(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      date = new Date();
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function getStrictDateStrings() {
    const now = new Date();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    return {
      todayStr: getLocalDateString(now),
      yesterdayStr: getLocalDateString(yesterday),
      tomorrowStr: getLocalDateString(tomorrow)
    };
  }

  function formatFormattedDateString(offsetDays = 0) {
    const date = new Date();
    date.setDate(date.getDate() + offsetDays);

    try {
      return new Intl.DateTimeFormat("ar-MA", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
      }).format(date);
    } catch (error) {
      return date.toLocaleDateString("ar");
    }
  }

  function getMatchLocalDate(utcDate) {
    if (!utcDate) {
      return null;
    }

    const date = new Date(utcDate);

    if (isNaN(date.getTime())) {
      return null;
    }

    return getLocalDateString(date);
  }

  function getMatchLocalTime(utcDate) {
    if (!utcDate) {
      return "--:--";
    }

    const date = new Date(utcDate);

    if (isNaN(date.getTime())) {
      return "--:--";
    }

    try {
      return new Intl.DateTimeFormat("ar-MA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }).format(date);
    } catch (error) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    }
  }

  /* =========================================================
     LIVE RSS TICKER WITH MULTI-SOURCE & AUTO-REFRESH
     ========================================================= */

  let lastFetchedTickerHTML = null;

  async function fetchNewsTicker() {
    const ticker =
      document.getElementById("newsTicker") ||
      document.querySelector(".ticker-content");

    if (!ticker) {
      return;
    }

    const fallbackText =
      "⚽ تغطية مستمرة لأحدث الأخبار والنتائج والمباريات الرياضية عبر SPORT ZONE";

  const rssEndpoints = [
    // beIN Sports (تغطية عالمية وعربية)
    "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://www.beinsports.com/ar-mena/rss"),
    // المغرب (Le360 Sport / هسبريس رياضة)
    "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://ar.le360.ma/rss/sports.xml"),
    // السعودية (صحيفة الرياضية السعودية)
    "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://arriyadiyah.com/rss"),
    // الجزائر (أخبار الرياضة الجزائرية - الشروق رياضة)
    "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://www.echoroukonline.com/sport/feed"),
    // تونس (أخبار الرياضة التونسية - موزاييك إف إم رياضة)
    "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://www.mosaiquefm.net/ar/rss/sport")
  ];

    let items = [];

    for (const apiUrl of rssEndpoints) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(apiUrl, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.items) && data.items.length > 0) {
            items = data.items.filter(item => item && item.title).slice(0, 12);
            if (items.length > 0) break;
          }
        }
      } catch (e) {}
    }

    if (items.length > 0) {
      lastFetchedTickerHTML = items
        .map(item => {
          const title = escapeHTML(String(item.title));
          const link = safeURL(item.link);

          return `
            <a
              href="${link}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-block mx-5 text-xs font-bold text-gray-200 hover:text-emerald-400 transition-colors whitespace-nowrap"
            >
              ⚽ ${title}
            </a>
          `;
        })
        .join("");

      ticker.innerHTML = lastFetchedTickerHTML;
      startTickerAnimation(ticker);
    } else {
      if (!lastFetchedTickerHTML) {
        lastFetchedTickerHTML = `
          <span class="text-xs text-slate-300 font-bold whitespace-nowrap">
            ${fallbackText}
          </span>
        `;
      }
      ticker.innerHTML = lastFetchedTickerHTML;
      startTickerAnimation(ticker);
    }
  }

  function startTickerAnimation(ticker) {
    if (!ticker) {
      return;
    }

    const parent = ticker.parentElement;

    if (!parent) {
      return;
    }

    ticker.style.display = "inline-block";
    ticker.style.whiteSpace = "nowrap";
    ticker.style.animation = "szTickerMove 45s linear infinite";

    if (!document.getElementById("sz-ticker-style")) {
      const style = document.createElement("style");

      style.id = "sz-ticker-style";

      style.textContent = `
        @keyframes szTickerMove {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(-100%);
          }
        }

        .date-tab-btn {
          padding: .7rem 1rem;
          border-radius: .8rem;
          color: #cbd5e1;
          font-size: .75rem;
          font-weight: 900;
          transition: all .2s ease;
          border: 1px solid transparent;
        }

        .date-tab-btn:hover {
          background: rgba(16,185,129,.08);
          color: #34d399;
        }

        .date-tab-btn.active {
          background: #10b981;
          color: #020617;
          border-color: #34d399;
          box-shadow: 0 5px 20px rgba(16,185,129,.15);
        }

        .match-row-item {
          background: #161e2e;
          border: 1px solid rgba(55,65,81,.7);
          border-radius: 1rem;
          padding: 1rem;
          transition: all .2s ease;
        }

        .match-row-item:hover {
          border-color: rgba(16,185,129,.4);
          transform: translateY(-1px);
        }
      `;

      document.head.appendChild(style);
    }
  }

  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function safeURL(url) {
    if (!url || typeof url !== "string") return "#";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return escapeHTML(url);
    }
    return "#";
  }

  /* =========================================================
     NATIVE SPORTS API SERVICE
     ========================================================= */

  class NativeSportsApiService {
    static async fetchMatches(leagueCode = "PL") {
      const endpoints = [
        `/api/sports?type=matches&league=${encodeURIComponent(leagueCode)}`,
        `https://corsproxy.io/?${encodeURIComponent(
          `https://api.football-data.org/v4/competitions/${leagueCode}/matches`
        )}`
      ];

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "X-Auth-Token": "eba4f3dbffff48ff8dd42b3a8f11793b"
            },
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) continue;

          const data = await response.json();

          if (!data || !Array.isArray(data.matches)) continue;

          return data.matches.map(m => {
            const utcDate = m.utcDate;
            const matchDate = getMatchLocalDate(utcDate);
            const matchTime = getMatchLocalTime(utcDate);

            const isLive = m.status === "IN_PLAY" || m.status === "PAUSED";
            const isFinished = m.status === "FINISHED";
            const homeScore = m.score?.fullTime?.home ?? 0;
            const awayScore = m.score?.fullTime?.away ?? 0;

            const homeCrest =
              m.homeTeam?.crest ||
              m.homeTeam?.logo ||
              FALLBACK_CREST;

            const awayCrest =
              m.awayTeam?.crest ||
              m.awayTeam?.logo ||
              FALLBACK_CREST;

            return {
              id: m.id,
              matchDate: matchDate,
              matchTime: matchTime,
              utcDate: utcDate,
              leagueCode: leagueCode,
              leagueName:
                m.competition?.name ||
                COMPETITIONS[leagueCode]?.name ||
                "الدوري الممتاز",
              team1: {
                name: m.homeTeam?.shortName || m.homeTeam?.name || "الفريق الأول",
                crest: homeCrest
              },
              team2: {
                name: m.awayTeam?.shortName || m.awayTeam?.name || "الفريق الثاني",
                crest: awayCrest
              },
              scoreDisplay:
                isLive || isFinished
                  ? `${homeScore} - ${awayScore}`
                  : "- : -",
              statusText: isLive
                ? "مباشر ⚡"
                : isFinished
                ? "انتهت 🏁"
                : "لم تبدأ",
              isLive: isLive,
              isFinished: isFinished
            };
          });
        } catch (error) {}
      }

      return [];
    }

    static async fetchStandings(leagueCode = "PL") {
      const endpoints = [
        `/api/sports?type=standings&league=${encodeURIComponent(leagueCode)}`,
        `https://corsproxy.io/?${encodeURIComponent(
          `https://api.football-data.org/v4/competitions/${leagueCode}/standings`
        )}`
      ];

      for (const endpoint of endpoints) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 4000);

          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "X-Auth-Token": "eba4f3dbffff48ff8dd42b3a8f11793b"
            },
            signal: controller.signal
          });

          clearTimeout(timeoutId);

          if (!response.ok) continue;

          const data = await response.json();

          if (!data || !Array.isArray(data.standings)) continue;

          const table = data.standings[0]?.table;

          if (!Array.isArray(table) || table.length === 0) continue;

          return table.map(row => ({
            position: row.position,
            team: {
              name: row.team?.shortName || row.team?.name || "فريق",
              crest: row.team?.crest || row.team?.logo || FALLBACK_CREST
            },
            points: row.points ?? 0,
            playedGames: row.playedGames ?? 0,
            goalsFor: row.goalsFor ?? 0,
            goalsAgainst: row.goalsAgainst ?? 0
          }));
        } catch (error) {}
      }

      return NATIVE_STANDINGS_MAP[leagueCode] || NATIVE_STANDINGS_MAP["PL"];
    }
  }

  /* =========================================================
     UI COMPONENTS
     ========================================================= */

  function Header() {
    return `
      <header class="sticky top-0 z-50 glass-panel border-b border-gray-800/80 bg-[#0c101a]/95">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16 sm:h-20">
            <a href="./index.html" class="flex items-center gap-3 cursor-pointer">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <div class="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 text-xl sm:text-2xl">SZ</div>
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <h1 class="text-xl sm:text-2xl font-black tracking-wider text-white font-sans">SPORT <span class="text-emerald-500">ZONE</span></h1>
                  <span class="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/30">${OFFICIAL_DOMAIN}</span>
                </div>
                <p class="text-[11px] text-gray-400 font-medium">المنصة الرياضية الأولى • ${OFFICIAL_DOMAIN}</p>
              </div>
            </a>

            <div class="hidden md:flex items-center gap-4">
              <button id="btn-manual-refresh" class="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black hover:bg-emerald-500/20 transition-all">
                <span class="animate-spin">🔄</span>
                <span>تحديث البيانات المباشرة</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    `;
  }

  function HeroBanner() {
    return `
      <section class="relative my-6 rounded-3xl overflow-hidden bg-gradient-to-r from-[#0b0f19] via-[#101726] to-[#0f172a] border border-gray-800 shadow-2xl p-6 sm:p-10">
        <div class="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center mix-blend-overlay pointer-events-none"></div>

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div class="lg:col-span-6 space-y-4 text-right">
            <h1 class="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              كل ما يخص الرياضة <br/>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">على مدار الساعة</span>
            </h1>
            <p class="text-xs sm:text-sm text-gray-300 max-w-md font-medium leading-relaxed">
              أحدث الأخبار، النتائج الحية، الجداول، الإحصائيات ومقاطع الفيديو مباشرة عبر ${OFFICIAL_DOMAIN}
            </p>
            <div>
              <a href="#match-center-section" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-sm shadow-lg shadow-emerald-500/25 transition-all">
                <span>استكشف الآن</span>
                <span>›</span>
              </a>
            </div>
          </div>

          <div class="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="bg-gray-950/80 rounded-2xl p-3 border border-gray-800/80 space-y-2">
              <span class="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded">📊 تحليل المباريات</span>
              <img src="https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=400&q=80" alt="تحليل" class="w-full h-20 object-cover rounded-xl" onerror="this.onerror=null; this.src='${FALLBACK_CREST}';" />
              <p class="text-[11px] font-extrabold text-white leading-tight">تحليل تكتيكي شامل للمباريات الكبرى</p>
            </div>

            <div class="bg-gray-950/80 rounded-2xl p-3 border border-gray-800/80 space-y-2">
              <span class="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded">▶️ أهداف اليوم</span>
              <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=400&q=80" alt="أهداف" class="w-full h-20 object-cover rounded-xl" onerror="this.onerror=null; this.src='${FALLBACK_CREST}';" />
              <p class="text-[11px] font-extrabold text-white leading-tight">أجمل أهداف الجولة شاهد الآن</p>
            </div>

            <div class="bg-gray-950/80 rounded-2xl p-3 border border-gray-800/80 space-y-2">
              <span class="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded">📰 أخبار مميزة</span>
              <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=400&q=80" alt="أخبار" class="w-full h-20 object-cover rounded-xl" onerror="this.onerror=null; this.src='${FALLBACK_CREST}';" />
              <p class="text-[11px] font-extrabold text-white leading-tight">متابعة صفقات الميركاتو ومستجدات البطولات</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function MatchCenter({ matches = [], activeCompCode = 'PL', activeDateFilter = 'today', isLoading = false }) {
    const offset = activeDateFilter === 'yesterday' ? -1 : activeDateFilter === 'tomorrow' ? 1 : 0;
    const currentDateFormatted = formatFormattedDateString(offset);

    return `
      <section id="match-center-section" class="bg-[#121824] rounded-3xl p-5 sm:p-7 border border-gray-800/80 shadow-2xl space-y-5">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div class="flex items-center gap-2">
            <h2 class="text-xl font-black text-white flex items-center gap-2">
              <span>📅 مركز المباريات الحية</span>
            </h2>
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            ${Object.keys(COMPETITIONS).map(code => `
              <button 
                data-comp-btn="${code}" 
                class="px-3.5 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${activeCompCode === code ? 'bg-emerald-500 text-gray-950 border-emerald-400 shadow-md' : 'bg-[#182030] text-gray-300 border-gray-800 hover:bg-gray-800'}"
              >
                <span>${COMPETITIONS[code].name}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div class="flex items-center justify-center gap-2 sm:gap-3 p-1.5 bg-[#161e2e] rounded-2xl border border-gray-800">
          <button data-date-tab="yesterday" class="date-tab-btn flex-1 text-center ${activeDateFilter === 'yesterday' ? 'active' : ''}">
            ⬅ مباريات الأمس
          </button>
          <button data-date-tab="today" class="date-tab-btn flex-1 text-center ${activeDateFilter === 'today' ? 'active' : ''}">
            ⚽ مباريات اليوم
          </button>
          <button data-date-tab="tomorrow" class="date-tab-btn flex-1 text-center ${activeDateFilter === 'tomorrow' ? 'active' : ''}">
            ➡ مباريات الغد
          </button>
        </div>

        <div class="date-nav-bar flex items-center justify-between text-xs font-bold text-gray-300">
          <button id="btn-prev-date" class="w-8 h-8 rounded-lg bg-[#182030] hover:bg-emerald-500 hover:text-black flex items-center justify-center border border-gray-800 transition-colors">
            ‹
          </button>
          
          <div class="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#182030] border border-gray-800 text-white font-extrabold">
            <span>📅</span>
            <span>${currentDateFormatted}</span>
          </div>

          <button id="btn-next-date" class="w-8 h-8 rounded-lg bg-[#182030] hover:bg-emerald-500 hover:text-black flex items-center justify-center border border-gray-800 transition-colors">
            ›
          </button>
        </div>

        ${isLoading ? `
          <div class="text-center py-12 bg-[#161e2e] rounded-2xl border border-gray-800 text-gray-400 text-sm space-y-3">
            <span class="animate-spin text-3xl block text-emerald-400">🔄</span>
            <p class="font-bold">جاري استعلام المباريات الحية...</p>
          </div>
        ` : (matches.length === 0 ? `
          <div class="text-center py-12 bg-[#161e2e] rounded-2xl border border-gray-800/80 p-8 space-y-4">
            <span class="text-4xl block">⚽</span>
            <p class="text-gray-200 font-extrabold text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              لا توجد مباريات مجدولة لهذا الدوري في هذا التاريخ
            </p>
          </div>
        ` : `
          <div class="space-y-3">
            ${matches.map(m => {
              const crest1 = m.team1.crest || FALLBACK_CREST;
              const crest2 = m.team2.crest || FALLBACK_CREST;

              return `
                <div data-match-card-id="${m.id}" class="match-row-item flex flex-col sm:flex-row items-center justify-between gap-4 cursor-pointer group">
                  
                  <div class="flex items-center gap-2.5 sm:w-1/4">
                    <img src="${crest1}" alt="${m.leagueName}" class="w-6 h-6 object-contain" onerror="this.onerror=null; this.src='${FALLBACK_CREST}';" />
                    <span class="text-xs font-black text-gray-300 truncate">${m.leagueName || 'الدوري الممتاز'}</span>
                  </div>

                  <div class="flex-1 flex items-center justify-between sm:justify-center gap-4 w-full">
                    <div class="flex items-center gap-2.5 sm:w-2/5 justify-end text-left">
                      <span class="text-xs font-black text-white text-right truncate">${m.team1.name}</span>
                      <img src="${crest1}" alt="${m.team1.name}" class="w-7 h-7 object-contain" onerror="this.onerror=null; this.src='${FALLBACK_CREST}';" />
                    </div>

                    <div class="px-4 py-1.5 rounded-xl bg-[#0f1522] border border-gray-800 ${m.isLive ? 'text-red-400 border-red-500/40 animate-pulse' : 'text-emerald-400'} font-black text-xs text-center min-w-[85px] shadow-inner">
                      ${activeDateFilter === 'tomorrow' ? m.matchTime : (m.isLive || m.isFinished ? m.scoreDisplay : m.matchTime)}
                    </div>

                    <div class="flex items-center gap-2.5 sm:w-2/5 justify-start text-right">
                      <img src="${crest2}" alt="${m.team2.name}" class="w-7 h-7 object-contain" onerror="this.onerror=null; this.src='${FALLBACK_CREST}';" />
                      <span class="text-xs font-black text-white truncate">${m.team2.name}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 sm:w-1/5 justify-end">
                    <span class="px-3 py-1 rounded-lg text-[11px] font-black ${m.isLive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}">
                      ${activeDateFilter === 'yesterday' ? 'انتهت 🏁' : activeDateFilter === 'tomorrow' ? 'لم تبدأ' : m.statusText}
                    </span>
                  </div>

                </div>
              `;
            }).join('')}
          </div>
        `)}

      </section>
    `;
  }

  function SidebarWidgets({ standings = [], activeCompCode = 'PL', isLoading = false, userVote = null }) {
    const currentLeagueObj = COMPETITIONS[activeCompCode] || COMPETITIONS['PL'];

    return `
      <aside class="space-y-6">
        
        <div class="bg-[#121824] rounded-3xl p-6 border border-gray-800/80 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 class="text-base font-black text-white flex items-center gap-2">
              <span class="text-emerald-500">|</span>
              <span>الدوريات الرئيسية</span>
            </h3>
          </div>

          <div class="space-y-2">
            ${SIDEBAR_LEAGUES.map(l => `
              <div data-comp-btn="${l.code}" class="p-3 rounded-2xl bg-[#161e2e] border border-gray-800/80 flex items-center justify-between hover:border-emerald-500/40 cursor-pointer transition-all ${activeCompCode === l.code ? 'border-emerald-500/60 bg-emerald-500/10' : ''}">
                <div class="flex items-center gap-3">
                  <span class="text-base">${l.flag}</span>
                  <span class="text-xs font-black text-white">${l.name}</span>
                </div>
                <span class="text-gray-400 text-xs">‹</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="bg-[#121824] rounded-3xl p-6 border border-gray-800/80 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 class="text-base font-black text-white flex items-center gap-2">
              <span class="text-emerald-500">|</span>
              <span>ترتيب الفرق (الموسم الحالي)</span>
            </h3>
            <span class="text-[11px] text-emerald-400 font-extrabold">${currentLeagueObj.name}</span>
          </div>

          <div class="space-y-2 pt-1">
            ${isLoading ? `
              <div class="text-center py-6 text-gray-400 text-xs font-bold">جاري تحميل جدول الترتيب...</div>
            ` : (standings.length === 0 ? `
              <div class="text-center py-6 text-gray-400 text-xs font-bold">لا تتوفر بيانات ترتيب حالياً</div>
            ` : `
              ${standings.map(s => {
                const teamLogo = s.team?.crest || FALLBACK_CREST;
                return `
                  <div class="p-3 rounded-2xl bg-[#161e2e] border border-gray-800/80 flex items-center justify-between hover:border-emerald-500/30 transition-colors">
                    <div class="flex items-center gap-3">
                      <span class="w-6 text-center font-black text-xs text-gray-400">${s.position}</span>
                      <img src="${teamLogo}" alt="${s.team?.name}" class="w-6 h-6 object-contain" onerror="this.onerror=null; this.src='${FALLBACK_CREST}';" />
                      <span class="text-xs font-extrabold text-white truncate max-w-[110px]">${s.team?.name}</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="text-[10px] text-gray-400">${s.playedGames}م</span>
                      <span class="text-xs font-black text-emerald-400">${s.points}ن</span>
                    </div>
                  </div>
                `;
              }).join('')}
            `)}
          </div>
        </div>

        <div class="bg-[#121824] rounded-3xl p-6 border border-gray-800/80 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 class="text-base font-black text-white flex items-center gap-2">
              <span class="text-emerald-500">|</span>
              <span>استطلاع الجماهير</span>
            </h3>
            <span class="px-2 py-0.5 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 rounded">تصويت تصاعدي 📊</span>
          </div>

          <p class="text-xs font-extrabold text-white leading-relaxed">
            من تتوقع أن ينتزع لقب دوري أبطال أوروبا هذا الموسم؟
          </p>

          <div class="space-y-2.5">
            <button data-poll-option="real" class="w-full p-3 rounded-2xl bg-[#161e2e] border border-gray-800 hover:border-emerald-500/40 text-right flex items-center justify-between transition-all ${userVote === 'real' ? 'border-emerald-500 bg-emerald-500/10' : ''}">
              <span class="text-xs font-bold text-white">ريال مدريد 👑</span>
              <span class="text-xs font-black text-emerald-400">45%</span>
            </button>
            
            <button data-poll-option="mancity" class="w-full p-3 rounded-2xl bg-[#161e2e] border border-gray-800 hover:border-emerald-500/40 text-right flex items-center justify-between transition-all ${userVote === 'mancity' ? 'border-emerald-500 bg-emerald-500/10' : ''}">
              <span class="text-xs font-bold text-white">مانشستر سيتي 🩵</span>
              <span class="text-xs font-black text-emerald-400">35%</span>
            </button>

            <button data-poll-option="barca" class="w-full p-3 rounded-2xl bg-[#161e2e] border border-gray-800 hover:border-emerald-500/40 text-right flex items-center justify-between transition-all ${userVote === 'barca' ? 'border-emerald-500 bg-emerald-500/10' : ''}">
              <span class="text-xs font-bold text-white">برشلونة 🔵🔴</span>
              <span class="text-xs font-black text-emerald-400">20%</span>
            </button>
          </div>

          ${userVote ? `
            <p class="text-[11px] text-center text-emerald-400 font-bold">تم تسجيل صوتك بنجاح! شكراً لمشاركتك.</p>
          ` : ''}
        </div>

      </aside>
    `;
  }

  function BottomGridSection({ newsList = [] }) {
    return `
      <section class="my-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div class="bg-[#121824] rounded-3xl p-6 border border-gray-800/80 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 class="text-base font-black text-white flex items-center gap-2">
              <span class="text-emerald-500">|</span>
              <span>فيديوهات مميزة</span>
            </h3>
            <a href="#" class="text-xs text-emerald-400 font-bold hover:underline">عرض الكل ›</a>
          </div>

          <div class="relative rounded-2xl overflow-hidden border border-gray-800 group">
            <img src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80" alt="فيديو" class="w-full h-48 object-cover group-hover:scale-105 transition-transform" onerror="this.onerror=null; this.src='${FALLBACK_CREST}';" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center">
              <span class="w-12 h-12 rounded-full bg-emerald-500/90 text-gray-950 flex items-center justify-center text-xl font-black shadow-lg">▶</span>
            </div>
            <div class="absolute bottom-3 right-3 left-3 text-right">
              <span class="px-2 py-0.5 text-[10px] font-bold bg-emerald-500 text-gray-950 rounded">05:20</span>
              <h4 class="text-xs font-extrabold text-white mt-1">ملخص وأهداف الجولة الحاسمة في البطولات الأوروبية</h4>
            </div>
          </div>
        </div>

        <div class="bg-[#121824] rounded-3xl p-6 border border-gray-800/80 shadow-2xl space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-gray-800">
            <h3 class="text-base font-black text-white flex items-center gap-2">
              <span class="text-emerald-500">|</span>
              <span>آخر الأخبار</span>
            </h3>
            <a href="#" class="text-xs text-emerald-400 font-bold hover:underline">عرض الكل ›</a>
          </div>

          <div class="space-y-3">
            ${EDITORIAL_ARTICLES.map(a => `
              <article class="p-3.5 rounded-2xl bg-[#161e2e] border border-gray-800/80 flex items-center gap-4 hover:border-emerald-500/40 transition-colors">
                <img src="${a.image}" alt="${a.title}" class="w-16 h-16 object-cover rounded-xl shrink-0" onerror="this.onerror=null; this.src='${FALLBACK_CREST}';" />
                <div class="space-y-1">
                  <span class="text-[10px] font-bold text-emerald-400">${a.category}</span>
                  <h4 class="text-xs font-extrabold text-white leading-snug">
                    <a href="${a.url}" class="hover:text-emerald-400 transition-colors">${a.title}</a>
                  </h4>
                </div>
              </article>
            `).join('')}
          </div>
        </div>
      </section>
    `;
  }

  function Footer() {
    return `
      <footer class="bg-[#0c101a] border-t border-gray-800/80 text-gray-400 text-xs mt-16 py-10">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-gray-800/80">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5">
                <div class="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center font-black text-emerald-400">SZ</div>
              </div>
              <div>
                <span class="text-lg font-black text-white">SPORT ZONE</span>
                <p class="text-[11px] text-gray-400 font-medium">المنصة الرياضية الإخبارية الأولى • ${OFFICIAL_DOMAIN}</p>
              </div>
            </div>

            <div class="flex items-center gap-4 sm:gap-6 text-sm font-bold">
              <a href="./privacy.html" class="hover:text-emerald-400 transition-colors">سياسة الخصوصية</a>
              <span class="text-gray-700">|</span>
              <a href="./terms.html" class="hover:text-emerald-400 transition-colors">الشروط والأحكام</a>
              <span class="text-gray-700">|</span>
              <a href="./about.html" class="hover:text-emerald-400 transition-colors">من نحن</a>
              <span class="text-gray-700">|</span>
              <a href="./contact.html" class="hover:text-emerald-400 transition-colors">اتصل بنا</a>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-3">
            <p>© 2026 <strong>SPORT ZONE</strong> (<span class="text-emerald-400">${OFFICIAL_DOMAIN}</span>). جميع الحقوق محفوظة.</p>
            <p class="text-gray-400">امتثال كامل لمعايير Google AdSense و GDPR و CCPA • البريد الرسمي: ${CONTACT_EMAIL}</p>
          </div>
        </div>
      </footer>
    `;
  }

  /* =========================================================
     APPLICATION CONTROLLER WITH LIVE TICKER AUTO-REFRESH
     ========================================================= */

  class AppController {
    constructor() {
      this.state = {
        activeCompCode: "PL",
        selectedDateFilter: "today",
        isLoadingMatches: true,
        isLoadingStandings: true,
        userVote: localStorage.getItem(POLL_STORAGE_KEY)
      };

      this.dataCache = {
        matches: [],
        standings: []
      };

      this.tickerTimer = null;
      this.init();
    }

    async init() {
      this.render();

      await this.loadData();

      fetchNewsTicker();

      // AUTO REFRESH TICKER EVERY 60 SECONDS
      if (!this.tickerTimer) {
        this.tickerTimer = setInterval(() => {
          fetchNewsTicker();
        }, 60000);
      }
    }

    async loadData() {
      this.state.isLoadingMatches = true;
      this.state.isLoadingStandings = true;

      this.render();

      const league = this.state.activeCompCode;

      try {
        const results = await Promise.allSettled([
          NativeSportsApiService.fetchMatches(league),
          NativeSportsApiService.fetchStandings(league)
        ]);

        if (results[0]?.status === "fulfilled") {
          this.dataCache.matches = Array.isArray(results[0].value)
            ? results[0].value
            : [];
        } else {
          this.dataCache.matches = [];
        }

        if (results[1]?.status === "fulfilled") {
          this.dataCache.standings = Array.isArray(results[1].value)
            ? results[1].value
            : [];
        } else {
          this.dataCache.standings = NATIVE_STANDINGS_MAP[league] || [];
        }
      } catch (error) {
        this.dataCache.matches = [];
        this.dataCache.standings = NATIVE_STANDINGS_MAP[league] || [];
      }

      this.state.isLoadingMatches = false;
      this.state.isLoadingStandings = false;

      this.render();
    }

    filterMatchesByDate(dateFilter) {
      const { todayStr, yesterdayStr, tomorrowStr } = getStrictDateStrings();

      const matches = Array.isArray(this.dataCache.matches)
        ? this.dataCache.matches
        : [];

      if (dateFilter === "yesterday") {
        return matches.filter(match => {
          return match.matchDate === yesterdayStr || match.isFinished === true;
        });
      }

      if (dateFilter === "tomorrow") {
        return matches.filter(match => {
          return (
            match.matchDate === tomorrowStr &&
            match.isFinished !== true &&
            match.isLive !== true
          );
        });
      }

      return matches.filter(match => {
        return (
          match.matchDate === todayStr ||
          (!match.matchDate && match.dayCategory === "today") ||
          match.isLive === true
        );
      });
    }

    async switchLeague(code) {
      if (!code || !COMPETITIONS[code]) return;
      if (this.state.activeCompCode === code) return;

      this.state.activeCompCode = code;
      this.dataCache.matches = [];
      this.dataCache.standings = [];

      await this.loadData();
    }

    switchDateTab(dateFilter) {
      const allowed = ["yesterday", "today", "tomorrow"];
      if (!allowed.includes(dateFilter)) return;

      this.state.selectedDateFilter = dateFilter;
      this.render();
    }

    handlePollVote(option) {
      if (!option) return;

      this.state.userVote = option;

      try {
        localStorage.setItem(POLL_STORAGE_KEY, option);
      } catch (error) {}

      this.render();
    }

    render() {
      const root = document.getElementById("app-root");

      if (!root) {
        return;
      }

      const filteredMatches = this.filterMatchesByDate(
        this.state.selectedDateFilter
      );

      root.innerHTML = `
        <div class="min-h-screen flex flex-col bg-[#0b0f19] text-white">
          <div class="flex-1">
            ${Header()}

            <div class="bg-[#121824] border-b border-gray-800 py-2 overflow-hidden">
              <div class="max-w-7xl mx-auto px-4 flex items-center gap-3">
                <span class="px-2.5 py-1 bg-emerald-500 text-gray-950 text-[10px] font-black rounded-lg shrink-0">
                  عاجل ⚡
                </span>

                <div class="ticker-wrap flex-1 overflow-hidden">
                  <div id="newsTicker" class="ticker-content">
                    ${lastFetchedTickerHTML || '<span class="text-xs text-gray-400">جاري تحميل أحدث الأخبار الرياضية...</span>'}
                  </div>
                </div>
              </div>
            </div>

            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              ${HeroBanner()}

              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 my-8">
                <div class="lg:col-span-8">
                  ${MatchCenter({
                    matches: filteredMatches,
                    activeCompCode: this.state.activeCompCode,
                    activeDateFilter: this.state.selectedDateFilter,
                    isLoading: this.state.isLoadingMatches
                  })}
                </div>

                <div class="lg:col-span-4">
                  ${SidebarWidgets({
                    standings: this.dataCache.standings,
                    activeCompCode: this.state.activeCompCode,
                    isLoading: this.state.isLoadingStandings,
                    userVote: this.state.userVote
                  })}
                </div>
              </div>

              ${BottomGridSection({ newsList: [] })}
            </main>
          </div>

          ${Footer()}
        </div>
      `;

      // RESTORE TICKER ANIMATION
      const tickerEl = document.getElementById("newsTicker");
      if (tickerEl && lastFetchedTickerHTML) {
        startTickerAnimation(tickerEl);
      }

      this.bindEvents();
    }

    bindEvents() {
      const manualBtn = document.getElementById("btn-manual-refresh");

      if (manualBtn) {
        manualBtn.onclick = () => {
          this.loadData();
          fetchNewsTicker();
        };
      }

      document
        .querySelectorAll("[data-comp-btn]")
        .forEach(button => {
          if (!button) return;

          button.onclick = event => {
            const code = event.currentTarget?.getAttribute("data-comp-btn");
            if (code) this.switchLeague(code);
          };
        });

      document
        .querySelectorAll("[data-date-tab]")
        .forEach(button => {
          if (!button) return;

          button.onclick = event => {
            const tab = event.currentTarget?.getAttribute("data-date-tab");
            if (tab) this.switchDateTab(tab);
          };
        });

      document
        .querySelectorAll("[data-poll-option]")
        .forEach(button => {
          if (!button) return;

          button.onclick = event => {
            const option = event.currentTarget?.getAttribute("data-poll-option");
            if (option) this.handlePollVote(option);
          };
        });
    }
  }

  /* =========================================================
     START APPLICATION
     ========================================================= */

  function startApp() {
    try {
      new AppController();
    } catch (error) {
      console.error("SPORT ZONE failed to start:", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp, { once: true });
  } else {
    startApp();
  }
})();
