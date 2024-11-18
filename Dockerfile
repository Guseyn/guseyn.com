FROM node:22-alpine
WORKDIR /app

RUN touch output.log

COPY . .

RUN npm install

EXPOSE 8001
EXPOSE 8002
