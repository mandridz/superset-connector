# Stage 1: Install Dependencies
FROM node:20-buster AS dep
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Build the Application
FROM node:20-buster AS builder
WORKDIR /app
COPY . .
COPY --from=dep /app/node_modules ./node_modules
RUN npm run build

# Stage 3: Prepare the Production Image
FROM node:20-buster AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN groupadd -r appgroup && useradd -r -g appgroup appuser
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
RUN mkdir -p ./dist/cache ./uploads && chown -R appuser:appgroup ./dist/cache ./uploads
USER appuser
EXPOSE 3000
CMD ["node", "dist/main"]
