/* =========================================================
   SPORT ZONE - Final Direct Article Sync & API Standings
   ========================================================= */

(function () {
    "use strict";

    const API_KEY = "eba4f3dbffff48ff8dd42b3a8f11793b";
    const BASE_URL = "https://api.football-data.org/v4/";

    // 1. جلب الترتيب من الـ API
    async function loadStandings(competitionCode = "PD") {
        const container = document.getElementById('standingsTableBody');
        if (!container) return;

        try {
            const response = await fetch(`${BASE_URL}competitions/${competitionCode}/standings`, {
                headers: { "X-Auth-Token": API_KEY }
            });
            if (!response.ok) throw new Error("API error");
            const data = await response.json();

            if (!data.standings || !data.standings[0]) return;
            const table = data.standings[0].table;

            container.innerHTML = table.slice(0, 10).map((row, index) => `
                <div style="display: flex; justify-content: space-between; padding: 8px 4px; border-bottom: 1px solid rgba(255,255,255,0.05); align-items: center; font-size: 13px;">
                    <span style="width: 25px; text-align: center; color: #94a3b8;">${index + 1}</span>
                    <span style="display: flex; align-items: center; gap: 8px; flex: 1; color: #fff;">
                        <img src="${row.team.crest || ''}" alt="" style="width: 20px; height: 20px; object-fit: contain;" referrerpolicy="no-referrer">
                        <span style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 120px;">${row.team.name}</span>
                    </span>
                    <span style="width: 30px; text-align: center; color: #94a3b8;">${row.playedGames}</span>
                    <span style="width: 30px; text-align: center; color: #34d399; font-weight: bold;">${row.points}</span>
                </div>
            `).join('');
        } catch (e) {
            console.error("Standings error:", e);
        }
    }

    // 2. جلب وعرض المقالات من لوحة التحكم مباشرة
    function loadAdminArticles() {
        const container = document.getElementById('newsGridContainer');
        if (!container) return;

        let posts = [];

        // فحص شامل لكل الـ LocalStorage لالتقاط المقالات أينما وجدت
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const rawData = localStorage.getItem(key);
            try {
                const parsed = JSON.parse(rawData);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    // التحقق مما إذا كانت العناصر تحتوي على خصائص مقال
                    if (parsed[0].title || parsed[0].heading || parsed[0].content || parsed[0].body) {
                        posts = parsed;
                        break;
                    }
                }
            } catch (e) {}
        }

        if (posts.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #94a3b8; grid-column: span 2;">
                    <p style="margin-bottom: 15px;">لا توجد مقالات منشورة حالياً في الصفحة الرئيسية.</p>
                    <a href="admin.html" style="background: #06b6d4; color: #020617; padding: 10px 20px; border-radius: 8px; font-weight: bold; text-decoration: none;">إضافة مقال جديد من لوحة التحكم</a>
                </div>
            `;
            return;
        }

        container.innerHTML = posts.map(art => `
            <div style="background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                <img src="${art.image || art.img || art.imageUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80'}" style="width: 100%; height: 180px; object-fit: cover;" referrerpolicy="no-referrer">
                <div style="padding: 16px;">
                    <span style="font-size: 11px; color: #34d399; background: rgba(5, 150, 105, 0.2); padding: 2px 8px; border-radius: 4px;">${art.category || 'رياضة'}</span>
                    <h3 style="color: #fff; font-size: 16px; font-weight: bold; margin-top: 8px; line-height: 1.4;">${art.title || art.heading || ''}</h3>
                    <p style="color: #94a3b8; font-size: 13px; margin-top: 8px; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">${art.content || art.body || art.description || ''}</p>
                </div>
            </div>
        `).join('');
    }

    // تشغيل الدوال عند تحميل الصفحة والأزرار
    document.addEventListener('DOMContentLoaded', () => {
        loadStandings("PD");
        loadAdminArticles();

        const leagueMap = {
            "PD": "PD",
            "PL": "PL",
            "SA": "SA",
            "BL1": "BL1",
            "FL1": "FL1",
            "botola": "PD"
        };

        document.querySelectorAll('[data-league]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const leagueKey = e.currentTarget.getAttribute('data-league');
                document.querySelectorAll('[data-league]').forEach(b => b.classList.remove('active'));
                e.currentTarget.classList.add('active');

                if (leagueMap[leagueKey]) {
                    loadStandings(leagueMap[leagueKey]);
                }
            });
        });
    });

})();
