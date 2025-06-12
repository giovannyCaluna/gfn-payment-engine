FROM node:18

WORKDIR /app

# Install deps first to leverage Docker cache
COPY package*.json ./
COPY prisma ./prisma
RUN npm install
# 3. Generate Prisma client
RUN npx prisma generate

# Copy the rest
COPY . .

# Expose port
EXPOSE 3000

# Default command (can be overridden in docker-compose)
CMD [ "npx", "tsx", "src/api-gateway/index.ts" ]
