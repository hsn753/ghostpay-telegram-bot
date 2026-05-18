# GhostPay Telegram Support Bot

Telegram bot for GhostPay/GhostWare support ticket system. Allows users to create support tickets, track payments, and get help directly through Telegram.

## Features

- 🎫 **Support Ticket Creation** - Users can create support tickets via Telegram
- 💰 **Payment Tracking** - Track GhostPay/GhostSwap/GhostSend transactions
- 🔍 **Transaction Lookup** - Search by wallet address or Ghost ID
- 📊 **Real-time Status** - Check payment status instantly
- 🔔 **Slack Integration** - Notifications sent to Slack for new tickets

## Tech Stack

- **Node.js** with TypeScript
- **node-telegram-bot-api** - Telegram bot framework
- **Axios** - HTTP client for backend API calls
- **Winston** - Logging
- **Slack Webhook** - Team notifications

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
TELEGRAM_BOT_TOKEN=your_bot_token
BACKEND_API_URL=http://localhost:4000
SLACK_WEBHOOK_URL=your_slack_webhook
```

3. Build and run:
```bash
npm run build
npm start
```

## Development

```bash
npm run dev
```

## Deployment

The bot is deployed on the staging server using PM2:

```bash
pm2 start ecosystem.config.cjs
```

## Commands

- `/start` - Start a new support session
- `/help` - Show help menu

## Integration

This bot integrates with:
- **GhostPay Backend** - https://github.com/GhostWareOS/ghostpay-backend
- **KPI Dashboard** - https://github.com/GhostWareOS/kpi-dashboard (support ticket management)

## License

GhostWare © 2024
