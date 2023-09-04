FROM node:16.20.2-alpine

# Diretorio da aplicação dentro do container
WORKDIR /usr/app

# Copiando o package json e yarn lock para poder instalar as dependencias
COPY package.json ./
COPY yarn.lock ./

# Executando a instalação dos pacotes
RUN yarn install

# Copiando o restante dos arquivos
COPY . .

ENTRYPOINT ["yarn", "start"]