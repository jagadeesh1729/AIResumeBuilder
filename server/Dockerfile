FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first (leverage cached layers)
COPY package*.json ./
# Install only production deps; works even without a lockfile
RUN npm install --omit=dev

# Copy source
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
