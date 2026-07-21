# --- Stage 1: Build Stage ---
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

ARG SERVICE_NAME

COPY package*.json tsconfig.json ./
COPY shared/package*.json ./shared/
COPY services/${SERVICE_NAME}/package*.json ./services/${SERVICE_NAME}/

RUN npm install --legacy-peer-deps

COPY shared/ ./shared/
COPY services/${SERVICE_NAME}/ ./services/${SERVICE_NAME}/

RUN npm run build --workspace=@my-app/shared
RUN npm run build --workspace=${SERVICE_NAME}

# Prune devDependencies for production
RUN npm prune --production

# --- Stage 2: Production Stage ---
FROM node:22-alpine AS runner
WORKDIR /usr/src/app

ARG SERVICE_NAME
ENV TARGET_SERVICE=${SERVICE_NAME}

# Copy node_modules and built dist folders only
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/shared/dist ./shared/dist
COPY --from=builder /usr/src/app/services/${SERVICE_NAME}/dist ./services/${SERVICE_NAME}/dist

EXPOSE 3000

CMD node services/${TARGET_SERVICE}/dist/main.js









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