# --- Stage 1: Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

ARG SERVICE_NAME

# Copy root package manifests
COPY package*.json ./

# Copy all package.json files from shared and services
COPY shared/package*.json ./shared/
COPY services/*/package*.json ./services/

# Install dependencies for ALL workspaces
RUN npm install --legacy-peer-deps

# Copy source code and configs
COPY shared/ ./shared/
COPY services/${SERVICE_NAME}/ ./services/${SERVICE_NAME}/

# Build shared library first, then target service
RUN npm run build --workspace=@my-app/shared
RUN npm run build --workspace=${SERVICE_NAME}

# Prune devDependencies for production
RUN npm prune --production
 
# --- Stage 2: Production Stage ---
FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ARG SERVICE_NAME
ENV TARGET_SERVICE=${SERVICE_NAME}

# Copy root manifests & pruned node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

# COPY BOTH package.json AND dist FOR SHARED (Fixes MODULE_NOT_FOUND)
COPY --from=builder /usr/src/app/shared/package*.json ./shared/
COPY --from=builder /usr/src/app/shared/dist ./shared/dist

# Copy built service output
COPY --from=builder /usr/src/app/services/${SERVICE_NAME}/package*.json ./services/${SERVICE_NAME}/
COPY --from=builder /usr/src/app/services/${SERVICE_NAME}/dist ./services/${SERVICE_NAME}/dist

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


