# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Create directories if they don't exist
RUN mkdir -p server client

# Install dependencies
RUN npm run docker-install

# Copy source code
COPY . .

# Build the React application
RUN cd client && npm run build

# Production stage
FROM node:18-alpine AS production

# Install dumb-init for proper signal handling and bash for scripts
RUN apk add --no-cache dumb-init bash

# Create app directory and user
WORKDIR /app
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Create directories with proper permissions
RUN mkdir -p /app/server /app/client/build /app/uploads /app/data \
    && chown -R nextjs:nodejs /app

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/client/build ./client/build
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/render-setup.sh ./
COPY --from=builder --chown=nextjs:nodejs /app/render-setup-minimal.sh ./
COPY --from=builder --chown=nextjs:nodejs /app/ensure-server-files.sh ./

# Install dependencies
WORKDIR /app
RUN npm ci && npm cache clean --force

# Install server dependencies separately to ensure they're available
WORKDIR /app/server
RUN npm ci && npm cache clean --force

# Return to app directory
WORKDIR /app

# Ensure uploads directory exists with proper permissions
RUN mkdir -p /app/server/uploads /app/uploads \
    && chown -R nextjs:nodejs /app/server/uploads /app/uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["/bin/sh", "-c", "sh render-setup.sh && sh ensure-server-files.sh && cd /app && npm list express && node server/index.js || (echo 'Fallback: Running ensure-server-files.sh' && sh ensure-server-files.sh && cd /app/server && npm install express && node index.js)"]
