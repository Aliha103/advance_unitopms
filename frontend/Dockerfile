FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies (with caching)
COPY package.json package-lock.json* ./
RUN npm ci --legacy-peer-deps

# Copy source
COPY . .

# Build
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Set correct permission for prerender cache
mkdir .next
chown nextjs:nodejs .next

# Copy built assets
COPY --from=builder /app/public ./public
# Automatically reuse the simplified standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
