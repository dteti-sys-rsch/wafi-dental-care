FROM ghcr.io/puppeteer/puppeteer:21.6.0
# Chromium already installed! ✅

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

CMD ["node", "index.js"]