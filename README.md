# UnitoPMS

[![CI/CD Pipeline](https://github.com/Aliha103/advance_unitopms/actions/workflows/deploy.yml/badge.svg)](https://github.com/Aliha103/advance_unitopms/actions/workflows/deploy.yml)

🌍 **Live:** [https://unitopms.com](https://unitopms.com)

## Architecture

| Service | Technology | Port |
| :--- | :--- | :--- |
| Frontend | Next.js 16 | 3000 |
| Backend | Django 4.2 + Gunicorn | 8000 |
| Database | PostgreSQL 15 | 5432 |
| Cache/Broker | Redis 7 | 6379 |
| Task Worker | Celery | — |
| Task Scheduler | Celery Beat | — |
| Tunnel | Cloudflare Tunnel | — |

## Auto-Deploy Setup (Portainer)

### First-Time Setup

1. Open Portainer (`http://192.168.0.122:9000`)
2. Go to **Stacks** → **Add stack**
3. Name: `unitopms`
4. Select **Repository**
5. **Repository URL**: `https://github.com/Aliha103/advance_unitopms`
6. **Reference**: `refs/heads/main`
7. **Compose path**: `docker-compose.yml`
8. Enable **Automatic updates** → **Polling** → Interval: `5m`
9. Add environment variable: `CLOUDFLARED_TOKEN` = your token
10. Click **Deploy the stack**

### How It Works

```
Push to GitHub → GitHub Actions validates build → Portainer detects change (≤5 min) → Auto-rebuild & deploy
```

## Local Development

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Admin: http://localhost:8000/admin
