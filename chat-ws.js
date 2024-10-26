const WebSocketServer = require("ws").Server;
const express = require("express");
const http = require("node:http");
const path = require("node:path");
const cors = require("cors");

// Expressサーバーを作成
const app = express();
const server = http.createServer(app);

// CORSを有効化
app.use(cors());

// WebSocketサーバーをExpressサーバーと同じポートで立てる
const wss = new WebSocketServer({ server });

// 静的ファイル（index.html）を提供
app.use(express.static(path.join(__dirname)));

// WebSocketクライアントから接続されたときの処理
wss.on("connection", (ws) => {
	let clientName = ""; // クライアントの名前を保持

	// クライアントからメッセージを受信したとき
	ws.on("message", (message) => {
		const parsedMessage = message.toString().split(": ");
		if (parsedMessage.length === 2) {
			clientName = parsedMessage[0];
			message = parsedMessage[1];
		}
		console.log(`${clientName} says:`, message);

		// 全ての接続されているクライアントにメッセージを送信
		for (const client of wss.clients) {
			if (client.readyState === ws.OPEN) {
				client.send(`${clientName}: ${message}`);
			}
		}
	});

	ws.on("close", () => {
		console.log(`${clientName} disconnected`);
	});
});

// Herokuの環境変数 `PORT` を使用
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
	console.log(`Server is listening on port ${PORT}`);
});
