FROM node:lts-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

RUN yarn global add vite

COPY . .

EXPOSE 8081

CMD ["vite", "--host", "", "--port", "8081"]
