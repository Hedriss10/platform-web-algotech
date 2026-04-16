FROM node:22-slim AS build

WORKDIR /app

# Sem lifecycle scripts: "prepare" roda type-check e precisa de todos os tsconfigs
# e do vite.config.ts — ainda não estão na imagem neste passo.
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .

ENV NODE_ENV=production
RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.prod.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
