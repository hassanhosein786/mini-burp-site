# Mini Burp Suite

Mini Burp Suite is a local full-stack MVP for authorized defensive web application testing. It crawls a single allowed host, records pages in MongoDB, runs passive checks plus limited non-destructive active checks, and shows results in a React dashboard.

## Ethics statement

This tool is intended only for systems you own or have explicit permission to assess. The MVP keeps active checks non-destructive, avoids exploit delivery, credential attacks, and destructive actions, and stays within the original target host.

## Tech stack

- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Node.js, Express, Axios, Cheerio
- Database: MongoDB with Mongoose

## Features

- Monorepo with `client/` and `server/`
- Queue-based crawler with visited-set tracking
- URL normalization and same-host enforcement
- Skips logout routes, file downloads, and destructive-looking paths
- Passive checks for security headers and cookie flags
- Discovery checks for `robots.txt` and `sitemap.xml`
- Insecure password form detection on non-HTTPS pages
- Limited reflected input detection using a harmless marker string only
- MongoDB persistence for scans, pages, and findings
- Responsive dashboard with summaries, charts, filtering, and detail views

## API endpoints

- `POST /api/scans/start`
- `GET /api/scans/:id`
- `GET /api/scans/:id/pages`
- `GET /api/scans/:id/findings`
- `GET /api/scans/:id/summary`

## Local setup

```bash
npm run install:all
```

Copy `server/.env.example` to `server/.env`, start MongoDB locally, then run:

```bash
npm run dev:server
npm run dev:client
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Future improvements

- Job queue and worker separation
- Per-scan rate limiting and polite crawl delays
- Historical scan listing and exportable reports
- Better grouping, deduplication, and live progress streaming
