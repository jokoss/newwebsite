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

# Copy built application with explicit handling of server subdirectories
COPY --from=builder --chown=nextjs:nodejs /app/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/server/controllers ./server/controllers
COPY --from=builder --chown=nextjs:nodejs /app/server/models ./server/models
COPY --from=builder --chown=nextjs:nodejs /app/server/routes ./server/routes
COPY --from=builder --chown=nextjs:nodejs /app/server/middleware ./server/middleware
COPY --from=builder --chown=nextjs:nodejs /app/server/config ./server/config
COPY --from=builder --chown=nextjs:nodejs /app/server/migrations ./server/migrations
COPY --from=builder --chown=nextjs:nodejs /app/server/scripts ./server/scripts
COPY --from=builder --chown=nextjs:nodejs /app/client/build ./client/build
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nextjs:nodejs /app/render-setup.sh ./
COPY --from=builder --chown=nextjs:nodejs /app/render-setup-minimal.sh ./
COPY --from=builder --chown=nextjs:nodejs /app/ensure-server-files.sh ./

# Copy diagnostic and error handling scripts
COPY --from=builder --chown=nextjs:nodejs /app/client-error-handler.js ./client/build/
COPY --from=builder --chown=nextjs:nodejs /app/api-diagnostic.js ./client/build/
COPY --from=builder --chown=nextjs:nodejs /app/healthcheck.js ./

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

# Enable debugging
ENV DEBUG=express:*,app:*
ENV NODE_DEBUG=http,net,stream

# Start the application with improved error handling and debugging
ENTRYPOINT ["dumb-init", "--"]
CMD ["/bin/sh", "-c", "echo 'Starting application with improved server file handling' && \
     node healthcheck.js && \
     sh render-setup-minimal.sh && \
     echo 'Checking server directory structure:' && \
     find /app/server -type d | sort && \
     echo 'Checking for critical server files:' && \
     ls -la /app/server/index.js /app/server/models/index.js 2>/dev/null || echo 'Critical files missing' && \
     sh ensure-server-files.sh && \
     echo 'Installing server dependencies if needed' && \
     cd /app/server && npm install express cors dotenv && \
     echo 'Starting server with full debugging' && \
     NODE_DEBUG=http,net,stream node index.js"]
