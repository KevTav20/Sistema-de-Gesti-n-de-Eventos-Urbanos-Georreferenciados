# Multi-stage build para Frontend React

# Etapa 1: Build de la aplicación
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar el código fuente
COPY . .

# Argumento de build para la URL del API
ARG REACT_APP_API_URL=http://localhost:3000/api
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Build de la aplicación React
RUN npm run build

# Etapa 2: Servidor de producción con Nginx
FROM nginx:alpine

# Copiar la build de React al directorio de Nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Nginx se inicia automáticamente
CMD ["nginx", "-g", "daemon off;"]
