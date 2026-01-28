# AI Timeline

Daily updates from the AI world. Automatically curated.

## Design Guidelines

- No blues, no purples, no gradients
- Warm earth tones with coral accent (#e85d4c)
- Unexpected font pairing: Inter + Space Grotesk
- Clean, minimal timeline layout

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Data Structure

Updates stored in `src/data/updates.json`:

```json
{
  "id": "unique-id",
  "date": "YYYY-MM-DD",
  "title": "Headline",
  "description": "Details",
  "source": "Company/Lab",
  "url": "https://...",
  "category": "model|lab|research|product"
}
```

## Deployment

Static export to `dist/` folder. Deploy to Vercel, Netlify, or GitHub Pages.

## Daily Automation

Cron job runs daily to:
1. Research AI news from sources
2. Summarize key updates
3. Update `updates.json`
4. Commit and push
5. Site rebuilds automatically
