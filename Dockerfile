
FROM node:22-bookworm-slim

WORKDIR /workspace

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./
COPY tsconfig.json ./

RUN DATABASE_URL="postgresql://bebopchat:buildonly@localhost:5432/bebopchat?schema=public" \
    npx prisma generate

COPY src ./src

RUN npm run build

ENV NODE_ENV=prod
ENV PORT=3001

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
