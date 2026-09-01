<!DOCTYPE html>
<html lang="ar" dir="rtl" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>SPORT ZONE | أخبار الرياضة ومباريات اليوم</title>

  <meta name="description"
        content="SPORT ZONE - أخبار كرة القدم، مباريات اليوم، النتائج المباشرة وترتيب أهم الدوريات العالمية والبطولة المغربية.">

  <meta name="keywords"
        content="رياضة, كرة القدم, مباريات اليوم, البطولة المغربية, الدوري الإسباني, الدوري الإنجليزي, الدوري الإيطالي, الدوري الألماني, الدوري الفرنسي, دوري أبطال أوروبا">

  <meta name="robots" content="index,follow">

  <meta property="og:type" content="article">
  <meta property="og:title" content="SPORT ZONE | أخبار الرياضة">
  <meta property="og:description"
        content="آخر أخبار كرة القدم ونتائج وترتيب المباريات والدوريات.">
  <meta property="og:url" content="https://sportzon.biz/">
  <meta property="og:image"
        content="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80">

  <link rel="icon"
        href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚽</text></svg>">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap"
        rel="stylesheet">

  <link rel="stylesheet" href="./css/style.css">
</head>

<body>

<!-- =====================================================
     TOP BAR
===================================================== -->

<div class="top-bar">

  <div class="container top-bar-inner">

    <div class="top-left">

      <span class="live-indicator">
        <span class="live-dot"></span>
        LIVE
      </span>

      <span class="morocco-time">
        🇲🇦 توقيت المغرب GMT+1
      </span>

    </div>

    <div class="top-right">

      <div class="mini-leagues">

        <button data-league="botola">🇲🇦</button>
        <button data-league="PD">🇪🇸</button>
        <button data-league="PL">🏴</button>
        <button data-league="SA">🇮🇹</button>
        <button data-league="BL1">🇩🇪</button>
        <button data-league="FL1">🇫🇷</button>
        <button data-league="CL">🏆</button>

      </div>

      <div class="search-wrapper">

        <input
          id="searchInput"
          type="search"
          autocomplete="off"
          placeholder="ابحث عن خبر..."
        >

        <span>🔍</span>

      </div>

    </div>

  </div>

</div>


<!-- =====================================================
     HEADER
===================================================== -->

<header class="site-header">

  <div class="container header-inner">

    <a href="./index.html"
       class="brand"
       id="homeLogo">

      <div class="brand-icon">
        SZ
      </div>

      <div>

        <div class="brand-title">
          SPORT <span>ZONE</span>
        </div>

        <div class="brand-subtitle">
          المنصة الرياضية العربية
        </div>

      </div>

    </a>

    <div class="header-info">

      <strong>⚽ تغطية رياضية مباشرة</strong>

      <span>
        أخبار • نتائج • ترتيب • مباريات
      </span>

    </div>

  </div>

</header>


<!-- =====================================================
     NAVIGATION
===================================================== -->

<nav class="main-nav">

  <div class="container">

    <div id="leagueNavContainer" class="league-nav">

      <button
        class="league-tab-btn active"
        data-league="all">
        🏠 الرئيسية
      </button>

      <button
        class="league-tab-btn"
        data-league="botola">
        🇲🇦 البطولة برو
      </button>

      <button
        class="league-tab-btn"
        data-league="PD">
        🇪🇸 الدوري الإسباني
      </button>

      <button
        class="league-tab-btn"
        data-league="PL">
        🏴 الدوري الإنجليزي
      </button>

      <button
        class="league-tab-btn"
        data-league="SA">
        🇮🇹 الدوري الإيطالي
      </button>

      <button
        class="league-tab-btn"
        data-league="BL1">
        🇩🇪 الدوري الألماني
      </button>

      <button
        class="league-tab-btn"
        data-league="FL1">
        🇫🇷 الدوري الفرنسي
      </button>

      <button
        class="league-tab-btn"
        data-league="CL">
        🏆 دوري أبطال أوروبا
      </button>

    </div>

  </div>

</nav>


<!-- =====================================================
     MATCH TICKER
===================================================== -->

<section class="match-strip">

  <div class="container">

    <div
      id="tickerMatchesContainer"
      class="ticker-container">

      <!-- JS -->

    </div>

  </div>

</section>


<!-- =====================================================
     MAIN
===================================================== -->

<main class="container main-container">


  <!-- ===================================================
       SINGLE ARTICLE
  ==================================================== -->

  <section
    id="singleArticleView"
    class="single-article-view"
    style="display:none;">

    <!-- JS -->

  </section>


  <!-- ===================================================
       HOME
  ==================================================== -->

  <section id="mainHomeView">


    <!-- SEARCH NOTICE -->

    <div
      id="searchNoticeBar"
      class="search-notice hidden">

      <span id="searchNoticeText"></span>

      <button id="resetSearchBtn">
        إلغاء البحث ✕
      </button>

    </div>


    <div class="main-grid">


      <!-- ===============================================
           SIDEBAR
      ================================================ -->

      <aside class="sidebar">


        <!-- MATCH CENTER -->

        <section class="panel">

          <div class="panel-header">

            <h2>
              📅 أهم المباريات
            </h2>

            <div
              id="dateTabsContainer"
              class="date-tabs">

              <button
                class="date-tab-btn"
                data-date="yesterday">
                أمس
              </button>

              <button
                class="date-tab-btn active"
                data-date="today">
                اليوم
              </button>

              <button
                class="date-tab-btn"
                data-date="tomorrow">
                الغد
              </button>

            </div>

          </div>

          <div
            id="todayMatchesWidget"
            class="matches-widget">

            <!-- JS -->

          </div>

        </section>


        <!-- STANDINGS -->

        <section class="panel">

          <div class="panel-header">

            <h2>
              📊 الترتيب
            </h2>

            <span
              id="currentLeagueStandingsTitle"
              class="league-title">
              الرئيسية
            </span>

          </div>

          <div id="standingsTableContainer">

            <div class="standings-head">

              <span>#</span>
              <span>الفريق</span>
              <span>لعب</span>
              <span>نقاط</span>

            </div>

            <div
              id="standingsTableBody">
              <!-- JS -->
            </div>

          </div>

        </section>


        <!-- TRENDING -->

        <section class="panel">

          <div class="panel-header">

            <h2>
              🔥 الأكثر قراءة
            </h2>

          </div>

          <div
            id="trendingNewsWidget">
            <!-- JS -->
          </div>

        </section>

      </aside>


      <!-- ===============================================
           NEWS
      ================================================ -->

      <section class="news-column">


        <!-- HERO -->

        <div id="heroArticleContainer">

          <!-- JS -->

        </div>


        <!-- NEWS GRID -->

        <div
          id="newsGridContainer"
          class="news-grid">

          <!-- JS -->

        </div>


      </section>

    </div>


    <!-- ===============================================
         VIDEOS
    ================================================ -->

    <section
      id="videos"
      class="videos-section">

      <div class="section-title">

        <h2>
          🎬 آخر الفيديوهات
        </h2>

        <span>
          تغطية رياضية
        </span>

      </div>

      <div
        id="videosContainer"
        class="videos-grid">

        <!-- JS -->

      </div>

    </section>


  </section>

</main>


<!-- =====================================================
     FOOTER
===================================================== -->

<footer class="footer">

  <div class="container">

    <div class="footer-main">

      <div>

        <strong>
          SPORT ZONE
        </strong>

        <p>
          منصتك الرياضية لمتابعة أخبار كرة القدم والمباريات والنتائج.
        </p>

      </div>

      <div class="footer-links">

        <a href="./privacy.html">
          سياسة الخصوصية
        </a>

        <a href="./terms.html">
          الشروط والأحكام
        </a>

        <a href="./about.html">
          من نحن
        </a>

        <a href="./contact.html">
          اتصل بنا
        </a>

      </div>

    </div>

    <div class="footer-bottom">

      © 2026 SPORT ZONE - sportzon.biz

    </div>

  </div>

</footer>


<!-- TOAST -->

<div
  id="szToast"
  class="toast">
</div>


<!-- APP -->

<script
  src="./js/app.js"
  defer>
</script>

</body>
</html>
