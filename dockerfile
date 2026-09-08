
FROM node:20-alpine

WORKDIR /shipNow

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

ENV NODE_ENV=production

EXPOSE 8080

CMD ["npm", "start"]