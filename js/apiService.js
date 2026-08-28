/* ==========================================
   SPORT ZONE - Dedicated Football & Sports RSS Service
   Using Exact Football Search Endpoint + Smart Sports Filter
   ========================================== */

import {
  MOCK_TICKER_NEWS,
  MOCK_NEWS,
  MOCK_MATCHES,
  MOCK_STANDINGS,
  MOCK_VIDEOS
} from './mockData.js';

const STORAGE_KEY = 'sz_sports_data_v5';

// DEDICATED FOOTBALL & SPORTS RSS ENDPOINT
const RSS_API_ENDPOINT = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3D%D9%83%D8%B1%D8%A9%2B%D8%A7%D9%84%D9%82%D8%AF%D9%85%26hl%3Dar%26gl%3DMA%26ceid%3DMA%3Aar";
// SMART SPORTS & FOOTBALL KEYWORDS FOR MANDATORY FILTERING
const SPORTS_KEYWORDS = [
  "كرة", "قدم", "رياضة", "نادي", "فريق", "مباراة", "دوري", "لاعب", "هدف", "كأس",
  "أبطال", "مدريد", "برشلونة", "ليفربول", "الأهلي", "الزمالك", "صلاح", "منتخب",
  "فيفا", "caf", "uefa", "موندو", "البريميرليج", "الليغا", "الكالتشيو", "سيتي",
  "بايرن", "باريس", "الهلال", "النصر", "الركراكي", "تشيلسي", "أرسنال", "مانشستر"
];

export class SportsApiService {
  constructor() {
    this.liveNewsCache = null;
    this.lastFetchTime = 0;
    this.data = this._loadState();
  }

  _loadState() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse localStorage data", e);
      }
    }
    return {
      ticker: [...MOCK_TICKER_NEWS],
      news: [...MOCK_NEWS],
      matches: [...MOCK_MATCHES],
      standings: MOCK_STANDINGS,
      videos: MOCK_VIDEOS
    };
  }

  _saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  /**
   * Smart Sports Filter: Verify title or summary contains sports keywords
   */
  _isSportsRelated(title, summary) {
    const text = (title + " " + summary).toLowerCase();
    return SPORTS_KEYWORDS.some(kw => text.includes(kw));
  }

  /**
   * Async/Await Data Fetcher for Pure Live Football & Sports News
   */
  async fetchLiveSportsNews() {
    // Cache for 2 minutes
    if (this.liveNewsCache && (Date.now() - this.lastFetchTime < 120000)) {
      return this.liveNewsCache;
    }

    try {
      const response = await fetch(RSS_API_ENDPOINT);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const json = await response.json();

      if (json && json.status === 'ok' && Array.isArray(json.items) && json.items.length > 0) {
        const fallbackFootballImages = [
          "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80",
          "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=800&q=80"
        ];

        // Filter and map sports items strictly
        const sportsItems = json.items.filter(item => 
          this._isSportsRelated(item.title || "", item.description || "")
        );

        const itemsToUse = sportsItems.length > 0 ? sportsItems : json.items;

        const curatedNews = itemsToUse.map((item, index) => {
          let imageUrl = item.thumbnail || (item.enclosure && item.enclosure.link);
          if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '' || imageUrl.includes('placeholder')) {
            imageUrl = fallbackFootballImages[index % fallbackFootballImages.length];
          }

          const rawDescription = item.description || item.content || "";
          const cleanDesc = rawDescription.replace(/<[^>]*>?/gm, '').trim();
          const sourceName = item.author || (json.feed && json.feed.title) || "أخبار كرة القدم والرياضة";

          return {
            id: 'sports-rss-' + index + '-' + Date.now(),
            title: item.title,
            summary: cleanDesc ? (cleanDesc.length > 150 ? cleanDesc.slice(0, 150) + '...' : cleanDesc) : item.title,
            content: cleanDesc || item.title,
            category: "كرة القدم والرياضة",
            categorySlug: "premier",
            image: imageUrl,
            author: sourceName,
            date: this._formatArabicDate(item.pubDate),
            readTime: "3 دقائق",
            views: Math.floor(Math.random() * 14000) + 4000,
            sourceUrl: item.link, // DIRECT ORIGINAL NEWS LINK (opens in new tab)
            isHero: index === 0,
            isTrending: index < 4,
            isMostRead: index < 5,
            comments: []
          };
        });

        this.liveNewsCache = curatedNews;
        this.lastFetchTime = Date.now();
       // الحفاظ على المنشورات اليدوية وإبقاؤها دائماً في أعلى الموقع
const manualPosts = (this.data.news || []).filter(item => item.id && item.id.startsWith('manual-'));
this.data.news = [...manualPosts, ...curatedNews];
        this._saveState();

        return curatedNews;
      }
    } catch (error) {
      console.warn("Live Dedicated Sports RSS Fetching error, using Fallback Data safely:", error);
    }

    return this.data.news && this.data.news.length > 0 ? this.data.news : MOCK_NEWS;
  }

  _formatArabicDate(dateString) {
    if (!dateString) return "اليوم";
    try {
      const pub = new Date(dateString);
      if (isNaN(pub.getTime())) return "اليوم";
      
      const now = new Date();
      const diffMs = now - pub;
      const diffMin = Math.floor(diffMs / (1000 * 60));

      if (diffMin < 60) {
        return `منذ ${Math.max(diffMin, 2)} دقيقة`;
      }
      
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) {
        return `منذ ${diffHours} ساعات`;
      }

      const options = { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return pub.toLocaleDateString('ar-EG', options);
    } catch (e) {
      return "اليوم";
    }
  }

  async getTickerNews() {
    return this.data.ticker;
  }

  async getHeroArticle() {
    const news = await this.getNews();
    return news.find(n => n.isHero) || news[0];
  }

  async getNews(categorySlug = null) {
    const liveNews = await this.fetchLiveSportsNews();
    if (!categorySlug || categorySlug === 'all' || categorySlug === 'home') {
      return liveNews;
    }
    return liveNews.filter(n => n.categorySlug === categorySlug || n.category.includes(categorySlug));
  }

  async getArticleById(id) {
    const news = await this.getNews();
    return news.find(n => n.id === id) || news[0];
  }

  async getMatches(filter = {}) {
    let result = [...this.data.matches];
    if (filter.status) {
      result = result.filter(m => m.status === filter.status);
    }
    return result;
  }

  async getMatchById(id) {
    return this.data.matches.find(m => m.id === id) || this.data.matches[0];
  }

  async getStandings(leagueKey = 'premier') {
    return this.data.standings[leagueKey] || this.data.standings['premier'];
  }

  async getMostReadNews() {
    const news = await this.getNews();
    return news.slice(0, 5);
  }

  async getVideos() {
    return this.data.videos;
  }

  async search(query) {
    const news = await this.getNews();
    if (!query || query.trim() === '') return { news: [], teams: [], players: [] };
    const q = query.trim().toLowerCase();
    
    const matchedNews = news.filter(n => 
      n.title.toLowerCase().includes(q) || 
      n.summary.toLowerCase().includes(q)
    );

    return { news: matchedNews, teams: [], players: [] };
  }
}

export const sportsApi = new SportsApiService();
