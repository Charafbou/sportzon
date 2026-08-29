/* =========================================================
   SPORT ZONE - Dynamic Sports Application
   ========================================================= */

(() => {
  "use strict";

  const API_BASE = "/api/sports";
  const STORAGE_ARTICLES = "sz_sports_data_v5";
  const STORAGE_CACHE = "sz_live_cache_v1";

  // Morocco GMT+1
  const MOROCCO_OFFSET_MINUTES = 60;

  const LEAGUES = {

    all: {
      name: "الرئيسية",
      code: "all",
      flag: "🏠"
    },

    botola: {
      name: "البطولة برو",
      code: "botola",
      flag: "🇲🇦"
    },

    PD: {
      name: "الدوري الإسباني",
      code: "PD",
      flag: "🇪🇸"
    },

    PL: {
      name: "الدوري الإنجليزي الممتاز",
      code: "PL",
      flag: "🏴"
    },

    SA: {
      name: "الدوري الإيطالي",
      code: "SA",
      flag: "🇮🇹"
    },

    BL1: {
      name: "الدوري الألماني",
      code: "BL1",
      flag: "🇩🇪"
    },

    FL1: {
      name: "الدوري الفرنسي",
      code: "FL1",
      flag: "🇫🇷"
    },

    CL: {
      name: "دوري أبطال أوروبا",
      code: "CL",
      flag: "🏆"
    }

  };


  /* =========================================================
     RSS SOURCES
     ========================================================= */

  const RSS_FEEDS = [

    "https://news.google.com/rss/search?q=كرة+القدم+رياضة&hl=ar&gl=MA&ceid=MA:ar",

    "https://news.google.com/rss/search?q=الدوري+الإنجليزي+OR+الدوري+الإسباني+OR+الدوري+الإيطالي&hl=ar&gl=MA&ceid=MA:ar",

    "https://news.google.com/rss/search?q=البطولة+المغربية+OR+الوداد+OR+الرجاء+OR+نهضة+بركان&hl=ar&gl=MA&ceid=MA:ar"

  ];


  /* =========================================================
     BOTOLA FALLBACK
     ========================================================= */

  const BOTOLA_FALLBACK = [

    ["المغرب الفاسي", 30, 16, 11, 3, 59],

    ["نهضة بركان", 30, 16, 9, 5, 57],

    ["الرجاء الرياضي", 30, 16, 8, 6, 56],

    ["الجيش الملكي", 30, 13, 16, 1, 55],

    ["الوداد الرياضي", 30, 13, 4, 13, 43],

    ["الدفاع الحسني الجديدي", 30, 9, 13, 8, 40],

    ["اتحاد طنجة", 30, 9, 12, 9, 39],

    ["الفتح الرياضي", 30, 9, 10, 11, 37],

    ["الكوكب المراكشي", 30, 8, 12, 10, 36],

    ["النادي المكناسي", 30, 9, 9, 12, 36],

    ["الرجاء بني ملال / RCA زمامرة", 30, 8, 9, 13, 33],

    ["حسنية أكادير", 30, 8, 9, 13, 33],

    ["اتحاد تواركة", 30, 6, 13, 11, 31],

    ["أولمبيك الدشيرة", 30, 7, 9, 14, 30],

    ["يوسفية برشيد / يعقوب المنصور", 30, 7, 9, 14, 30],

    ["أولمبيك آسفي", 30, 3, 13, 14, 22]

  ].map((x, i) => ({

    position: i + 1,

    team: {
      name: x[0]
    },

    played: x[1],

    won: x[2],

    draw: x[3],

    lost: x[4],

    points: x[5]

  }));


  /* =========================================================
     STATE
     ========================================================= */

  const state = {

    league: "all",

    date: "today",

    search: "",

    articles: [],

    matchesByLeague: {},

    standingsByLeague: {},

    loading: false,

    initialized: false

  };


  /* =========================================================
     HELPERS
     ========================================================= */

  const $ = (selector, root = document) =>
    root.querySelector(selector);

  const $$ = (selector, root = document) =>
    [...root.querySelectorAll(selector)];


  function escapeHTML(value = "") {

    return String(value).replace(
      /[&<>"']/g,
      char => ({

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

      }[char])
    );

  }


  function slugId(value) {

    return String(value || "")

      .toLowerCase()

      .normalize("NFKD")

      .replace(/[\u0300-\u036f]/g, "")

      .replace(/[^a-z0-9\u0600-\u06ff]+/g, "-")

      .replace(/^-+|-+$/g, "")

      .slice(0, 80)

      || Math.random().toString(36).slice(2, 10);

  }


  function moroccoDateKey(delta = 0) {

    const now = new Date(
      Date.now() +
      MOROCCO_OFFSET_MINUTES * 60000
    );

    now.setUTCDate(
      now.getUTCDate() + delta
    );

    return now.toISOString().slice(0, 10);

  }


  function formatMoroccoTime(value, withDate = false) {

    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    const fixed = new Date(
      date.getTime() +
      MOROCCO_OFFSET_MINUTES * 60000
    );

    const hh = String(
      fixed.getUTCHours()
    ).padStart(2, "0");

    const mm = String(
      fixed.getUTCMinutes()
    ).padStart(2, "0");


    if (!withDate) {

      return `${hh}:${mm} GMT+1`;

    }


    const dd = String(
      fixed.getUTCDate()
    ).padStart(2, "0");

    const mo = String(
      fixed.getUTCMonth() + 1
    ).padStart(2, "0");


    return `${dd}/${mo} ${hh}:${mm} GMT+1`;

  }


  function dateFromTab(tab) {

    if (tab === "yesterday") {
      return moroccoDateKey(-1);
    }

    if (tab === "tomorrow") {
      return moroccoDateKey(1);
    }

    return moroccoDateKey(0);

  }


  function statusArabic(status) {

    return ({

      FINISHED: "النهاية",

      IN_PLAY: "مباشر",

      PAUSED: "استراحة",

      SCHEDULED: "لم تبدأ",

      TIMED: "مجدولة",

      POSTPONED: "مؤجلة",

      SUSPENDED: "موقوفة",

      CANCELLED: "ملغاة"

    })[status] || status || "";

  }


  function imageOrFallback(url) {

    return url ||

      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1000&q=80";

  }


  /* =========================================================
     CACHE
     ========================================================= */

  function cacheSet(key, value) {

    try {

      const current = JSON.parse(
        localStorage.getItem(STORAGE_CACHE) || "{}"
      );

      current[key] = {
        savedAt: Date.now(),
        value
      };

      localStorage.setItem(
        STORAGE_CACHE,
        JSON.stringify(current)
      );

    } catch {}

  }


  function cacheGet(key) {

    try {

      const current = JSON.parse(
        localStorage.getItem(STORAGE_CACHE) || "{}"
      );

      return current[key]?.value || null;

    } catch {

      return null;

    }

  }


  /* =========================================================
     API
     ========================================================= */

  async function fetchJSON(url, options = {}) {

    const response = await fetch(
      url,
      {
        ...options,

        headers: {
          Accept: "application/json",
          ...(options.headers || {})
        }
      }
    );


    const text = await response.text();

    let data = null;


    try {

      data = text
        ? JSON.parse(text)
        : null;

    } catch {

      throw new Error(
        "استجابة غير صالحة من الخادم"
      );

    }


    if (!response.ok) {

      throw new Error(
        data?.error ||
        `HTTP ${response.status}`
      );

    }


    return data;

  }


  async function api(type, league, extra = "") {

    const url =
      `${API_BASE}` +
      `?type=${encodeURIComponent(type)}` +
      `&league=${encodeURIComponent(league)}` +
      extra;

    return fetchJSON(url);

  }


  /* =========================================================
     NORMALIZE MATCH
     ========================================================= */

  function normalizeMatch(match, leagueCode) {

    const score = match.score || {};

    const full = score.fullTime || {};


    return {

      id:
        match.id ||
        `${leagueCode}-${match.utcDate}-${match.homeTeam?.name}-${match.awayTeam?.name}`,

      league: leagueCode,

      leagueName:
        LEAGUES[leagueCode]?.name ||
        match.competition?.name ||
        leagueCode,

      utcDate: match.utcDate,

      status: match.status,

      minute: match.minute,

      home: {

        name:
          match.homeTeam?.shortName ||
          match.homeTeam?.name ||
          "الفريق المضيف",

        crest:
          match.homeTeam?.crest ||
          ""

      },

      away: {

        name:
          match.awayTeam?.shortName ||
          match.awayTeam?.name ||
          "الفريق الضيف",

        crest:
          match.awayTeam?.crest ||
          ""

      },

      homeScore:
        full.home ?? null,

      awayScore:
        full.away ?? null,

      venue:
        match.venue || ""

    };

  }


  /* =========================================================
     NORMALIZE STANDINGS
     ========================================================= */

  function normalizeStandingRow(row, index) {

    return {

      position:
        row.position ||
        index + 1,

      team: {

        name:
          row.team?.shortName ||
          row.team?.name ||
          "فريق",

        crest:
          row.team?.crest ||
          ""

      },

      played:
        row.playedGames ??
        row.played ??
        0,

      won:
        row.won ?? 0,

      draw:
        row.draw ?? 0,

      lost:
        row.lost ?? 0,

      points:
        row.points ?? 0,

      goalDifference:
        row.goalDifference ?? 0

    };

  }


  /* =========================================================
     LOAD LEAGUE
     ========================================================= */

  async function loadLeagueData(code) {

    if (code === "botola") {

      state.standingsByLeague.botola =
        BOTOLA_FALLBACK;

      state.matchesByLeague.botola = [];

      return;

    }


    const date =
      dateFromTab(state.date);


    const [
      matchesResult,
      standingsResult
    ] = await Promise.all([

      api(
        "matches",
        code,
        `&date=${date}`
      ),

      api(
        "standings",
        code
      )

    ]);


    const matches =
      (matchesResult.matches || [])
        .map(match =>
          normalizeMatch(
            match,
            code
          )
        );


    const table =
      standingsResult.standings
        ?.find(
          standing =>
            standing.type === "TOTAL"
        )
        ?.table

      ||

      standingsResult.standings
        ?. [0]
        ?.table

      ||

      [];


    state.matchesByLeague[code] =
      matches;


    state.standingsByLeague[code] =
      table.map(
        normalizeStandingRow
      );


    cacheSet(
      `matches:${code}:${date}`,
      matches
    );


    cacheSet(
      `standings:${code}`,
      state.standingsByLeague[code]
    );

  }


  /* =========================================================
     LOAD ALL LEAGUES
     ========================================================= */

  async function loadAllData() {

    const codes = [
      "PD",
      "PL",
      "SA",
      "BL1",
      "FL1",
      "CL"
    ];


    const results =
      await Promise.allSettled(
        codes.map(loadLeagueData)
      );


    results.forEach(
      (result, index) => {

        if (result.status === "rejected") {

          const code =
            codes[index];


          state.matchesByLeague[code] =
            cacheGet(
              `matches:${code}:${dateFromTab(state.date)}`
            ) || [];


          state.standingsByLeague[code] =
            cacheGet(
              `standings:${code}`
            ) || [];

        }

      }
    );


    state.standingsByLeague.botola =
      BOTOLA_FALLBACK;


    state.matchesByLeague.botola =
      [];

  }


  /* =========================================================
     ARTICLE NORMALIZER
     ========================================================= */

  function articleFromRaw(raw, index = 0) {

    if (!raw) {
      return null;
    }


    const title =
      raw.title ||
      raw.headline ||
      raw.name ||
      "";


    if (!title) {
      return null;
    }


    const content =
      raw.content ||
      raw.body ||
      raw.description ||
      raw.summary ||
      "";


    const summary =
      raw.summary ||
      raw.description ||
      content
        .replace(/<[^>]+>/g, " ")
        .slice(0, 260);


    const url =
      raw.url ||
      raw.link ||
      raw.articleUrl ||
      "";


    const id =
      String(
        raw.id ||
        `manual-${slugId(title)}-${index}`
      );


    return {

      id,

      title:
        String(title).trim(),

      summary:
        String(summary || "")
          .replace(/<[^>]+>/g, " ")
          .trim(),

      content:
        String(
          content ||
          summary ||
          ""
        )
        .replace(
          /<script[\s\S]*?<\/script>/gi,
          ""
        ),

      image:
        imageOrFallback(
          raw.image ||
          raw.imageUrl ||
          raw.thumbnail ||
          raw.cover
        ),

      url,

      source:
        raw.source ||
        raw.author ||
        "SPORT ZONE",

      publishedAt:
        raw.publishedAt ||
        raw.date ||
        raw.createdAt ||
        new Date().toISOString(),

      league:
        raw.league ||
        raw.category ||
        "all",

      manual:
        raw.manual !== false

    };

  }


  /* =========================================================
     READ ADMIN ARTICLES
     ========================================================= */

  function readManualArticles() {

    try {

      const raw =
        JSON.parse(
          localStorage.getItem(
            STORAGE_ARTICLES
          ) || "[]"
        );


      const arr =
        Array.isArray(raw)
          ? raw
          : (
            Array.isArray(raw?.articles)
              ? raw.articles
              : []
          );


      return arr
        .map(articleFromRaw)
        .filter(Boolean);

    } catch {

      return [];

    }


}
    /* =========================================================
     RSS
     ========================================================= */

  async function fetchRSSFeed(feedUrl) {

    const proxies = [

      `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`,

      `https://corsproxy.io/?${encodeURIComponent(feedUrl)}`

    ];


    for (const proxy of proxies) {

      try {

        const response =
          await fetch(proxy, {
            headers: {
              Accept:
                "application/rss+xml, application/xml, text/xml, */*"
            }
          });


        if (!response.ok) {
          continue;
        }


        const text =
          await response.text();


        if (!text || text.length < 50) {
          continue;
        }


        return text;

      } catch {

        // try next proxy

      }

    }


    return null;

  }


  function parseRSS(xmlText) {

    if (!xmlText) {
      return [];
    }


    try {

      const parser =
        new DOMParser();


      const xml =
        parser.parseFromString(
          xmlText,
          "text/xml"
        );


      const items =
        [...xml.querySelectorAll("item")];


      return items
        .map((item, index) => {

          const title =
            item.querySelector("title")
              ?.textContent
              ?.trim() || "";


          const link =
            item.querySelector("link")
              ?.textContent
              ?.trim() || "";


          const description =
            item.querySelector("description")
              ?.textContent
              ?.trim() || "";


          const pubDate =
            item.querySelector("pubDate")
              ?.textContent
              ?.trim() || "";


          const source =
            item.querySelector("source")
              ?.textContent
              ?.trim() ||
            "Google News";


          if (!title) {
            return null;
          }


          const cleanDescription =
            description
              .replace(
                /<!\[CDATA\[|\]\]>/g,
                ""
              )
              .replace(
                /<[^>]*>/g,
                " "
              )
              .replace(
                /\s+/g,
                " "
              )
              .trim();


          return {

            id:
              `rss-${slugId(title)}-${index}`,

            title,

            summary:
              cleanDescription.slice(
                0,
                280
              ),

            content:
              cleanDescription,

            image:
              imageOrFallback(),

            url: link,

            source,

            publishedAt:
              pubDate ||
              new Date().toISOString(),

            league:
              detectLeague(
                `${title} ${cleanDescription}`
              ),

            manual: false

          };

        })
        .filter(Boolean);

    } catch {

      return [];

    }

  }


  function detectLeague(text = "") {

    const value =
      text.toLowerCase();


    if (
      value.includes("البطولة") ||
      value.includes("الوداد") ||
      value.includes("الرجاء") ||
      value.includes("بركان") ||
      value.includes("الجيش الملكي")
    ) {

      return "botola";

    }


    if (
      value.includes("الدوري الإسباني") ||
      value.includes("الليغا") ||
      value.includes("ريال مدريد") ||
      value.includes("برشلونة") ||
      value.includes("أتلتيكو مدريد")
    ) {

      return "PD";

    }


    if (
      value.includes("الدوري الإنجليزي") ||
      value.includes("البريميرليغ") ||
      value.includes("ليفربول") ||
      value.includes("مانشستر") ||
      value.includes("أرسنال") ||
      value.includes("تشيلسي")
    ) {

      return "PL";

    }


    if (
      value.includes("الدوري الإيطالي") ||
      value.includes("السيري آ") ||
      value.includes("يوفنتوس") ||
      value.includes("إنتر ميلان") ||
      value.includes("ميلان")
    ) {

      return "SA";

    }


    if (
      value.includes("الدوري الألماني") ||
      value.includes("البوندسليغا") ||
      value.includes("بايرن") ||
      value.includes("دورتموند")
    ) {

      return "BL1";

    }


    if (
      value.includes("الدوري الفرنسي") ||
      value.includes("ليغ 1") ||
      value.includes("باريس سان جيرمان") ||
      value.includes("مارسيليا")
    ) {

      return "FL1";

    }


    if (
      value.includes("دوري أبطال أوروبا") ||
      value.includes("دوري الأبطال") ||
      value.includes("champions league")
    ) {

      return "CL";

    }


    return "all";

  }


  async function loadNews() {

    const manual =
      readManualArticles();


    let rssArticles = [];


    const feeds =
      await Promise.allSettled(
        RSS_FEEDS.map(
          fetchRSSFeed
        )
      );


    feeds.forEach(result => {

      if (
        result.status === "fulfilled" &&
        result.value
      ) {

        rssArticles.push(
          ...parseRSS(
            result.value
          )
        );

      }

    });


    /*
      Manual/admin articles always have
      priority over RSS articles.
    */

    const all = [

      ...manual,

      ...rssArticles

    ];


    const seen =
      new Set();


    state.articles =
      all.filter(article => {

        if (
          seen.has(article.id)
        ) {

          return false;

        }


        const key =
          article.title
            .trim()
            .toLowerCase();


        if (seen.has(key)) {
          return false;
        }


        seen.add(article.id);
        seen.add(key);


        return true;

      });


    cacheSet(
      "articles",
      state.articles
    );


    if (
      state.articles.length === 0
    ) {

      state.articles =
        cacheGet("articles") ||
        [];

    }

  }


  /* =========================================================
     ARTICLE FILTER
     ========================================================= */

  function getVisibleArticles() {

    let articles =
      [...state.articles];


    if (
      state.league !== "all"
    ) {

      articles =
        articles.filter(
          article => {

            return (
              article.league ===
              state.league
            );

          }
        );

    }


    if (
      state.search.trim()
    ) {

      const query =
        state.search
          .trim()
          .toLowerCase();


      articles =
        articles.filter(
          article => {

            const haystack = [

              article.title,

              article.summary,

              article.content,

              article.source

            ]
              .join(" ")
              .toLowerCase();


            return haystack
              .includes(query);

          }
        );

    }


    return articles;

  }


  /* =========================================================
     ARTICLE CARD
     ========================================================= */

  function articleCard(article) {

    const id =
      escapeHTML(article.id);


    const title =
      escapeHTML(article.title);


    const summary =
      escapeHTML(
        article.summary || ""
      );


    const source =
      escapeHTML(
        article.source || "SPORT ZONE"
      );


    const time =
      formatMoroccoTime(
        article.publishedAt,
        true
      );


    return `

      <article
        class="news-card"
        data-article-id="${id}"
        tabindex="0"
        role="button"
      >

        <div class="news-image-wrap">

          <img
            src="${escapeHTML(
              article.image
            )}"
            alt="${title}"
            loading="lazy"
            referrerpolicy="no-referrer"
            onerror="this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=900&q=80'"
          >

          <span class="news-league">
            ${
              LEAGUES[
                article.league
              ]?.flag || "⚽"
            }
          </span>

        </div>


        <div class="news-card-body">

          <div class="news-meta">

            <span>
              ${source}
            </span>

            <span>
              ${time}
            </span>

          </div>


          <h3>
            ${title}
          </h3>


          <p>
            ${summary}
          </p>


          <span class="read-more">
            اقرأ الخبر كاملاً ←
          </span>

        </div>

      </article>

    `;

  }


  /* =========================================================
     HERO
     ========================================================= */

  function renderHero() {

    const container =
      $("#heroArticleContainer");


    if (!container) {
      return;
    }


    const articles =
      getVisibleArticles();


    if (!articles.length) {

      container.innerHTML = `

        <div class="empty-card">

          <div>
            🔎
          </div>

          <h3>
            لا توجد أخبار مطابقة
          </h3>

          <p>
            جرب تغيير البحث أو البطولة.
          </p>

        </div>

      `;

      return;

    }


    const article =
      articles[0];


    container.innerHTML = `

      <article
        class="hero-card"
        data-article-id="${escapeHTML(
          article.id
        )}"
        tabindex="0"
        role="button"
      >

        <img
          src="${escapeHTML(
            article.image
          )}"
          alt="${escapeHTML(
            article.title
          )}"
          referrerpolicy="no-referrer"
          onerror="this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'"
        >


        <div class="hero-overlay">

          <div class="hero-badge">
            ${article.manual ? "حصري" : "آخر الأخبار"}
          </div>


          <div class="hero-content">

            <div class="hero-meta">

              ${
                escapeHTML(
                  article.source ||
                  "SPORT ZONE"
                )
              }

              •
              
              ${
                formatMoroccoTime(
                  article.publishedAt,
                  true
                )
              }

            </div>


            <h2>
              ${escapeHTML(
                article.title
              )}
            </h2>


            <p>
              ${escapeHTML(
                article.summary || ""
              )}
            </p>


            <button
              class="hero-read-btn"
              data-article-id="${escapeHTML(
                article.id
              )}"
            >
              اقرأ الخبر كاملاً
              ←
            </button>

          </div>

        </div>

      </article>

    `;

  }


  /* =========================================================
     NEWS GRID
     ========================================================= */

  function renderNewsGrid() {

    const container =
      $("#newsGridContainer");


    if (!container) {
      return;
    }


    const articles =
      getVisibleArticles();


    const rest =
      articles.slice(1);


    if (!rest.length) {

      container.innerHTML = "";

      return;

    }


    container.innerHTML =
      rest
        .map(articleCard)
        .join("");

  }


  /* =========================================================
     TRENDING
     ========================================================= */

  function renderTrending() {

    const container =
      $("#trendingNewsWidget");


    if (!container) {
      return;
    }


    const articles =
      state.articles
        .slice(0, 5);


    if (!articles.length) {

      container.innerHTML = `

        <div class="empty-small">
          لا توجد أخبار حالياً.
        </div>

      `;

      return;

    }


    container.innerHTML =
      articles
        .map(
          (article, index) => `

            <article
              class="trending-item"
              data-article-id="${escapeHTML(
                article.id
              )}"
            >

              <span class="trending-number">
                ${index + 1}
              </span>

              <div>

                <h4>
                  ${escapeHTML(
                    article.title
                  )}
                </h4>

                <small>
                  ${formatMoroccoTime(
                    article.publishedAt,
                    true
                  )}
                </small>

              </div>

            </article>

          `
        )
        .join("");

  }


  /* =========================================================
     MATCH RENDER
     ========================================================= */

  function getCurrentMatches() {

    if (
      state.league === "all"
    ) {

      return Object.values(
        state.matchesByLeague
      )
        .flat();

    }


    return (
      state.matchesByLeague[
        state.league
      ] || []
    );

  }


  function renderTicker() {

    const container =
      $("#tickerMatchesContainer");


    if (!container) {
      return;
    }


    let matches =
      getCurrentMatches();


    matches =
      [...matches]
        .sort(
          (a, b) =>
            new Date(a.utcDate) -
            new Date(b.utcDate)
        )
        .slice(0, 15);


    if (!matches.length) {

      container.innerHTML = `

        <div class="ticker-empty">
          لا توجد مباريات متاحة حالياً
        </div>

      `;

      return;

    }


    container.innerHTML =
      matches
        .map(match => {

          const status =
            statusArabic(
              match.status
            );


          const live =
            match.status ===
              "IN_PLAY" ||
            match.status ===
              "PAUSED";


          return `

            <div
              class="match-carousel-card"
              data-match-id="${escapeHTML(
                String(match.id)
              )}"
            >

              <div class="ticker-league">
                ${
                  LEAGUES[
                    match.league
                  ]?.flag || "⚽"
                }
              </div>


              <div class="ticker-teams">

                <strong>
                  ${escapeHTML(
                    match.home.name
                  )}
                </strong>

                <span>
                  ${
                    match.homeScore !== null
                      ? match.homeScore
                      : formatMoroccoTime(
                          match.utcDate
                        )
                  }
                </span>

                <strong>
                  ${escapeHTML(
                    match.away.name
                  )}
                </strong>

              </div>


              <small
                class="${
                  live
                    ? "live-match"
                    : ""
                }"
              >
                ${status}
              </small>

            </div>

          `;

        })
        .join("");

  }


  /* =========================================================
     MATCH WIDGET
     ========================================================= */

  function renderMatches() {

    const container =
      $("#todayMatchesWidget");


    if (!container) {
      return;
    }


    let matches =
      getCurrentMatches();


    const targetDate =
      dateFromTab(
        state.date
      );


    matches =
      matches.filter(match => {

        if (!match.utcDate) {
          return false;
        }


        const date =
          new Date(
            match.utcDate
          );


        const fixed =
          new Date(
            date.getTime() +
            MOROCCO_OFFSET_MINUTES *
              60000
          );


        return (
          fixed
            .toISOString()
            .slice(0, 10) ===
          targetDate
        );

      });


    matches =
      matches
        .sort(
          (a, b) =>
            new Date(a.utcDate) -
            new Date(b.utcDate)
        )
        .slice(0, 12);


    if (!matches.length) {

      container.innerHTML = `

        <div class="empty-match">

          <div class="empty-icon">
            ⚽
          </div>

          <strong>
            لا توجد مباريات
          </strong>

          <span>
            لا توجد مباريات مسجلة لهذا اليوم في المصدر الحالي.
          </span>

        </div>

      `;

      return;

    }


    container.innerHTML =
      matches
        .map(match => {

          const live =
            match.status ===
              "IN_PLAY" ||
            match.status ===
              "PAUSED";


          const finished =
            match.status ===
            "FINISHED";


          return `

            <div class="match-row-item">

              <div class="match-row-top">

                <span>
                  ${
                    LEAGUES[
                      match.league
                    ]?.flag || "⚽"
                  }

                  ${escapeHTML(
                    match.leagueName
                  )}
                </span>

                <time>
                  ${formatMoroccoTime(
                    match.utcDate
                  )}
                </time>

              </div>


              <div class="match-row-main">

                <div class="team">

                  ${
                    match.home.crest
                      ? `
                        <img
                          src="${escapeHTML(
                            match.home.crest
                          )}"
                          alt=""
                          loading="lazy"
                        >
                      `
                      : ""
                  }

                  <span>
                    ${escapeHTML(
                      match.home.name
                    )}
                  </span>

                </div>


                <div class="score-box">

                  ${
                    match.homeScore !== null
                      ? `
                        <strong>
                          ${match.homeScore}
                          -
                          ${match.awayScore}
                        </strong>
                      `
                      : `
                        <strong>
                          -
                        </strong>
                      `
                  }


                  <small
                    class="${
                      live
                        ? "live-match"
                        : ""
                    }"
                  >
                    ${
                      live
                        ? "مباشر"
                        : finished
                          ? "النهاية"
                          : "لم تبدأ"
                    }
                  </small>

                </div>


                <div class="team away">

                  <span>
                    ${escapeHTML(
                      match.away.name
                    )}
                  </span>

                  ${
                    match.away.crest
                      ? `
                        <img
                          src="${escapeHTML(
                            match.away.crest
                          )}"
                          alt=""
                          loading="lazy"
                        >
                      `
                      : ""
                  }

                </div>

              </div>

            </div>

          `;

        })
        .join("");

  }


  /* =========================================================
     STANDINGS
     ========================================================= */

  function renderStandings() {

    const container =
      $("#standingsTableContainer");


    const title =
      $("#currentLeagueStandingsTitle");


    if (!container) {
      return;
    }


    const league =
      state.league === "all"
        ? "PL"
        : state.league;


    const leagueInfo =
      LEAGUES[league];


    if (title) {

      title.textContent =
        leagueInfo?.name ||
        "الدوري";

    }


    const table =
      state.standingsByLeague[
        league
      ] || [];


    if (!table.length) {

      container.innerHTML = `

        <div class="empty-small">
          جدول الترتيب غير متوفر حالياً.
        </div>

      `;

      return;

    }


    container.innerHTML = `

      <div class="standings-head">

        <span>
          المركز
        </span>

        <span>
          الفريق
        </span>

        <span>
          لعب
        </span>

        <span>
          نقاط
        </span>

      </div>


      <div class="standings-body">

        ${
          table
            .slice(0, 20)
            .map(row => `

              <div class="standing-row">

                <span
                  class="standing-position"
                >
                  ${row.position}
                </span>


                <div class="standing-team">

                  ${
                    row.team.crest
                      ? `
                        <img
                          src="${escapeHTML(
                            row.team.crest
                          )}"
                          alt=""
                          loading="lazy"
                        >
                      `
                      : ""
                  }

                  <span>
                    ${escapeHTML(
                      row.team.name
                    )}
                  </span>

                </div>


                <span>
                  ${row.played}
                </span>


                <strong>
                  ${row.points}
                </strong>

              </div>

            `)
            .join("")
        }

      </div>

    `;

  }


  /* =========================================================
     UI
     ========================================================= */

  function updateLeagueButtons() {

    $$(".league-tab-btn")
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.league ===
            state.league
        );

      });

  }


  function updateDateButtons() {

    $$(".date-tab-btn")
      .forEach(button => {

        button.classList.toggle(
          "active",
          button.dataset.date ===
            state.date
        );

      });

  }


  function updateSearchNotice() {

    const bar =
      $("#searchNoticeBar");

    const text =
      $("#searchNoticeText");


    if (!bar || !text) {
      return;
    }


    if (!state.search.trim()) {

      bar.classList.add(
        "hidden"
      );

      return;

    }


    const count =
      getVisibleArticles().length;


    text.textContent =
      `نتائج البحث عن "${state.search}" — ${count} خبر`;


    bar.classList.remove(
      "hidden"
    );

  }


  function renderAll() {

    updateLeagueButtons();

    updateDateButtons();

    updateSearchNotice();

    renderHero();

    renderNewsGrid();

    renderTrending();

    renderTicker();

    renderMatches();

    renderStandings();

  }


  /* =========================================================
     ARTICLE ROUTER
     ========================================================= */

  function findArticle(id) {

    return state.articles.find(
      article =>
        String(article.id) ===
        String(id)
    );

  }


  function articleRoute(id) {

    return `#article-${encodeURIComponent(
      id
    )}`;

  }


  function getArticleIdFromHash() {

    const hash =
      window.location.hash;


    if (
      !hash.startsWith(
        "#article-"
      )
    ) {

      return null;

    }


    return decodeURIComponent(
      hash.slice(
        "#article-".length
      )
    );

  }


  function openArticle(id, push = true) {

    const article =
      findArticle(id);


    if (!article) {

      showToast(
        "هذا الخبر غير متوفر حالياً"
      );

      return;

    }


    const main =
      $("#mainHomeView");

    const reader =
      $("#singleArticleView");


    if (!main || !reader) {
      return;
    }


    if (push) {

      const newHash =
        articleRoute(
          article.id
        );


      if (
        window.location.hash !==
        newHash
      ) {

        history.pushState(
          {
            articleId:
              article.id
          },
          "",
          newHash
        );

      }

    }


    main.classList.add(
      "hidden"
    );


    reader.classList.remove(
      "hidden"
    );


    reader.innerHTML = `

      <article class="article-reader">

        <button
          id="backToHome"
          class="back-home-btn"
        >
          → العودة للأخبار
        </button>


        <div class="article-header">

          <span class="article-category">
            ${
              LEAGUES[
                article.league
              ]?.flag || "⚽"
            }

            ${
              LEAGUES[
                article.league
              ]?.name ||
              "أخبار الرياضة"
            }
          </span>


          <h1>
            ${escapeHTML(
              article.title
            )}
          </h1>


          <div class="article-meta">

            <span>
              ${escapeHTML(
                article.source ||
                "SPORT ZONE"
              )}
            </span>

            <span>
              ${formatMoroccoTime(
                article.publishedAt,
                true
              )}
            </span>

          </div>

        </div>


        <div class="article-cover">

          <img
            src="${escapeHTML(
              article.image
            )}"
            alt="${escapeHTML(
              article.title
            )}"
            referrerpolicy="no-referrer"
            onerror="this.src='https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80'"
          >

        </div>


        <div class="article-share">

          <strong>
            مشاركة الخبر:
          </strong>


          <div class="share-buttons">

            <button
              class="share-btn whatsapp"
              data-share="whatsapp"
              title="WhatsApp"
            >
              🟢 WhatsApp
            </button>


            <button
              class="share-btn facebook"
              data-share="facebook"
              title="Facebook"
            >
              🔵 Facebook
            </button>


            <button
              class="share-btn x"
              data-share="x"
              title="X"
            >
              ⚫ X
            </button>


            <button
              class="share-btn copy"
              data-share="copy"
              title="نسخ الرابط"
            >
              📋 نسخ الرابط
            </button>

          </div>

        </div>


        <div class="article-content">

          ${
            article.content
              ? article.content
                  .includes("<")
                ? article.content
                : `<p>${escapeHTML(
                    article.content
                  ).replace(
                    /\n+/g,
                    "</p><p>"
                  )}</p>`
              : `<p>${escapeHTML(
                  article.summary ||
                  ""
                )}</p>`
          }


          ${
            article.url
              ? `
                <p class="original-source">
                  <a
                    href="${escapeHTML(
                      article.url
                    )}"
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                  >
                    قراءة المصدر الأصلي ↗
                  </a>
                </p>
              `
              : ""
          }

        </div>

      </article>

    `;


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  function closeSingleArticleView(
    clearHash = true
  ) {

    const main =
      $("#mainHomeView");

    const reader =
      $("#singleArticleView");


    if (reader) {

      reader.classList.add(
        "hidden"
      );

      reader.innerHTML = "";

    }


    if (main) {

      main.classList.remove(
        "hidden"
      );

    }


    if (clearHash) {

      history.pushState(
        {},
        "",
        window.location.pathname +
        window.location.search
      );

    }


    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  /* =========================================================
     SHARE
     ========================================================= */

  function getShareUrl() {

    return window.location.href;

  }


  function shareArticle(type) {

    const title =
      $("#singleArticleView h1")
        ?.textContent
        ?.trim() ||
      document.title;


    const url =
      getShareUrl();


    const encodedTitle =
      encodeURIComponent(
        title
      );


    const encodedUrl =
      encodeURIComponent(
        url
      );


    let shareUrl = "";


    if (type === "whatsapp") {

      shareUrl =
        `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

    }


    if (type === "facebook") {

      shareUrl =
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    }


    if (type === "x") {

      shareUrl =
        `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;

    }


    if (type === "copy") {

      copyLink(url);

      return;

    }


    if (!shareUrl) {
      return;
    }


    window.open(
      shareUrl,
      "_blank",
      "noopener,noreferrer,width=700,height=600"
    );

  }


  async function copyLink(url) {

    try {

      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {

        await navigator.clipboard.writeText(
          url
        );

      } else {

        const textarea =
          document.createElement(
            "textarea"
          );


        textarea.value =
          url;


        textarea.style.position =
          "fixed";

        textarea.style.opacity =
          "0";


        document.body.appendChild(
          textarea
        );


        textarea.focus();

        textarea.select();

        document.execCommand(
          "copy"
        );


        textarea.remove();

      }


      showToast(
        "تم نسخ الرابط بنجاح"
      );

    } catch {

      showToast(
        "تعذر نسخ الرابط"
      );

    }

  }


  /* =========================================================
     TOAST
     ========================================================= */

  function showToast(message) {

    const container =
      $("#toastContainer");


    if (!container) {
      return;
    }


    const toast =
      document.createElement(
        "div"
      );


    toast.className =
      "toast";


    toast.textContent =
      message;


    container.appendChild(
      toast
    );


    requestAnimationFrame(
      () => {
        toast.classList.add(
          "show"
        );
      }
    );


    setTimeout(
      () => {

        toast.classList.remove(
          "show"
        );

        setTimeout(
          () => toast.remove(),
          300
        );

      },
      2800
    );

  }


  /* =========================================================
     ERROR BOUNDARY
     ========================================================= */

  function showGlobalError(message) {

    const boundary =
      $("#appErrorBoundary");


    if (!boundary) {
      return;
    }


    boundary.innerHTML = `

      <div class="global-error">

        <strong>
          حدث خطأ أثناء تحميل SPORT ZONE
        </strong>

        <span>
          ${escapeHTML(
            message
          )}
        </span>

        <button
          onclick="location.reload()"
        >
          إعادة المحاولة
        </button>

      </div>

    `;


    boundary.classList.remove(
      "hidden"
    );

  }


  /* =========================================================
     EVENTS
     ========================================================= */

  function setupEvents() {

    /* League navigation */

    const nav =
      $("#leagueNavContainer");


    if (nav) {

      nav.addEventListener(
        "click",
        async event => {

          const button =
            event.target.closest(
              ".league-tab-btn"
            );


          if (!button) {
            return;
          }


          const league =
            button.dataset.league;


          if (!league) {
            return;
          }


          await switchLeague(
            league
          );

        }
      );

    }


    /* Date tabs */

    const dateTabs =
      $("#dateTabsContainer");


    if (dateTabs) {

      dateTabs.addEventListener(
        "click",
        async event => {

          const button =
            event.target.closest(
              ".date-tab-btn"
            );


          if (!button) {
            return;
          }


          state.date =
            button.dataset.date ||
            "today";


          updateDateButtons();


          await reloadCurrentMatches();

        }
      );

    }


    /* Search */

    const search =
      $("#searchInput");


    if (search) {

      search.addEventListener(
        "input",
        () => {

          state.search =
            search.value || "";


          renderHero();

          renderNewsGrid();

          updateSearchNotice();

        }
      );

    }


    /* Reset search */

    const reset =
      $("#resetSearchBtn");


    if (reset) {

      reset.addEventListener(
        "click",
        () => {

          if (search) {
            search.value = "";
          }


          state.search = "";


          renderHero();

          renderNewsGrid();

          updateSearchNotice();

        }
      );

    }


    /* Article cards */

    document.addEventListener(
      "click",
      event => {

        const target =
          event.target.closest(
            "[data-article-id]"
          );


        if (!target) {
          return;
        }


        const shareButton =
          event.target.closest(
            "[data-share]"
          );


        if (shareButton) {
          return;
        }


        const id =
          target.dataset.articleId;


        if (id) {

          openArticle(
            id,
            true
          );

        }

      }
    );


    /* Keyboard accessibility */

    document.addEventListener(
      "keydown",
      event => {

        if (
          event.key !== "Enter" &&
          event.key !== " "
        ) {

          return;

        }


        const target =
          event.target.closest(
            "[data-article-id]"
          );


        if (!target) {
          return;
        }


        event.preventDefault();


        openArticle(
          target.dataset.articleId,
          true
        );

      }
    );


    /* Share buttons */

    document.addEventListener(
      "click",
      event => {

        const button =
          event.target.closest(
            "[data-share]"
          );


        if (!button) {
          return;
        }


        event.stopPropagation();


        shareArticle(
          button.dataset.share
        );

      }
    );


    /* Back button */

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "#backToHome"
          )
        ) {

          closeSingleArticleView();

        }

      }
    );


    /* Home */

    document.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            "[data-home]"
          )
        ) {

          event.preventDefault();

          closeSingleArticleView();

        }

      }
    );


    /* Browser back / forward */

    window.addEventListener(
      "popstate",
      handleRoute
    );


    window.addEventListener(
      "hashchange",
      handleRoute
    );

  }


  /* =========================================================
     LEAGUE SWITCH
     ========================================================= */

  async function switchLeague(
    league
  ) {

    if (
      !LEAGUES[league]
    ) {

      return;

    }


    state.league =
      league;


    updateLeagueButtons();


    renderHero();

    renderNewsGrid();

    renderTrending();

    renderStandings();

    renderMatches();

    renderTicker();


    if (
      !state.matchesByLeague[
        league
      ] &&
      league !== "all"
    ) {

      try {

        await loadLeagueData(
          league
        );

      } catch {

        // fallback/cache

      }

    }


    renderHero();

    renderNewsGrid();

    renderTrending();

    renderStandings();

    renderMatches();

    renderTicker();

  }


  async function reloadCurrentMatches() {

    const codes =
      state.league === "all"

        ? [
            "PD",
            "PL",
            "SA",
            "BL1",
            "FL1",
            "CL"
          ]

        : (
          state.league ===
          "botola"
            ? []
            : [state.league]
        );


    if (!codes.length) {

      renderMatches();

      renderTicker();

      return;

    }


    await Promise.allSettled(
      codes.map(
        loadLeagueData
      )
    );


    renderMatches();

    renderTicker();

  }


  /* =========================================================
     ROUTING
     ========================================================= */

  function handleRoute() {

    const id =
      getArticleIdFromHash();


    if (id) {

      const article =
        findArticle(id);


      if (article) {

        openArticle(
          id,
          false
        );

        return;

      }

    }


    closeSingleArticleView(
      false
    );

  }


  /* =========================================================
     LIVE REFRESH
     ========================================================= */

  async function refreshLiveData() {

    try {

      await reloadCurrentMatches();

    } catch {

      // Keep existing data.

    }

  }


  /* =========================================================
     INITIALIZATION
     ========================================================= */

  async function init() {

    if (
      state.initialized
    ) {

      return;

    }


    state.initialized =
      true;


    try {

      setupEvents();


      state.loading =
        true;


      const loading =
        $("#loadingState");


      if (loading) {

        loading.classList.remove(
          "hidden"
        );

      }


      await Promise.all([

        loadNews(),

        loadAllData()

      ]);


      renderAll();


      handleRoute();


    } catch (error) {

      console.error(
        "SPORT ZONE:",
        error
      );


      const cached =
        cacheGet("articles");


      if (cached) {

        state.articles =
          cached;

        renderAll();

      } else {

        showGlobalError(
          error.message ||
          "تعذر تحميل البيانات"
        );

      }

    } finally {

      state.loading =
        false;


      const loading =
        $("#loadingState");


      if (loading) {

        loading.classList.add(
          "hidden"
        );

      }

    }

  }


  /* =========================================================
     PUBLIC CONTROLLER
     ========================================================= */

  window.szAppController = {

    switchLeague,

    openArticle,

    closeSingleArticleView,

    refresh: refreshLiveData

  };


  /* =========================================================
     START
     ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init,
      {
        once: true
      }
    );

  } else {

    init();

  }


  /*
    Refresh football data every 60 seconds.
  */

  setInterval(
    () => {

      if (
        document.visibilityState ===
        "visible"
      ) {

        refreshLiveData();

      }

    },
    60000
  );


})();
