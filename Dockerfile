# Multi-stage build for production optimization
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files first
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Create directories if they don't exist
RUN mkdir -p server client

# Install dependencies
RUN npm run docker-install

# Copy ALL source code explicitly
COPY client/ ./client/
COPY server/ ./server/
COPY *.js ./
COPY *.sh ./
COPY *.json ./

# Debug: Show what was copied
RUN echo "=== BUILDER STAGE DEBUG ===" && \
    ls -la . && \
    echo "=== SERVER DIRECTORY ===" && \
    ls -la ./server/ && \
    echo "=== SERVER INDEX.JS CHECK ===" && \
    if [ -f ./server/index.js ]; then echo "✅ server/index.js EXISTS"; else echo "❌ server/index.js MISSING"; fi

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

# Copy built application with explicit structure
COPY --from=builder --chown=nextjs:nodejs /app/server ./server
COPY --from=builder --chown=nextjs:nodejs /app/client/build ./client/build
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Ensure server/index.js exists and is executable
RUN ls -la ./server/ && \
    if [ ! -f ./server/index.js ]; then echo "ERROR: server/index.js not found!"; exit 1; fi

# Copy diagnostic and error handling scripts
COPY --from=builder --chown=nextjs:nodejs /app/client-error-handler.js ./client/build/
COPY --from=builder --chown=nextjs:nodejs /app/api-diagnostic.js ./client/build/
COPY --from=builder --chown=nextjs:nodejs /app/healthcheck.js ./
COPY --from=builder --chown=nextjs:nodejs /app/deploy-render-fix.sh ./

# Make deploy script executable
RUN chmod +x ./deploy-render-fix.sh

# Install production dependencies
WORKDIR /app
RUN npm ci --only=production && npm cache clean --force

# Install server dependencies separately to ensure they're available
WORKDIR /app/server
RUN npm install --only=production && npm cache clean --force

# Return to app directory
WORKDIR /app

# Ensure uploads directory exists with proper permissions
RUN mkdir -p /app/server/uploads /app/uploads \
    && chown -R nextjs:nodejs /app/server/uploads /app/uploads

# Switch to non-root user
USER nextjs

# Expose port (dynamic for Render)
EXPOSE ${PORT:-5000}

# Health check (use dynamic port)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "const port = process.env.PORT || 5000; require('http').get(\`http://localhost:\${port}/api/health\`, (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server/index.js"]
