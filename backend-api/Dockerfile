# Backend API Dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production

FROM base AS build
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/main.js"]
