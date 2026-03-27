# Simple single-stage build to avoid cache issues
FROM node:20.18.0-alpine

# Install dependencies including pnpm globally
RUN apk add --no-cache libc6-compat curl && npm install -g pnpm@9

WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SOCKET_URL
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_VERSION
ARG VCS_REF
ARG BUILD_DATE

# Set environment variables
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_PUBLIC_SOCKET_URL=${NEXT_PUBLIC_SOCKET_URL}
ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV}
ENV NEXT_PUBLIC_VERSION=${NEXT_PUBLIC_VERSION}

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy pnpm files first for better caching
COPY --chown=nextjs:nodejs pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy source code
COPY --chown=nextjs:nodejs . .

# Install dependencies and build
RUN pnpm install --frozen-lockfile && pnpm run build

# Add build metadata
LABEL org.opencontainers.image.title="ClubViz" \
      org.opencontainers.image.description="ClubViz Club Management Platform" \
      org.opencontainers.image.version=${NEXT_PUBLIC_VERSION} \
      org.opencontainers.image.revision=${VCS_REF} \
      org.opencontainers.image.created=${BUILD_DATE}

# Switch to non-root user
USER nextjs

# Expose the port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start the application  
EXPOSE 3000

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Debug startup
RUN echo "Container build completed at $(date)"

CMD ["sh", "-c", "echo 'Starting ClubViz at' $(date) && pnpm start"]