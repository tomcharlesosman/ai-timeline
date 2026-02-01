# AI Timeline - Task Board

**Rule:** On every heartbeat, pick one task from "Next Up" and execute it. Then mark it complete.

---

## Revenue & Monetization Tasks (Priority)

### Immediate Revenue (1-10)
1. [ ] **Set up affiliate links** for AI tools/courses in newsletter
2. [ ] **Add sponsor/ad slots** to timeline website (3 slots: header, sidebar, inline)
3. [ ] **Create paid API tier** - $49/mo for 10K requests, $199/mo for 100K
4. [ ] **Launch premium newsletter** - $10/mo for daily + analysis
5. [ ] **Add job board** - $299/post for AI roles, companies pay to list
6. [ ] **Create sponsorship packages** - $500/wk for newsletter mentions
7. [ ] **Set up Buy Me a Coffee / Patreon** for supporters
8. [ ] **Launch AI consulting directory** - take 10% commission on referrals
9. [x] **Sell dataset exports** - $99 for CSV of full timeline data (2026-01-31)
10. [ ] **Create white-label timeline** - $500/mo for enterprise licensing

### Growth Revenue (11-20)
11. [ ] **Add course recommendations** with affiliate cuts
12. [ ] **Launch "AI Deals" section** - aggregate tool discounts, take commission
13. [ ] **Create investor research reports** - $199/mo for VC/firm access
14. [ ] **Build Chrome extension** - freemium with pro features
15. [ ] **Add event calendar** - charge for featured listings
16. [ ] **Launch "Trends Pro" dashboard** - $29/mo for analytics
17. [ ] **Create AI vendor comparison tool** - sponsored placements
18. [ ] **Sell branded content** - $2K per sponsored deep-dive
19. [ ] **Add lead gen for AI agencies** - sell qualified leads
20. [ ] **Launch grant/funding tracker** - charge startups for visibility

---

## Next Up (Ready to Execute)

### This Week
- [x] 21. Migrate updates.json to PostgreSQL database (2026-02-01) — SQLite for local, PostgreSQL for production, npm run migrate
- [x] 22. Add dark mode toggle to UI (2026-01-31)
- [x] 23. Set up Google Analytics 4 tracking
- [x] 24. Create RSS feed for timeline entries
- [x] 25. Add search functionality (2026-01-31)
- [x] 26. Implement filtering by category/company/date (2026-01-31)
- [x] 27. Add email subscription for weekly digest (2026-01-31)
- [x] 28. Create staging environment on Vercel (2026-01-31) — Branch: `staging`, Preview deploys enabled
- [x] 29. Set up automated testing pipeline (2026-01-31) — Jest + React Testing Library + GitHub Actions
- [x] 30. Add backup/restore system for data (2026-01-31) — npm run backup / npm run restore

### Next Week
- [x] 31. Add infinite scroll pagination (2026-01-31) — 10 items per page, IntersectionObserver, loading indicator
- [x] 32. Create mobile responsive improvements (2026-01-31) — Responsive padding, touch targets, mobile typography
- [x] 33. Add social sharing buttons per entry (2026-01-31) — Twitter, LinkedIn, Copy link
- [x] 34. Implement "On this day in AI" feature (2026-01-31) — Shows historical events from today's date
- [x] 35. Create embeddable widget for other sites (2026-01-31) — iframe widget + documentation
- [x] 36. Add keyboard shortcuts for navigation (2026-01-31) — / for search, d for dark mode, j/k navigation
- [x] 37. Implement PWA for offline reading (2026-01-31) — Manifest, service worker, offline cache
- [x] 38. Create printable timeline view (2026-01-31) — Print-optimized page at /print with A4 layout, auto-print dialog
- [x] 39. Add timeline zoom (day/week/month/year) (2026-01-31) — Day/Week/Month/Year selector in filter bar
- [x] 40. Create visual timeline (horizontal scrolling) (2026-01-31) — Interactive horizontal timeline at /visual with year filter

---

## Backlog (100 Total Tasks)

### Data Collection (41-55)
- [x] 41. Add RSS feed ingestion for 50+ AI blogs (2026-02-01) — npm run fetch-rss, 50+ sources configured
- [x] 42. Scrape arXiv CS.AI daily for new papers (2026-02-01) — npm run fetch-arxiv, 6 categories (cs.AI, cs.LG, cs.CL, cs.CV, cs.NE, stat.ML)
43. [ ] Monitor OpenAI blog/announcements page
44. [ ] Monitor Anthropic research blog
45. [ ] Monitor Google DeepMind publications
46. [ ] Monitor Meta AI research
47. [ ] Add Twitter/X monitoring for AI researcher accounts
48. [ ] Add YouTube transcript extraction for AI channels
49. [ ] Monitor GitHub trending repos for AI projects
50. [ ] Scrape Papers with Code for benchmarks
51. [ ] Add Hacker News AI tag monitoring
52. [ ] Monitor Reddit r/MachineLearning, r/LocalLLaMA
53. [ ] Add Discord bot for AI server announcements
54. [ ] Monitor Product Hunt for AI launches
55. [ ] Scrape Crunchbase for AI funding rounds

### Data Quality (56-70)
56. [ ] Implement duplicate detection algorithm
57. [ ] Add source credibility scoring
58. [ ] Create fact-checking pipeline
59. [ ] Implement automatic categorization
60. [ ] Add sentiment analysis for market news
61. [ ] Create image thumbnail generation for each entry
62. [ ] Add automatic summarization for long articles
63. [ ] Implement entity extraction (companies, people, models)
64. [ ] Add timeline conflict detection
65. [ ] Create "related stories" linking system
66. [ ] Implement automatic URL archiving
67. [ ] Add multi-language support and translation
68. [ ] Create confidence scoring for each entry
69. [ ] Add user voting/rating system for entries
70. [ ] Implement automatic source verification

### Technical Infrastructure (71-85)
71. [ ] Add GraphQL API layer
72. [ ] Implement caching layer (Redis)
73. [ ] Add full-text search (Elasticsearch/Algolia)
74. [ ] Create webhook system for real-time updates
75. [ ] Implement serverless functions for processing
76. [ ] Add CDN for static assets
77. [ ] Implement rate limiting for API
78. [ ] Add authentication system for admin
79. [ ] Add monitoring/alerting (Sentry, Uptime)
80. [ ] Create data export functionality (CSV, JSON)
81. [ ] Implement CI/CD pipeline improvements
82. [ ] Add Slack/Discord bot for team notifications
83. [ ] Create Notion integration for team wiki
84. [ ] Add Google Sheets sync for collaborators
85. [ ] Create n8n/Zapier workflow support

### Community & Growth (86-100)
86. [ ] Create contributor leaderboard
87. [ ] Add GitHub Issues template for submissions
88. [ ] Implement referral program
89. [ ] Add "submit a correction" feature
90. [ ] Implement crowdsourced translation
91. [ ] Create annual "Year in AI" report
92. [ ] Launch podcast/video series about timeline stories
93. [ ] Add commenting system per entry
94. [ ] Create "story mode" (curated narratives)
95. [ ] Add trends dashboard (model releases over time)
96. [ ] Implement company activity scoring
97. [ ] Add market sentiment tracking
98. [ ] Create funding round visualization
99. [ ] Implement "hot topics" word cloud
100. [ ] Create benchmark comparison charts

---

## Revenue Targets

### Q1 2026 Goals
- **MRR Target:** $5,000
- **API Subscribers:** 20 paying customers
- **Newsletter Subscribers:** 5,000 (10% paid conversion = $5K/mo)
- **Sponsors:** 2 recurring at $500/week = $4K/mo
- **Job Board:** 10 postings at $299 = $3K

### Revenue Streams Breakdown
| Stream | Target | Status |
|--------|--------|--------|
| Premium Newsletter | $5,000/mo | Not started |
| API Access | $2,000/mo | Not started |
| Sponsorships | $4,000/mo | Not started |
| Job Board | $1,000/mo | Not started |
| Affiliate/Deals | $500/mo | Not started |
| **Total Target** | **$12,500/mo** | **In Progress** |

---

## How to Pick a Task

1. Check "Revenue & Monetization" first - if any are unchecked, prioritize
2. Then check "Next Up" - pick the oldest incomplete task
3. After completing, move it to "Completed" section below
4. If blocked, document why and pick next available

## Completed Tasks
- [x] 2026-01-30: Create SOURCES.md with newsletter monitoring sources
- [x] 2026-02-01: Migrate updates.json to PostgreSQL database (Task 21)
- [x] 2026-02-01: Add RSS feed ingestion for 50+ AI blogs (Task 41)
- [x] 2026-02-01: Scrape arXiv CS.AI daily for new papers (Task 42) — 6 categories, 60+ papers ingested
- [x] 2026-01-30: Add Jan 30 market shock updates (Microsoft crash, etc.)
- [x] 2026-01-30: Add Forward Future sources (Matthew Berman)
- [x] 2026-01-30: Add 7 new stories from Forward Future
- [x] 2026-01-30: Create TASKS.md (this file)
- [x] 2026-01-30: Add Vercel Analytics tracking (Task 23)
- [x] 2026-01-30: Create RSS feed at /feed.xml (Task 24)
- [x] 2026-01-31: Add dark mode toggle to UI (Task 22)
- [x] 2026-01-31: Implement filtering by category/source/date (Task 26)
- [x] 2026-01-31: Add search functionality (Task 25)
- [x] 2026-01-31: Add email subscription for weekly digest (Task 27)
- [x] 2026-01-31: Sell dataset exports (Task 9) — Stripe checkout, /data page, $99 CSV export
- [x] 2026-01-31: Create printable timeline view (Task 38) — Print page at /print with A4 layout
- [x] 2026-01-31: Add timeline zoom (Task 39) — Day/Week/Month/Year view selector
- [x] 2026-01-31: Create visual timeline (Task 40) — Horizontal scrolling timeline at /visual with neon node visualization

---

## Notes
- Focus on revenue-generating tasks in Q1
- Technical debt can wait if revenue tasks are available
- Document blockers immediately
- Update this file after every task completion
