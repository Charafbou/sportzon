/* =========================================================
   SPORT ZONE - Combined Clean Script (API Standings + Admin Posts)
   API Key: eba4f3dbffff48ff8dd42b3a8f11793b
   ========================================================= */

(function () {
    "use strict";

    const API_KEY = "eba4f3dbffff48ff8dd42b3a8f11793b";
    const BASE_URL = "https://api.football-data.org/v4/";

    // League Codes mapping
    const leagues = {
        "الدوري الإنجليزي": "PL",
        "الدوري الإسباني": "PD",
        "الدوري الإيطالي": "SA",
        "الدوري الألماني": "BL1",
        "الدوري الفرنسي": "FL1"
    };

    async function fetchFootballData(endpoint) {
        try {
            const response = await fetch(BASE_URL + endpoint, {
                headers: { "X-Auth-Token": API_KEY }
            });
            if (!response.ok) throw new Error("Network response was not ok");
            return await response.json();
        } catch (error) {
            console.error("API Fetch Error:", error);
            return null;
        }
    }

    // 1. Load Standings for selected league from API
    window.loadStandings = async function(leagueName = "الدوري الإسباني") {
        const code = leagues[leagueName] || "PD";
        const data = await fetchFootballData(`competitions/${code}/standings`);
        
        const container = document.getElementById('standingsTableBody');
        if (!container) return;

        if (!data || !data.standings) {
            container.innerHTML = `<tr><td colspan="3" class="text-center py-4 text-slate-400">تعذر جلب الترتيب الحالي</td></tr>`;
            return;
        }

        const table = data.standings[0].table;
        container.innerHTML = table.map((row, index) => `
            <tr class="border-b border-slate-800/50 hover:bg-slate-800/30">
                <td class="py-3 px-2 text-center text-slate-300 font-bold">${index + 1}</td>
                <td class="py-3 px-2 flex items-center gap-2 text-white">
                    <img src="${row.team.crest}" alt="" style="width:24px; height:24px; object-fit:contain;" referrerpolicy="no-referrer">
                    <span>${row.team.name}</span>
                </td>
                <td class="py-3 px-2 text-center text-emerald-400 font-bold">${row.points}</td>
            </tr>
        `).join('');
    };

    // 2. Load Admin Posts on Homepage
  // 2. Load Admin Posts on Homepage (Enhanced to scan all LocalStorage)
    function loadAdminArticles() {
        const container = document.getElementById('newsGridContainer');
        if (!container) return;

        let posts = [];
        
        // فحص كل المفاتيح المحتملة في التخزين المحلي
        const possibleKeys = ['sz_sports_data_v5', 'sport_zone_posts', 'admin_posts', 'posts', 'articles', 'news_data'];
        
        for (let key of possibleKeys) {
            try {
                const data = localStorage.getItem(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        posts = parsed;
                        console.log("Found posts in key:", key);
                        break;
                    } else if (parsed && typeof parsed === 'object') {
                        // لو كان الكائن يحتوي على مصفوفة بداخله
                        const values = Object.values(parsed);
                        for (let val of values) {
                            if (Array.isArray(val) && val.length > 0) {
                                posts = val;
                                break;
                            }
                        }
                    }
                }
            } catch(e) {
                console.error("Error reading key:", key, e);
            }
        }

        // إذا لم يتم العثور على مقالات، فحص جميع مفاتيح الـ LocalStorage عشوائياً
        if (posts.length === 0) {
            for (let i = 0; i < localStorage.length; i++) {
                const keyName = localStorage.key(i);
                try {
                    const item = JSON.parse(localStorage.getItem(keyName));
                    if (Array.isArray(item) && item.length > 0 && (item[0].title || item[0].content)) {
                        posts = item;
                        console.log("Found posts in dynamic key:", keyName);
                        break;
                    }
                } catch(e) {}
            }
        }

        if (posts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 col-span-full">
                    <p class="text-slate-400 mb-4">لا توجد مقالات منشورة حالياً في الصفحة الرئيسية.</p>
                    <a href="admin.html" class="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl transition">الذهاب لوحة التحكم لإضافة مقال</a>
                </div>
            `;
            return;
        }

        container.innerHTML = posts.map(art => `
            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow">
                <img src="${art.image || 'https://via.placeholder.com/400x200'}" class="w-full h-40 object-cover" referrerpolicy="no-referrer">
                <div class="p-4">
                    <span class="text-xs text-cyan-400 bg-cyan-950 px-2 py-1 rounded">${art.category || 'عام'}</span>
                    <h3 class="text-white font-bold text-base mt-2">${art.title || art.heading || 'بدون عنوان'}</h3>
                    <p class="text-slate-400 text-xs mt-2 line-clamp-2">${art.content || art.body || ''}</p>
                </div>
            </div>
        `).join('');
    }
    // Initialize on load
    document.addEventListener('DOMContentLoaded', () => {
        loadStandings("الدوري الإسباني");
        loadAdminArticles();

        // Bind league tabs click
        document.querySelectorAll('nav button, .nav-link').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const name = e.target.innerText.trim();
                if (leagues[name]) {
                    loadStandings(name);
                }
            });
        });
    });

})();
