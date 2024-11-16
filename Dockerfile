FROM node:22-alpine
WORKDIR /app

COPY . .

RUN touch output.log
RUN touch web-app/ssl/cert.pem
RUN touch web-app/ssl/privkey.pem
RUN npm install 

EXPOSE 8001
EXPOSE 8002

CMD ["npm", "run", "guseyn:start"]
