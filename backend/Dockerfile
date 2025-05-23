# backend/Dockerfile

# --- Build Stage ---
FROM node:18-alpine AS build

WORKDIR /app

# Install pnpm for faster and more reliable installs (optional, can use npm if preferred)
# If using npm: `npm install`
RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install --frozen-lockfile

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate --schema=./prisma/schema.prisma

COPY . .
RUN pnpm run build

# --- Production Stage ---
FROM node:18-alpine

WORKDIR /app

# Install production dependencies using pnpm
COPY package*.json ./
RUN pnpm install --prod

# Copy compiled JavaScript, prompts, and Prisma client files
COPY --from=build /app/dist ./dist
COPY --from=build /app/prompts ./prompts
# Copy Prisma generated client files
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
# If you have custom persona definitions in a separate folder, copy them too:
COPY backend/agentos/cognitive_substrate/personas/definitions ./backend/agentos/cognitive_substrate/personas/definitions

ENV NODE_ENV=production
# Expose the port the server listens on
EXPOSE 3001

# Command to run the application
CMD ["node", "dist/server.js"]