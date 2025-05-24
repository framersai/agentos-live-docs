# File: backend/Dockerfile

# Development Stage
FROM node:18-alpine AS development

WORKDIR /app

# Install system dependencies for node-gyp and native modules
RUN apk add --no-cache python3 make g++ git curl

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema first
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p storage tmp logs

# Expose port
EXPOSE 3001

# Default development command
CMD ["npm", "run", "dev"]

# Production Build Stage
FROM node:18-alpine AS build

WORKDIR /app

# Install system dependencies
RUN apk add --no-cache python3 make g++

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install all dependencies (including dev)
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production Stage
FROM node:18-alpine AS production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vca -u 1001 -G nodejs

# Install system dependencies
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from build stage
COPY --from=build --chown=vca:nodejs /app/dist ./dist
COPY --from=build --chown=vca:nodejs /app/prisma ./prisma
COPY --from=build --chown=vca:nodejs /app/node_modules/.prisma ./node_modules/.prisma

# Copy additional necessary files
COPY --chown=vca:nodejs prompts ./prompts
COPY --chown=vca:nodejs backend/agentos/cognitive_substrate/personas ./backend/agentos/cognitive_substrate/personas

# Create necessary directories with proper permissions
RUN mkdir -p storage tmp logs && \
    chown -R vca:nodejs storage tmp logs

# Switch to non-root user
USER vca

# Set environment
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Expose port
EXPOSE 3001

# Start command
CMD ["node", "dist/server.js"]