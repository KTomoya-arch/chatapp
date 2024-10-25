var WebSocketServer = require("ws").Server;
var express = require("express");
var http = require("http");
var path = require("path");

// Expressサーバーを立てる
var app = express();
var server = http.createServer(app);

// WebSocketサーバーをExpressサーバーと同じポートで立てる
var wss = new WebSocketServer({ server });

// 静的ファイル（index.html）を提供
app.use(express.static(path.join(__dirname)));

// WebSocketクライアントから接続されたときの処理
wss.on("connection", function (ws) {
	let clientName = ""; // クライアントの名前を保持

	// クライアントからメッセージを受信したとき
	ws.on("message", function (message) {
		// メッセージは「名前: メッセージ」の形式で送信される
		let parsedMessage = message.toString().split(": ");
		if (parsedMessage.length === 2) {
			clientName = parsedMessage[0]; // 名前を更新
			message = parsedMessage[1]; // メッセージ内容を抽出
		}

		console.log(`${clientName} says:`, message);

		// 全ての接続されているクライアントにメッセージを送信
		wss.clients.forEach(function (client) {
			if (client.readyState === ws.OPEN) {
				client.send(`${clientName}: ${message}`);
			}
		});
	});

	// クライアントが切断されたとき
	ws.on("close", function () {
		console.log(`${clientName} disconnected`);
	});
});

// Expressサーバーを起動して、ポート5501でリッスン
server.listen(5501, function () {
	console.log("Server is listening on http://127.0.0.1:5501");
});
