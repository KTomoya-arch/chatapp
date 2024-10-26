const WebSocketServer = require("ws").Server;
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors"); // CORSモジュールを追加

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
wss.on("connection", function (ws) {
	let clientName = ""; // クライアントの名前を保持

	// クライアントからメッセージを受信したとき
	ws.on("message", function (message) {
		let parsedMessage = message.toString().split(": ");
		if (parsedMessage.length === 2) {
			clientName = parsedMessage[0];
			message = parsedMessage[1];
		}
		console.log(`${clientName} says:`, message);

		// 全ての接続されているクライアントにメッセージを送信
		wss.clients.forEach(function (client) {
			if (client.readyState === ws.OPEN) {
				client.send(`${clientName}: ${message}`);
			}
		});
	});

	ws.on("close", function () {
		console.log(`${clientName} disconnected`);
	});
});

// Herokuの環境変数 `PORT` を使用
const PORT = process.env.PORT || 5501;
server.listen(PORT, function () {
	console.log(`Server is listening on port ${PORT}`);
});
