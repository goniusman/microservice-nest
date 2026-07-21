# --- Stage 1: Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

ARG SERVICE_NAME

# Copy root manifests AND tsconfig.json
COPY package*.json tsconfig*.json ./

# Copy all workspace package.json files so npm links binaries properly
COPY shared/package*.json ./shared/
COPY services/*/package*.json ./services/

# Install ALL workspace dependencies at root level
RUN npm install --legacy-peer-deps

# Copy full source code
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

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY --from=builder /usr/src/app/shared/package*.json ./shared/
COPY --from=builder /usr/src/app/shared/dist ./shared/dist

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
# CMD ["node", "dist/src/main"]







# # --- STAGE 1: Build the application ---
# FROM node:20-alpine AS builder
# WORKDIR /usr/src/app

# # Copy root configurations and package manifests
# COPY package*.json tsconfig.json ./
# COPY shared/package*.json ./shared/
# COPY services/book-service/package*.json ./services/book-service/

# # Install ALL dependencies (including devDependencies needed to compile TypeScript)
# RUN npm ci

# # Copy the actual source code for the shared library and target service
# COPY shared/ ./shared/
# COPY services/book-service/ ./services/book-service/

# # Build the shared library first, then build the service
# RUN npm run build --workspace=@my-app/shared
# RUN npm run build --workspace=book-service

# # --- STAGE 2: Production Execution ---
# FROM node:20-alpine AS runner
# WORKDIR /usr/src/app

# ENV NODE_ENV=production

# # Copy built artifacts and structural manifests from Stage 1
# COPY package*.json ./
# COPY shared/package*.json ./shared/
# COPY services/book-service/package*.json ./services/book-service/

# # Install production-only dependencies
# RUN npm ci --omit=dev

# # Copy the compiled Javascript distribution bundles
# COPY --from=builder /usr/src/app/shared/dist ./shared/dist
# COPY --from=builder /usr/src/app/services/book-service/dist ./services/book-service/dist

# # Expose port and launch the specific service application
# EXPOSE 3000
# CMD ["node", "services/book-service/dist/main.js"]

# Run this from the root directory of your project
# docker build -f services/book-service/Dockerfile -t your-dockerhub-username/book-service:latest .

# Build the Book Service image
# docker build -f services/book-service/Dockerfile -t myorg/book-service:latest .

# Build the Auth Service image
# docker build -f services/auth-service/Dockerfile -t myorg/auth-service:latest .