FROM node:20-alpine AS deps
WORKDIR /app
# Librairies utiles à Prisma en alpine
RUN apk add --no-cache libc6-compat openssl
# Copie des manifestes + Prisma pour pouvoir générer dès maintenant
COPY package*.json ./
COPY prisma ./prisma
# Installe TOUTES les dépendances (dev incluses pour la compilation TS)
RUN npm ci
# Génère le client Prisma (nécessaire au build)
RUN npx prisma generate

# ---------- Build TypeScript ----------
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY tsconfig.json ./
COPY src ./src
# Compile le code TS -> dist
RUN npm run build
# Épure: ne garder que les deps de prod dans node_modules
RUN npm prune --omit=dev

# ---------- Runner (image finale minimale) ----------
FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
ENV NODE_ENV=production
# Copie node_modules (déjà pruné), Prisma, package.json et dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY package*.json ./
COPY --from=builder /app/dist ./dist

# Port d'écoute (ajuste si besoin)
ENV PORT=3000
EXPOSE 3000

# Healthcheck (adapte /health si tu as une route santé)
# HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
#   CMD wget -qO- http://localhost:3000/health || exit 1

# Lancement serveur (assure-toi que dist/server.js existe)
CMD ["node", "dist/server.js"]
