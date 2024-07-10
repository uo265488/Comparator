# Usa una imagen base de Node.js versión alpina
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /front_end

# Copia el package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Instala expo-cli globalmente
RUN npm install -g expo-cli

# Copia el resto del código del frontend al contenedor
COPY . .

# Expone el puerto en el que se ejecutará el servidor Expo
EXPOSE 19006

# Comando para ejecutar la aplicación
CMD ["npm", "run", "web"]
