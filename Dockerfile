# Node.js のベースイメージを指定
FROM node:16

# 作業ディレクトリを作成
WORKDIR /usr/src/app

# package.json と package-lock.json をコピー
COPY package*.json ./

# 依存関係をインストール
RUN npm install

# アプリケーションのソースコードをコピー
COPY . .

# アプリケーションを起動
CMD ["node", "chat-ws.js"]

# コンテナがリッスンするポートを指定
EXPOSE 5501
