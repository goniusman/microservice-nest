FROM node:22-alpine

WORKDIR /app

# Copy dependency configurations
COPY package*.json ./

# 'npm ci' is faster and more strict than 'npm install' for automated builds
RUN npm ci

# Copy all your NestJS source code files
COPY . .

# Compiles your TypeScript source code straight into /app/dist
RUN npm run build

EXPOSE 3004

# Execute the compiled production bundle
CMD ["node", "dist/main"]