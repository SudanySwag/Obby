export default function handler(req, res) {
  const baseUrl = `https://${req.headers.host}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Debriefer API</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #0f172a;
      color: #e2e8f0;
      min-height: 100vh;
      padding: 2rem;
    }
    .container { max-width: 720px; margin: 0 auto; }
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #f8fafc;
    }
    .subtitle {
      color: #94a3b8;
      margin-bottom: 2.5rem;
      font-size: 1.1rem;
    }
    .endpoint {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 8px;
      padding: 1.25rem;
      margin-bottom: 1rem;
      transition: border-color 0.2s;
    }
    .endpoint:hover { border-color: #60a5fa; }
    .endpoint-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 0.5rem;
    }
    .method {
      background: #166534;
      color: #4ade80;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.05em;
    }
    .path a {
      color: #60a5fa;
      text-decoration: none;
      font-family: 'SF Mono', 'Fira Code', monospace;
      font-size: 0.95rem;
    }
    .path a:hover { text-decoration: underline; }
    .description { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; }
    .schedule {
      display: inline-block;
      margin-top: 0.5rem;
      background: #1e1b4b;
      color: #a5b4fc;
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-family: monospace;
    }
    .section-title {
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      margin-bottom: 0.75rem;
      margin-top: 1.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Debriefer API</h1>
    <p class="subtitle">Alexa Briefing System &mdash; automated daily briefings and check-ins</p>

    <div class="section-title">Scheduled Endpoints</div>

    <div class="endpoint">
      <div class="endpoint-header">
        <span class="method">GET</span>
        <span class="path"><a href="${baseUrl}/api/morning-briefing">/api/morning-briefing</a></span>
      </div>
      <p class="description">
        Fetches daily notes and current projects from GitHub, grabs the workout of the day,
        generates an AI briefing via Gemini, and announces it on Alexa.
      </p>
      <span class="schedule">cron: 0 12 * * * (daily at 12:00 UTC)</span>
    </div>

    <div class="endpoint">
      <div class="endpoint-header">
        <span class="method">GET</span>
        <span class="path"><a href="${baseUrl}/api/evening-checkin">/api/evening-checkin</a></span>
      </div>
      <p class="description">
        Fetches daily notes and current projects from GitHub, generates a reflective
        evening check-in via Gemini, and announces it on Alexa.
      </p>
      <span class="schedule">cron: 0 2 * * * (daily at 02:00 UTC)</span>
    </div>

    <div class="section-title">Utility Endpoints</div>

    <div class="endpoint">
      <div class="endpoint-header">
        <span class="method">GET</span>
        <span class="path"><a href="${baseUrl}/api/notes">/api/notes</a></span>
      </div>
      <p class="description">
        Lists GitHub repository contents including root structure, MAIN.md,
        Projects folder, and In Progress items.
      </p>
    </div>
  </div>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(html);
}
