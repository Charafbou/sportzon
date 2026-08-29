/* =========================================================
   SPORT ZONE - Football Data API Proxy
   Vercel Serverless Function
   ========================================================= */

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const type = typeof req.query?.type === "string" ? req.query.type : "";
    const league = typeof req.query?.league === "string" ? req.query.league.toUpperCase() : "PL";
    const date = typeof req.query?.date === "string" ? req.query.date : "";
    const dateFrom = typeof req.query?.dateFrom === "string" ? req.query.dateFrom : "";
    const dateTo = typeof req.query?.dateTo === "string" ? req.query.dateTo : "";

    const allowedLeagues = [
  "PL",
  "PD",
  "SA",
  "BL1",
  "FL1",
  "CL"
];
    if (!allowedLeagues.includes(league)) {
      return res.status(400).json({ error: "Invalid league", allowedLeagues });
    }

    const token = process.env.FOOTBALL_DATA_TOKEN || "eba4f3dbffff48ff8dd42b3a8f11793b";

    let endpoint = "";

    if (type === "matches") {
      if (date) {
        endpoint = `competitions/${league}/matches?dateFrom=${date}&dateTo=${date}`;
      } else if (dateFrom && dateTo) {
        endpoint = `competitions/${league}/matches?dateFrom=${dateFrom}&dateTo=${dateTo}`;
      } else {
        endpoint = `competitions/${league}/matches`;
      }
    } else if (type === "standings") {
      endpoint = `competitions/${league}/standings`;
    } else {
      return res.status(400).json({ error: "Invalid type. Use matches or standings." });
    }

    const apiUrl = `https://api.football-data.org/v4/${endpoint}`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Auth-Token": token,
        "Accept": "application/json"
      }
    });

    const text = await response.text();
    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch (parseError) {
      return res.status(502).json({ error: "Invalid JSON response from Football-Data API" });
    }

    if (!response.ok) {
      return res.status(response.status).json({
        error: "Football-Data API request failed",
        status: response.status,
        details: data
      });
    }

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch football data", details: error.message });
  }
}
