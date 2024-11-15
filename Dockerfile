FROM node:22-alpine
WORKDIR /app

COPY . .

RUN npm install 

EXPOSE 8001
EXPOSE 8002

CMD ["npm", "run", "guseyn:start"]
