# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/client

# Copy package.json and pnpm-lock.yaml
COPY client/package.json client/pnpm-lock.yaml ./
# Install dependencies
RUN npm install -g pnpm && pnpm install
# Copy the rest of the frontend code
COPY client .
# Build the frontend
RUN pnpm run build

# Stage 2: Build Backend
FROM node:18-alpine
WORKDIR /app/server

# Copy package.json and pnpm-lock.yaml
COPY server/package.json server/pnpm-lock.yaml ./
# Install dependencies
RUN npm install -g pnpm && pnpm install
# Copy Prisma schema and generate client
COPY server/prisma ./prisma
RUN npx prisma generate
# Copy the rest of the backend code
COPY server .
# Compile TypeScript to JavaScript
RUN pnpm run build

# Copy frontend build from frontend-builder to /app
COPY --from=frontend-builder /app/client/dist ../client/dist

# Expose port and run commands
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && pnpm run start"]