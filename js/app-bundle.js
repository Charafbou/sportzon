/* =========================================================
   SPORT ZONE
   Main Application
   sportzon.biz
========================================================= */

(() => {

  "use strict";


  /* =======================================================
     CONFIG
  ======================================================= */

  const CONFIG = {

    API_URL: "/api/sports",

    RSS_TIMEOUT: 9000,

    ARTICLES_STORAGE:
      "sz_sports_data_v5",

    DEFAULT_LEAGUE:
      "all",

    DEFAULT_DATE:
      "today",

    MAX_NEWS:
      40

  };


  /* =======================================================
     LEAGUES
  ======================================================= */

  const LEAGUES = {

    all: {
      name: "الرئيسية",
      flag: "🏠",
      api: null
    },

    botola: {
      name: "البطولة برو",
      flag: "🇲🇦",
      api: null
    },

    PD: {
      name: "الدوري الإسباني",
      flag: "🇪🇸",
      api: "PD"
    },

    PL: {
      name: "الدوري الإنجليزي الممتاز",
      flag: "🏴",
      api: "PL"
    },

    SA: {
      name: "الدوري الإيطالي",
      flag: "🇮🇹",
      api: "SA"
    },

    BL1: {
      name: "الدوري الألماني",
      flag: "🇩🇪",
      api: "BL1"
    },

    FL1: {
      name: "الدوري الفرنسي",
      flag: "🇫🇷",
      api: "FL1"
    },

    CL: {
      name: "دوري أبطال أوروبا",
      flag: "🏆",
      api: "CL"
    }

  };


  /* =======================================================
     RSS SOURCES
  ======================================================= */

  const RSS_SOURCES = [

    {
      name: "Google News",
      url:
        "https://news.google.com/rss/search?q=كرة+القدم+رياضة&hl=ar&gl=MA&ceid=MA:ar"
    },

    {
      name: "Google News Football",
      url:
        "https://news.google.com/rss/search?q=كرة+القدم+المغرب+ريال+مدريد+برشلونة&hl=ar&gl=MA&ceid=MA:ar"
    },

    {
      name: "Google News Premier League",
      url:
        "https://news.google.com/rss/search?q=الدوري+الإنجليزي&hl=ar&gl=MA&ceid=MA:ar"
    },

    {
      name: "Google News La Liga",
      url:
        "https://news.google.com/rss/search?q=الدوري+الإسباني&hl=ar&gl=MA&ceid=MA:ar"
    },

    {
      name: "Google News Morocco",
      url:
        "https://news.google.com/rss/search?q=المنتخب+المغربي&hl=ar&gl=MA&ceid=MA:ar"
    }

  ];


  /* =======================================================
     STATE
  ======================================================= */

  const state = {

    league:
      CONFIG.DEFAULT_LEAGUE,

    date:
      CONFIG.DEFAULT_DATE,

    search:
      "",

    articles:
      [],

    matches:
      [],

    standings:
      [],

    loading:
      false,

    articleView:
      false

  };


  /* =======================================================
     DOM
  ======================================================= */

  const DOM = {};


  function cacheDOM() {

    DOM.home =
      document.getElementById("mainHomeView");

    DOM.article =
      document.getElementById("singleArticleView");

    DOM.ticker =
      document.getElementById("tickerMatchesContainer");

    DOM.hero =
      document.getElementById("heroArticleContainer");

    DOM.news =
      document.getElementById("newsGridContainer");

    DOM.matches =
      document.getElementById("todayMatchesWidget");

    DOM.standings =
      document.getElementById("standingsTableBody");

    DOM.standingsTitle =
      document.getElementById(
        "currentLeagueStandingsTitle"
      );

    DOM.trending =
      document.getElementById(
        "trendingNewsWidget"
      );

    DOM.search =
      document.getElementById(
        "searchInput"
      );

    DOM.searchNotice =
      document.getElementById(
        "searchNoticeBar"
      );

    DOM.searchNoticeText =
      document.getElementById(
        "searchNoticeText"
      );

    DOM.resetSearch =
      document.getElementById(
        "resetSearchBtn"
      );

    DOM.toast =
      document.getElementById(
        "szToast"
      );

    DOM.videos =
      document.getElementById(
        "videosContainer"
      );

  }


  /* =======================================================
     HELPERS
  ======================================================= */

  function escapeHTML(value) {

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  }


  function uid(prefix = "article") {

    return (
      prefix +
      "-" +
      Date.now().toString(36) +
      "-" +
      Math.random()
        .toString(36)
        .slice(2, 8)
    );

  }


  function showToast(message) {

    if (!DOM.toast) return;

    DOM.toast.textContent =
      message;

    DOM.toast.classList.add(
      "show"
    );

    clearTimeout(
      showToast.timer
    );

    showToast.timer =
      setTimeout(() => {

        DOM.toast.classList.remove(
          "show"
        );

      }, 2600);

  }


  function loadingHTML() {

    return `
      <div class="loading">
        <span class="spinner"></span>
        جاري تحميل البيانات...
      </div>
    `;

  }


  /* =======================================================
     MOROCCO TIME GMT+1
  ======================================================= */

  function moroccoDate(
    date
  ) {

    const d =
      date instanceof Date
        ? date
        : new Date(date);

    if (
      Number.isNaN(
        d.getTime()
      )
    ) {
      return null;
    }

    return new Date(
      d.toLocaleString(
        "en-US",
        {
          timeZone:
            "Africa/Casablanca"
        }
      )
    );

  }


  function formatMoroccoTime(
    value
  ) {

    const d =
      moroccoDate(value);

    if (!d) {
      return "--:-- GMT+1";
    }

    return (
      new Intl.DateTimeFormat(
        "fr-MA",
        {
          timeZone:
            "Africa/Casablanca",
          hour:
            "2-digit",
          minute:
            "2-digit",
          hour12:
            false
        }
      ).format(
        new Date(value)
      ) +
      " GMT+1"
    );

  }


  function formatMoroccoDate(
    value
  ) {

    const d =
      new Date(value);

    if (
      Number.isNaN(
        d.getTime()
      )
    ) {
      return "";
    }

    return new Intl.DateTimeFormat(
      "ar-MA",
      {
        timeZone:
          "Africa/Casablanca",
        day:
          "2-digit",
        month:
          "2-digit",
        year:
          "numeric",
        hour:
          "2-digit",
        minute:
          "2-digit",
        hour12:
          false
      }
    ).format(d) +
      " GMT+1";

  }


  function dateISO(
    offset
  ) {

    const now =
      new Date();

    const morocco =
      new Date(
        now.toLocaleString(
          "en-US",
          {
            timeZone:
              "Africa/Casablanca"
          }
        )
      );

    morocco.setDate(
      morocco.getDate() +
      offset
    );

    const y =
      morocco.getFullYear();

    const m =
      String(
        morocco.getMonth() + 1
      ).padStart(2, "0");

    const d =
      String(
        morocco.getDate()
      ).padStart(2, "0");

    return `${y}-${m}-${d}`;

  }


  /* =======================================================
     API
  ======================================================= */

  async function apiFetch(
    type,
    league,
    params = {}
  ) {

    if (!league) {
      throw new Error(
        "League is required"
      );
    }

    const url =
      new URL(
        CONFIG.API_URL,
        window.location.origin
      );

    url.searchParams.set(
      "type",
      type
    );

    url.searchParams.set(
      "league",
      league
    );

    Object.entries(
      params
    ).forEach(
      ([key, value]) => {

        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {

          url.searchParams.set(
            key,
            value
          );

        }

      }
    );

    const response =
      await fetch(
        url.toString(),
        {
          method: "GET",
          headers: {
            Accept:
              "application/json"
          },
          cache:
            "no-store"
        }
      );

    if (!response.ok) {

      let message =
        `API Error ${response.status}`;

      try {

        const errorData =
          await response.json();

        if (
          errorData?.details?.message
        ) {

          message =
            errorData.details.message;

        }

      } catch (_) {}

      throw new Error(
        message
      );

    }

    return response.json();

  }


  /* =======================================================
     MANUAL ARTICLES
  ======================================================= */

  function getManualArticles() {

    try {

      const raw =
        localStorage.getItem(
          CONFIG.ARTICLES_STORAGE
        );

      if (!raw) {
        return [];
      }

      const parsed =
        JSON.parse(raw);

      if (
        !Array.isArray(parsed)
      ) {
        return [];
      }

      return parsed
        .map(
          normalizeManualArticle
        )
        .filter(Boolean);

    } catch (error) {

      console.error(
        "Manual articles error:",
        error
      );

      return [];

    }

  }


  function normalizeManualArticle(
    article,
    index
  ) {

    if (!article) {
      return null;
    }

    const title =
      article.title ||
      article.headline ||
      article.name;

    if (!title) {
      return null;
    }

    return {

      id:
        String(
          article.id ||
          article._id ||
          uid("manual")
        ),

      title:
        String(title),

      summary:
        String(
          article.summary ||
          article.description ||
          article.excerpt ||
          ""
        ),

      content:
        String(
          article.content ||
          article.body ||
          article.text ||
          article.summary ||
          ""
        ),

      image:
        article.image ||
        article.imageUrl ||
        article.thumbnail ||
        fallbackImage(index),

      category:
        article.category ||
        article.league ||
        "رياضة",

      league:
        normalizeLeague(
          article.league
        ),

      source:
        article.source ||
        "SPORT ZONE",

      publishedAt:
        article.publishedAt ||
        article.date ||
        new Date().toISOString(),

      manual:
        true

    };

  }


  /* =======================================================
     FALLBACK IMAGES
  ======================================================= */

  const FALLBACK_IMAGES = [

    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",

    "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80",

    "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1200&q=80",

    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80"

  ];


  function fallbackImage(
    index = 0
  ) {

    return FALLBACK_IMAGES[
      index %
      FALLBACK_IMAGES.length
    ];

  }


  /* =======================================================
     RSS
  ======================================================= */

  function proxyURLs(
    rssURL
  ) {

    return [

      "https://api.allorigins.win/raw?url=" +
      encodeURIComponent(rssURL),

      "https://corsproxy.io/?" +
      encodeURIComponent(rssURL)

    ];

  }


  async function fetchWithTimeout(
    url,
    timeout =
      CONFIG.RSS_TIMEOUT
  ) {

    const controller =
      new AbortController();

    const timer =
      setTimeout(
        () => controller.abort(),
        timeout
      );

    try {

      const response =
        await fetch(
          url,
          {
            signal:
              controller.signal,
            cache:
              "no-store"
          }
        );

      return response;

    } finally {

      clearTimeout(timer);

    }

  }


  async function fetchRSS(
    source
  ) {

    const proxies =
      proxyURLs(
        source.url
      );

    for (
      const proxy of proxies
    ) {

      try {

        const response =
          await fetchWithTimeout(
            proxy
          );

        if (
          !response.ok
        ) {
          continue;
        }

        const text =
          await response.text();

        if (!text) {
          continue;
        }

        return parseRSS(
          text,
          source.name
        );

      } catch (error) {

        console.warn(
          "RSS proxy failed:",
          proxy,
          error
        );

      }

    }

    return [];

  }


  function parseRSS(
    text,
    sourceName
  ) {

    try {

      const parser =
        new DOMParser();

      const xml =
        parser.parseFromString(
          text,
          "text/xml"
        );

      const items =
        [
          ...xml.querySelectorAll(
            "item"
          )
        ];

      return items
        .map(
          (item, index) => {

            const title =
              item.querySelector(
                "title"
              )?.textContent?.trim();

            const description =
              item.querySelector(
                "description"
              )?.textContent?.trim() ||
              "";

            const link =
              item.querySelector(
                "link"
              )?.textContent?.trim();

            const pubDate =
              item.querySelector(
                "pubDate"
              )?.textContent?.trim();

            if (!title) {
              return null;
            }

            return {

              id:
                "rss-" +
                hashString(
                  title +
                  (
                    link ||
                    ""
                  )
                ),

              title:
                cleanText(title),

              summary:
                cleanText(
                  stripHTML(
                    description
                  )
                ),

              content:
                cleanText(
                  stripHTML(
                    description
                  )
                ),

              image:
                fallbackImage(
                  index
                ),

              category:
                detectCategory(
                  title
                ),

              league:
                detectLeague(
                  title
                ),

              source:
                sourceName,

              sourceUrl:
                link || "",

              publishedAt:
                pubDate ||
                new Date().toISOString(),

              manual:
                false

            };

          }
        )
        .filter(Boolean);

    } catch (error) {

      console.error(
        "RSS parsing failed:",
        error
      );

      return [];

    }

  }


  function cleanText(
    text
  ) {

    return String(
      text || ""
    )
      .replace(
        /<!\[CDATA\[|\]\]>/g,
        ""
      )
      .replace(
        /\s+/g,
        " "
      )
      .trim();

  }


  function stripHTML(
    html
  ) {

    const div =
      document.createElement(
        "div"
      );

    div.innerHTML =
      html || "";

    return div.textContent ||
      div.innerText ||
      "";

  }


  function hashString(
    value
  ) {

    let hash =
      0;

    for (
      let i = 0;
      i < value.length;
      i++
    ) {

      hash =
        (
          (
            hash << 5
          ) -
          hash
        ) +
        value.charCodeAt(i);

      hash |=
        0;

    }

    return Math.abs(
      hash
    ).toString(36);

  }


  /* =======================================================
     LEAGUE DETECTION
  ======================================================= */

  function normalizeLeague(
    value
  ) {

    if (!value) {
      return "all";
    }

    const v =
      String(value)
        .toLowerCase();

    if (
      v.includes("botola") ||
      v.includes("البطولة") ||
      v.includes("المغرب")
    ) {
      return "botola";
    }

    if (
      v === "pl" ||
      v.includes("premier") ||
      v.includes("إنجليزي")
    ) {
      return "PL";
    }

    if (
      v === "pd" ||
      v.includes("liga") ||
      v.includes("إسباني")
    ) {
      return "PD";
    }

    if (
      v === "sa" ||
      v.includes("serie") ||
      v.includes("إيطالي")
    ) {
      return "SA";
    }

    if (
      v === "bl1" ||
      v.includes("bundes") ||
      v.includes("ألماني")
    ) {
      return "BL1";
    }

    if (
      v === "fl1" ||
      v.includes("ligue") ||
      v.includes("فرنسي")
    ) {
      return "FL1";
    }

    if (
      v === "cl" ||
      v.includes("champions") ||
      v.includes("أبطال أوروبا")
    ) {
      return "CL";
    }

    return "all";

  }


  function detectLeague(
    title
  ) {

    return normalizeLeague(
      title
    );

  }


  function detectCategory(
    title
  ) {

    const league =
      detectLeague(
        title
      );

    return (
      LEAGUES[league]?.name ||
      "كرة القدم"
    );

  }


  /* =======================================================
     LOAD NEWS
  ======================================================= */

  async function loadNews() {

    const manual =
      getManualArticles();

    let rssArticles = [];

    try {

      const results =
        await Promise.allSettled(
          RSS_SOURCES.map(
            fetchRSS
          )
        );

      results.forEach(
        result => {

          if (
            result.status === "fulfilled"
          ) {

            rssArticles.push(
              ...result.value
            );

          }

        }
      );

    } catch (error) {

      console.error(
        "News loading error:",
        error
      );

    }


    /*
      إزالة التكرار
    */

    const unique =
      new Map();

    [
      ...manual,
      ...rssArticles
    ].forEach(
      article => {

        const key =
          article.id ||
          hashString(
            article.title
          );

        if (
          !unique.has(key)
        ) {

          unique.set(
            key,
            article
          );

        }

      }
    );


    let articles =
      [...unique.values()];


    /*
      Manual articles دائما الأولوية
    */

    articles.sort(
      (a, b) => {

        if (
          a.manual &&
          !b.manual
        ) {
          return -1;
        }

        if (
          !a.manual &&
          b.manual
        ) {
          return 1;
        }

        return (
          new Date(
            b.publishedAt
          ) -
          new Date(
            a.publishedAt
          )
        );

      }
    );


    state.articles =
      articles.slice(
        0,
        CONFIG.MAX_NEWS
      );


    renderNews();

  }


  /* =======================================================
     FILTER NEWS
  ======================================================= */

  function getFilteredArticles() {

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
              state.league ||
              article.manual === true &&
              (
                article.league ===
                state.league
              )
            );

          }
        );

    }


    if (
      state.search.trim()
    ) {

      const query =
        state.search
          .toLowerCase()
          .trim();

      articles =
        articles.filter(
          article => {

            const text =
              [
                article.title,
                article.summary,
                article.content,
                article.category,
                article.source
              ]
              .join(" ")
              .toLowerCase();

            return text.includes(
              query
            );

          }
        );

    }

    return articles;

  }


  /* =======================================================
     RENDER NEWS
  ======================================================= */

  function renderNews() {

    const articles =
      getFilteredArticles();


    if (
      state.search.trim()
    ) {

      DOM.searchNotice.classList.remove(
        "hidden"
      );

      DOM.searchNoticeText.textContent =
        `نتائج البحث عن "${state.search}" — ${articles.length} خبر`;

    } else {

      DOM.searchNotice.classList.add(
        "hidden"
      );

    }


    if (!articles.length) {

      DOM.hero.innerHTML =
        emptyNewsHTML();

      DOM.news.innerHTML =
        "";

      return;

    }


    const hero =
      articles[0];

    DOM.hero.innerHTML =
      heroHTML(
        hero
      );


    DOM.news.innerHTML =
      articles
        .slice(1)
        .map(
          articleHTML
        )
        .join("");


    renderTrending(
      articles
    );

  }


  function heroHTML(
    article
  ) {

    return `

      <article
        class="hero-card"
        data-article-id="${escapeHTML(article.id)}">

        <img
          class="hero-image"
          src="${escapeHTML(article.image)}"
          alt="${escapeHTML(article.title)}"
          loading="eager"
          onerror="this.src='${fallbackImage(0)}'">

        <div class="hero-overlay"></div>

        <div class="hero-content">

          <span class="article-category">
            ${escapeHTML(article.category)}
          </span>

          <h1>
            ${escapeHTML(article.title)}
          </h1>

          <div class="article-meta">

            <span>
              📰 ${escapeHTML(article.source)}
            </span>

            <span>
              🕐 ${formatMoroccoDate(article.publishedAt)}
            </span>

            <span>
              اقرأ الخبر كاملاً ←
            </span>

          </div>

        </div>

      </article>

    `;

  }


  function articleHTML(
    article
  ) {

    return `

      <article
        class="news-card"
        data-article-id="${escapeHTML(article.id)}">

        <div class="news-image-wrapper">

          <img
            class="news-image"
            src="${escapeHTML(article.image)}"
            alt="${escapeHTML(article.title)}"
            loading="lazy"
            onerror="this.src='${fallbackImage(1)}'">

        </div>

        <div class="news-body">

          <span class="article-category">
            ${escapeHTML(article.category)}
          </span>

          <h2>
            ${escapeHTML(article.title)}
          </h2>

          <div class="news-summary">
            ${escapeHTML(
              article.summary ||
              "آخر الأخبار الرياضية والتفاصيل الكاملة."
            )}
          </div>

          <div class="news-meta">

            <span>
              ${escapeHTML(article.source)}
            </span>

            <span>
              ${formatMoroccoDate(
                article.publishedAt
              )}
            </span>

          </div>

        </div>

      </article>

    `;

  }


  function emptyNewsHTML() {

    return `

      <div class="panel">

        <div class="no-data">

          لا توجد أخبار مطابقة للبحث أو الدوري المحدد حالياً.

        </div>

      </div>

    `;

  }


  /* =======================================================
     ARTICLE ROUTING
  ======================================================= */

  function openArticle(
    articleId,
    updateURL = true
  ) {

    const article =
      state.articles.find(
        item =>
          String(item.id) ===
          String(articleId)
      );

    if (!article) {

      showToast(
        "عذراً، الخبر غير موجود"
      );

      return;

    }


    state.articleView =
      true;


    if (updateURL) {

      history.pushState(
        {
          articleId:
            article.id
        },
        "",
        `#article-${encodeURIComponent(
          article.id
        )}`
      );

    }


    renderSingleArticle(
      article
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  }


  function renderSingleArticle(
    article
  ) {

    DOM.home.style.display =
      "none";

    DOM.article.style.display =
      "block";


    const canonicalURL =
      window.location.href;


    const encodedTitle =
      encodeURIComponent(
        article.title
      );

    const encodedURL =
      encodeURIComponent(
        canonicalURL
      );


    DOM.article.innerHTML = `

      <div class="article-reader">

        <button
          class="article-back"
          id="articleBackBtn">
          → العودة إلى الأخبار
        </button>

        <div class="article-reader-category">
          ${escapeHTML(article.category)}
        </div>

        <h1>
          ${escapeHTML(article.title)}
        </h1>

        <div class="article-reader-meta">

          <span>
            📰 ${escapeHTML(article.source)}
          </span>

          <span>
            🕐 ${formatMoroccoDate(
              article.publishedAt
            )}
          </span>

        </div>

        <img
          class="article-cover"
          src="${escapeHTML(article.image)}"
          alt="${escapeHTML(article.title)}"
          onerror="this.src='${fallbackImage(0)}'">

        <div class="share-bar">

          <span class="share-label">
            شارك الخبر:
          </span>

          <button
            class="share-btn whatsapp"
            data-share="whatsapp"
            data-url="${encodedURL}"
            data-title="${encodedTitle}">
            🟢 WhatsApp
          </button>

          <button
            class="share-btn facebook"
            data-share="facebook"
            data-url="${encodedURL}">
            🔵 Facebook
          </button>

          <button
            class="share-btn twitter"
            data-share="twitter"
            data-url="${encodedURL}"
            data-title="${encodedTitle}">
            ⚫ X
          </button>

          <button
            class="share-btn copy-link"
            data-share="copy">
            📋 نسخ الرابط
          </button>

        </div>

        <div class="article-content">

          ${
            article.summary
              ? `
                <div class="article-summary">
                  ${escapeHTML(article.summary)}
                </div>
              `
              : ""
          }

          ${formatArticleContent(
            article.content ||
            article.summary ||
            ""
          )}

          ${
            article.sourceUrl
              ? `
                <p style="font-size:11px;color:#718091;margin-top:25px;">
                  المصدر:
                  ${escapeHTML(article.source)}
                </p>
              `
              : ""
          }

        </div>

      </div>

    `;

  }


  function formatArticleContent(
    text
  ) {

    const cleaned =
      stripHTML(
        text
      )
      .trim();

    if (!cleaned) {

      return `
        <p>
          لم يتم توفير النص الكامل لهذا الخبر.
        </p>
      `;

    }

    const paragraphs =
      cleaned
        .split(
          /\n{2,}|(?<=[.!؟])\s{2,}/
        )
        .filter(Boolean);

    return paragraphs
      .map(
        paragraph =>
          `<p>${escapeHTML(
            paragraph.trim()
          )}</p>`
      )
      .join("");

  }


  function closeArticle(
    updateURL = true
  ) {

    state.articleView =
      false;

    DOM.article.style.display =
      "none";

    DOM.home.style.display =
      "block";


    if (updateURL) {

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


  function handleHashRoute() {

    const hash =
      window.location.hash;


    if (
      hash.startsWith(
        "#article-"
      )
    ) {

      const id =
        decodeURIComponent(
          hash.substring(
            "#article-".length
          )
        );

      /*
        المقالات RSS/manual يتم تحميلها
        قبل محاولة فتح route
      */

      const article =
        state.articles.find(
          item =>
            String(item.id) ===
            String(id)
        );

      if (article) {

        openArticle(
          article.id,
          false
        );

      } else {

        /*
          إذا البيانات مازال ما كملتش
          نخليها تتعاود بعد التحميل
        */

        setTimeout(
          () =>
            handleHashRoute(),
          500
        );

      }

    } else {

      if (
        state.articleView
      ) {

        closeArticle(
          false
        );

      }

    }

  }


  /* =======================================================
     SHARE
  ======================================================= */

  function shareArticle(
    type,
    article
  ) {

    const url =
      window.location.href;

    const title =
      article.title;


    if (
      type === "whatsapp"
    ) {

      const target =
        "https://api.whatsapp.com/send?text=" +
        encodeURIComponent(
          title
        ) +
        "%20" +
        encodeURIComponent(
          url
        );

      window.open(
        target,
        "_blank",
        "noopener,noreferrer"
      );

      return;

    }


    if (
      type === "facebook"
    ) {

      const target =
        "https://www.facebook.com/sharer/sharer.php?u=" +
        encodeURIComponent(
          url
        );

      window.open(
        target,
        "_blank",
        "noopener,noreferrer"
      );

      return;

    }


    if (
      type === "twitter"
    ) {

      const target =
        "https://twitter.com/intent/tweet?text=" +
        encodeURIComponent(
          title
        ) +
        "&url=" +
        encodeURIComponent(
          url
        );

      window.open(
        target,
        "_blank",
        "noopener,noreferrer"
      );

      return;

    }


    if (
      type === "copy"
    ) {

      copyCurrentURL();

    }

  }


  async function copyCurrentURL() {

    const url =
      window.location.href;


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

    } catch (error) {

      showToast(
        "تعذر نسخ الرابط"
      );

    }

  }


  /* =======================================================
     MATCHES
  ======================================================= */

  async function loadMatches() {

    DOM.matches.innerHTML =
      loadingHTML();

    DOM.ticker.innerHTML =
      loadingHTML();


    /*
      البطولة برو:
      حاليا fallback لأن sports.js
      ما فيه API خاص بالبطولة.
    */

    if (
      state.league === "botola"
    ) {

      state.matches =
        getBotolaFallbackMatches();

      renderMatches();

      return;

    }


    if (
      state.league === "all"
    ) {

      /*
        الرئيسية تجمع المباريات
        من عدة دوريات.
      */

      const leagues =
        [
          "PL",
          "PD",
          "SA",
          "BL1",
          "FL1",
          "CL"
        ];

      const date =
        getSelectedDate();


      const results =
        await Promise.allSettled(
          leagues.map(
            league =>
              apiFetch(
                "matches",
                league,
                {
                  date
                }
              )
          )
        );


      const matches =
        [];

      results.forEach(
        result => {

          if (
            result.status ===
            "fulfilled"
          ) {

            matches.push(
              ...(
                result.value.matches ||
                []
              )
            );

          }

        }
      );


      state.matches =
        normalizeMatches(
          matches
        );

      renderMatches();

      return;

    }


    const leagueAPI =
      LEAGUES[
        state.league
      ]?.api;


    if (!leagueAPI) {

      state.matches =
        [];

      renderMatches();

      return;

    }


    try {

      const data =
        await apiFetch(
          "matches",
          leagueAPI,
          {
            date:
              getSelectedDate()
          }
        );


      state.matches =
        normalizeMatches(
          data.matches ||
          []
        );

    } catch (error) {

      console.error(
        "Matches error:",
        error
      );

      state.matches =
        [];

    }


    renderMatches();

  }


  function getSelectedDate() {

    if (
      state.date ===
      "yesterday"
    ) {
      return dateISO(-1);
    }

    if (
      state.date ===
      "tomorrow"
    ) {
      return dateISO(1);
    }

    return dateISO(0);

  }


  function normalizeMatches(
    matches
  ) {

    return matches
      .map(
        match => {

          const home =
            match.homeTeam ||
            {};

          const away =
            match.awayTeam ||
            {};

          const score =
            match.score ||
            {};

          return {

            id:
              match.id,

            competition:
              match.competition?.name ||
              "",

            competitionCode:
              match.competition?.code ||
              "",

            home:
              home.name ||
              "الفريق المضيف",

            away:
              away.name ||
              "الفريق الضيف",

            homeCrest:
              home.crest ||
              "",

            awayCrest:
              away.crest ||
              "",

            utcDate:
              match.utcDate,

            status:
              match.status,

            homeScore:
              score.fullTime?.home,

            awayScore:
              score.fullTime?.away,

            minute:
              match.minute ||
              null

          };

        }
      )
      .filter(Boolean)
      .sort(
        (a,b) =>
          new Date(
            a.utcDate
          ) -
          new Date(
            b.utcDate
          )
      );

  }


  function renderMatches() {

    if (
      !state.matches.length
    ) {

      DOM.matches.innerHTML =
        `
          <div class="no-data">
            لا توجد مباريات مسجلة لهذا اليوم.
          </div>
        `;

      DOM.ticker.innerHTML =
        `
          <div class="no-data">
            لا توجد مباريات.
          </div>
        `;

      return;

    }


    DOM.matches.innerHTML =
      state.matches
        .slice(0, 12)
        .map(
          matchWidgetHTML
        )
        .join("");


    DOM.ticker.innerHTML =
      state.matches
        .slice(0, 15)
        .map(
          matchTickerHTML
        )
        .join("");

  }


  function matchWidgetHTML(
    match
  ) {

    const status =
      matchStatus(
        match
      );

    return `

      <div class="widget-match">

        <div class="widget-match-top">

          <span class="widget-league">
            ${escapeHTML(
              match.competition
            )}
          </span>

          <span class="widget-time">
            ${escapeHTML(
              formatMoroccoTime(
                match.utcDate
              )
            )}
          </span>

        </div>

        <div class="widget-teams">

          <span class="widget-team">
            ${escapeHTML(
              match.home
            )}
          </span>

          <strong class="widget-score">
            ${
              match.homeScore !== undefined &&
              match.homeScore !== null
                ? `${match.homeScore} - ${match.awayScore}`
                : "VS"
            }
          </strong>

          <span class="widget-team">
            ${escapeHTML(
              match.away
            )}
          </span>

        </div>

        <div class="${status.className}"
             style="text-align:center;margin-top:6px;font-size:9px;font-weight:900;">
          ${status.text}
        </div>

      </div>

    `;

  }


  function matchTickerHTML(
    match
  ) {

    const status =
      matchStatus(
        match
      );

    return `

      <div class="ticker-card">

        <div class="ticker-league">
          ${escapeHTML(
            match.competition
          )}
        </div>

        <div class="ticker-teams">

          <span>
            ${escapeHTML(
              match.home
            )}
          </span>

          <strong class="ticker-score">
            ${
              match.homeScore !== undefined &&
              match.homeScore !== null
                ? `${match.homeScore}-${match.awayScore}`
                : formatMoroccoTime(
                    match.utcDate
                  ).replace(
                    " GMT+1",
                    ""
                  )
            }
          </strong>

          <span>
            ${escapeHTML(
              match.away
            )}
          </span>

        </div>

        <div class="match-status ${status.className}">
          ${status.text}
        </div>

      </div>

    `;

  }


  function matchStatus(
    match
  ) {

    const status =
      String(
        match.status ||
        ""
      ).toUpperCase();


    if (
      [
        "IN_PLAY",
        "PAUSED",
        "LIVE"
      ].includes(status)
    ) {

      return {

        text:
          "🔴 مباشر",

        className:
          "status-live"

      };

    }


    if (
      [
        "FINISHED",
        "AWARDED"
      ].includes(status)
    ) {

      return {

        text:
          "✓ انتهت",

        className:
          "status-finished"

      };

    }


    if (
      status ===
      "POSTPONED"
    ) {

      return {

        text:
          "تأجلت",

        className:
          "status-live"

      };

    }


    return {

      text:
        "⏱ لم تبدأ",

      className:
        "match-status"

    };

  }


  /* =======================================================
     BOTOLA FALLBACK
  ======================================================= */

  function getBotolaFallbackMatches() {

    /*
      لا ندعي أنها مباريات اليوم.
      هذه بيانات fallback فقط عند تعذر
      وجود API للبطولة.
    */

    return [];

  }


  /* =======================================================
     STANDINGS
  ======================================================= */

  async function loadStandings() {

    DOM.standings.innerHTML =
      loadingHTML();


    if (
      state.league ===
      "all"
    ) {

      DOM.standingsTitle.textContent =
        "اختر دوري";

      DOM.standings.innerHTML =
        `
          <div class="no-data">
            اختر أحد الدوريات لعرض جدول الترتيب.
          </div>
        `;

      return;

    }


    if (
      state.league ===
      "botola"
    ) {

      DOM.standingsTitle.textContent =
        "البطولة برو";

      renderStandings(
        getBotolaFallbackStandings()
      );

      return;

    }


    const leagueAPI =
      LEAGUES[
        state.league
      ]?.api;


    if (!leagueAPI) {

      DOM.standings.innerHTML =
        `
          <div class="no-data">
            لا يتوفر جدول ترتيب لهذا القسم.
          </div>
        `;

      return;

    }


    DOM.standingsTitle.textContent =
      LEAGUES[
        state.league
      ].name;


    try {

      const data =
        await apiFetch(
          "standings",
          leagueAPI
        );


      const table =
        extractStandings(
          data
        );


      renderStandings(
        table
      );

    } catch (error) {

      console.error(
        "Standings error:",
        error
      );

      DOM.standings.innerHTML =
        `
          <div class="no-data">
            تعذر تحميل جدول الترتيب حالياً.
          </div>
        `;

    }

  }


  function extractStandings(
    data
  ) {

    const standings =
      data?.standings ||
      [];

    /*
      Football-Data قد يرجع أكثر
      من جدول، نأخذ TOTAL.
    */

    const selected =
      standings.find(
        table =>
          table.type ===
          "TOTAL"
      ) ||
      standings[0];


    return (
      selected?.table ||
      []
    )
      .map(
        row => ({

          position:
            row.position,

          team:
            row.team?.name ||
            "",

          crest:
            row.team?.crest ||
            "",

          played:
            row.playedGames ??
            row.played ??
            0,

          points:
            row.points ??
            0,

          won:
            row.won ??
            0,

          draw:
            row.draw ??
            0,

          lost:
            row.lost ??
            0

        })
      );

  }


  function renderStandings(
    table
  ) {

    if (
      !table.length
    ) {

      DOM.standings.innerHTML =
        `
          <div class="no-data">
            لا توجد بيانات ترتيب متاحة.
          </div>
        `;

      return;

    }


    DOM.standings.innerHTML =
      table
        .slice(0, 20)
        .map(
          row => `

            <div class="standing-row">

              <span class="standing-position">
                ${escapeHTML(
                  row.position
                )}
              </span>

              <span class="standing-team">

                ${
                  row.crest
                    ? `
                      <img
                        class="team-crest"
                        src="${escapeHTML(row.crest)}"
                        alt=""
                        loading="lazy"
                        onerror="this.style.display='none'">
                    `
                    : ""
                }

                <span>
                  ${escapeHTML(
                    row.team
                  )}
                </span>

              </span>

              <span>
                ${escapeHTML(
                  row.played
                )}
              </span>

              <span class="standing-points">
                ${escapeHTML(
                  row.points
                )}
              </span>

            </div>

          `
        )
        .join("");

  }


  function getBotolaFallbackStandings() {

    /*
      فارغة عمداً بدلاً من اختراع
      ترتيب حالي غير مؤكد.
    */

    return [];

  }


  /* =======================================================
     TRENDING
  ======================================================= */

  function renderTrending(
    articles
  ) {

    const items =
      articles.slice(
        0,
        5
      );


    DOM.trending.innerHTML =
      items.length
        ? items
            .map(
              (article, index) => `

                <div
                  class="trending-item"
                  data-article-id="${escapeHTML(article.id)}">

                  <span class="trending-number">
                    ${index + 1}
                  </span>

                  <span class="trending-title">
                    ${escapeHTML(
                      article.title
                    )}
                  </span>

                </div>

              `
            )
            .join("")
        : `
          <div class="no-data">
            لا توجد أخبار.
          </div>
        `;

  }


  /* =======================================================
     VIDEOS
  ======================================================= */

  function renderVideos() {

    const videos = [

      {
        title:
          "آخر أخبار كرة القدم العالمية",
        image:
          FALLBACK_IMAGES[0]
      },

      {
        title:
          "أبرز مباريات كرة القدم",
        image:
          FALLBACK_IMAGES[1]
      },

      {
        title:
          "ملخص أهم الأحداث الرياضية",
        image:
          FALLBACK_IMAGES[2]
      }

    ];


    DOM.videos.innerHTML =
      videos
        .map(
          video => `

            <article class="video-card">

              <div class="video-thumb">

                <img
                  src="${video.image}"
                  alt="${escapeHTML(
                    video.title
                  )}"
                  loading="lazy">

                <div class="video-play">
                  ▶
                </div>

              </div>

              <div class="video-body">

                <h3>
                  ${escapeHTML(
                    video.title
                  )}
                </h3>

              </div>

            </article>

          `
        )
        .join("");

  }


  /* =======================================================
     LEAGUE SWITCH
  ======================================================= */

  async function switchLeague(
    league
  ) {

    if (
      !LEAGUES[league]
    ) {
      league =
        "all";
    }


    state.league =
      league;


    document
      .querySelectorAll(
        ".league-tab-btn"
      )
      .forEach(
        button => {

          button.classList.toggle(
            "active",
            button.dataset.league ===
            league
          );

        }
      );


    await Promise.all([
      loadMatches(),
      loadStandings()
    ]);


    renderNews();

  }


  /* =======================================================
     DATE SWITCH
  ======================================================= */

  async function switchDate(
    date
  ) {

    if (
      ![
        "yesterday",
        "today",
        "tomorrow"
      ].includes(date)
    ) {

      date =
        "today";

    }


    state.date =
      date;


    document
      .querySelectorAll(
        ".date-tab-btn"
      )
      .forEach(
        button => {

          button.classList.toggle(
            "active",
            button.dataset.date ===
            date
          );

        }
      );


    await loadMatches();

  }


  /* =======================================================
     EVENT DELEGATION
  ======================================================= */

  function setupEvents() {

    /*
      League navigation
    */

    document.addEventListener(
      "click",
      event => {

        const leagueButton =
          event.target.closest(
            "[data-league]"
          );

        if (
          leagueButton &&
          !leagueButton.dataset.share
        ) {

          const league =
            leagueButton.dataset.league;

          if (
            league
          ) {

            switchLeague(
              league
            );

          }

          return;

        }


        /*
          Date tabs
        */

        const dateButton =
          event.target.closest(
            "[data-date]"
          );

        if (dateButton) {

          switchDate(
            dateButton.dataset.date
          );

          return;

        }


        /*
          Article cards
        */

        const articleElement =
          event.target.closest(
            "[data-article-id]"
          );

        if (
          articleElement &&
          !event.target.closest(
            "button"
          )
        ) {

          openArticle(
            articleElement.dataset.articleId
          );

          return;

        }


        /*
          Back
        */

        if (
          event.target.closest(
            "#articleBackBtn"
          )
        ) {

          closeArticle();

          return;

        }


        /*
          Share
        */

        const shareButton =
          event.target.closest(
            "[data-share]"
          );

        if (shareButton) {

          const article =
            getCurrentArticle();

          if (article) {

            shareArticle(
              shareButton.dataset.share,
              article
            );

          }

        }

      }
    );


    /*
      Search
    */

    DOM.search.addEventListener(
      "input",
      event => {

        state.search =
          event.target.value;

        renderNews();

      }
    );


    /*
      Reset search
    */

    DOM.resetSearch.addEventListener(
      "click",
      () => {

        DOM.search.value =
          "";

        state.search =
          "";

        renderNews();

      }
    );


    /*
      Logo
    */

    document
      .getElementById(
        "homeLogo"
      )
      .addEventListener(
        "click",
        event => {

          if (
            window.location.hash
          ) {

            event.preventDefault();

            closeArticle();

          }

        }
      );


    /*
      Browser back/forward
    */

    window.addEventListener(
      "popstate",
      () => {

        handleHashRoute();

      }
    );


    window.addEventListener(
      "hashchange",
      () => {

        handleHashRoute();

      }
    );

  }


  function getCurrentArticle() {

    const match =
      window.location.hash.match(
        /^#article-(.+)$/
      );

    if (!match) {
      return null;
    }

    const id =
      decodeURIComponent(
        match[1]
      );

    return state.articles.find(
      article =>
        String(article.id) ===
        String(id)
    ) || null;

  }


  /* =======================================================
     ERROR BOUNDARY
  ======================================================= */

  window.addEventListener(
    "error",
    event => {

      console.error(
        "SPORT ZONE runtime error:",
        event.error ||
        event.message
      );

    }
  );


  window.addEventListener(
    "unhandledrejection",
    event => {

      console.error(
        "SPORT ZONE promise error:",
        event.reason
      );

    }
  );


  /* =======================================================
     PUBLIC CONTROLLER
  ======================================================= */

  window.szAppController = {

    switchLeague,

    switchDate,

    openArticle,

    closeSingleArticleView:
      closeArticle,

    refresh: async () => {

      await loadNews();
      await loadMatches();
      await loadStandings();

    }

  };


  /* =======================================================
     INITIALIZATION
  ======================================================= */

  async function init() {

    try {

      cacheDOM();

      setupEvents();

      renderVideos();

      /*
        الأخبار والمباريات والترتيب
        يتم تحميلهم بالتوازي.
      */

      await Promise.all([
        loadNews(),
        loadMatches(),
        loadStandings()
      ]);


      /*
        مهم للروابط:
        sportzon.biz/#article-xxxx
      */

      handleHashRoute();

    } catch (error) {

      console.error(
        "SPORT ZONE initialization error:",
        error
      );

      if (DOM.news) {

        DOM.news.innerHTML = `
          <div class="panel">
            <div class="no-data">
              وقع خطأ أثناء تحميل الموقع.
              حاول تحديث الصفحة.
            </div>
          </div>
        `;

      }

    }

  }


  /*
    تشغيل التطبيق بعد تحميل DOM
  */

  if (
    document.readyState ===
    "loading"
  ) {

    document.addEventListener(
      "DOMContentLoaded",
      init
    );

  } else {

    init();

  }


})();
