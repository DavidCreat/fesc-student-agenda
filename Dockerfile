# Usar una imagen base de Node.js
FROM node:18-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Exponer puertos
EXPOSE 3000
EXPOSE 5000

# Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]
