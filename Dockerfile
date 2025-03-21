FROM node:22.14.0-alpine

WORKDIR /usr/src/test

COPY package.json package-lock.json* ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

RUN npm run test

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start" ]
