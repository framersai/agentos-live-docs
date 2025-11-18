FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY apps/gitpaywidget/package.json ./apps/gitpaywidget/
COPY packages/payments-core/package.json ./packages/payments-core/
COPY packages/gitpaywidget-sdk/package.json ./packages/gitpaywidget-sdk/
COPY packages/gitpaywidget-widget/package.json ./packages/gitpaywidget-widget/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm --filter @gitpaywidget/payments-core build
RUN pnpm --filter @gitpaywidget/sdk build
RUN pnpm --filter @gitpaywidget/widget build
RUN pnpm --filter @manicinc/gitpaywidget build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/apps/gitpaywidget/public ./apps/gitpaywidget/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/gitpaywidget/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/gitpaywidget/.next/static ./apps/gitpaywidget/.next/static
USER nextjs
EXPOSE 3000
ENV PORT 3000
CMD ["node", "apps/gitpaywidget/server.js"]

