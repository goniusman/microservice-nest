# --- Stage 1: Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

ARG SERVICE_NAME

# Copy root configs
COPY package*.json tsconfig*.json ./

# Copy full services and shared folders so npm sees all workspace package.json files
COPY shared/ ./shared/
COPY services/ ./services/

# Install dependencies cleanly across all workspaces
RUN npm ci --legacy-peer-deps

# Deduplicate nested modules to enforce single instances of peer dependencies
RUN npm dedupe

# Build shared library first, then target service
RUN npm run build --workspace=@my-app/shared
RUN npm run build --workspace=${SERVICE_NAME}

# --- Stage 2: Production Stage ---
FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ARG SERVICE_NAME
ENV TARGET_SERVICE=${SERVICE_NAME}
ENV NODE_ENV=production

# Copy root package manifests and full node_modules (built clean in builder)
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy shared dist, manifests AND workspace node_modules if any exist
COPY --from=builder /usr/src/app/shared ./shared

# Copy target service dist and manifests
COPY --from=builder /usr/src/app/services/${SERVICE_NAME} ./services/${SERVICE_NAME}

EXPOSE 3000

CMD ["sh", "-c", "node services/${TARGET_SERVICE}/dist/main.js"]


# FROM node:22-alpine

# WORKDIR /app

# # Copy dependency configurations
# COPY package*.json ./

# # 'npm ci' is faster and more strict than 'npm install' for automated builds
# RUN npm install --legacy-peer-deps

# # Copy all your NestJS source code files
# COPY . .

# # Compiles your TypeScript source code straight into /app/dist
# RUN npm run build

# EXPOSE 3000

# # Execute the compiled production bundle
# CMD ["node", "dist/main"]