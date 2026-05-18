# GhostWare KPI Dashboard

Real-time analytics dashboard for GhostWare products - GhostPay, GhostSwap, and GhostSend.

## Features

- **Total Volume Tracking**: Real-time USD volume across all products
- **Asset Metrics**: Individual tracking for SOL, USDC, USDT, USD1
- **Product Analytics**: Transaction counts for each GhostWare product
- **Date Filters**: 7D, 30D, 90D, 180D, and All-time views
- **Interactive Charts**: Pie charts with product distribution
- **Recent Transactions**: Live transaction feed
- **Dark Theme**: Professional dark interface optimized for analytics

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Recharts for data visualization
- Lucide React for icons

## Installation

```bash
npm install
npm run build
npm start
```

## Development

```bash
npm run dev
```

## Environment Variables

Create a `.env.local` file with your API endpoint:

```
NEXT_PUBLIC_API_URL=https://staging-api.ghostwareos.com
```

## API Integration

Dashboard fetches data from:
- `/api/volume/metrics` - Comprehensive metrics
- `/api/volume/recent` - Recent transactions

## License

GhostWare © 2024
