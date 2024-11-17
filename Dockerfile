FROM node:22-alpine
WORKDIR /app

COPY . .

RUN touch output.log
RUN npm install

EXPOSE 8001
EXPOSE 8002
