FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first (leverage cached layers)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]

