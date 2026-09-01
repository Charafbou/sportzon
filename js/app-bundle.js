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

  // 2. Load Admin Posts on Homepage (Direct Fix for Admin Sync)
    function loadAdminArticles() {
        const container = document.getElementById('newsGridContainer');
        if (!container) return;

        let posts = [];
        
        // البحث في المفاتيح المحتملة للوحة التحكم
        const keysToCheck = ['sz_sports_data_v5', 'sport_zone_posts', 'admin_posts', 'posts', 'articles', 'news'];
        
        for (let k of keysToCheck) {
            const data = localStorage.getItem(k);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        posts = parsed;
                        break;
                    }
                } catch(e) {}
            }
        }

        // إذا لم يتم العثور عليها بالطريقة السابقة، نبحث في كل تخزين المتصفح
        if (posts.length === 0) {
            for (let i = 0; i < localStorage.length; i++) {
                const keyName = localStorage.key(i);
                try {
                    const item = JSON.parse(localStorage.getItem(keyName));
                    if (Array.isArray(item) && item.length > 0 && (item[0].title || item[0].heading)) {
                        posts = item;
                        break;
                    }
                } catch(e) {}
            }
        }

        if (posts.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12 col-span-full text-slate-400">
                    <p class="mb-4">لا توجد مقالات منشورة حالياً في الصفحة الرئيسية.</p>
                    <a href="admin.html" class="bg-cyan-500 text-slate-950 font-bold px-6 py-2 rounded-xl">الذهاب لوحة التحكم لإضافة مقال</a>
                </div>
            `;
            return;
        }

        container.innerHTML = posts.map(art => `
            <div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow p-4 hover:border-cyan-500 transition">
                <img src="${art.image || art.img || 'https://via.placeholder.com/400x200'}" class="w-full h-40 object-cover rounded-lg mb-3" referrerpolicy="no-referrer">
                <span class="text-xs text-cyan-400 bg-cyan-950 px-2 py-1 rounded">${art.category || 'رياضة'}</span>
                <h3 class="text-white font-bold text-base mt-2">${art.title || art.heading || ''}</h3>
                <p class="text-slate-400 text-xs mt-2 line-clamp-2">${art.content || art.body || ''}</p>
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
