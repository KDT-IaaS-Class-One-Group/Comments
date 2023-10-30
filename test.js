const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// 메시지 저장용 파일
const chatLogFile = "chatlog.txt";

// 정적 파일 서빙 (main.html을 제공)
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/main.html");
});

io.on("connection", (socket) => {
  // 클라이언트로부터 메시지를 받아 메모장에 저장
  socket.on("message", (message) => {
    fs.appendFile(chatLogFile, message + "\n", (err) => {
      if (err) {
        console.error("메시지를 저장하는 중 오류 발생");
      }
    });

    // 모든 클라이언트에 메시지 브로드캐스트
    io.emit("message", message);
  });

  // 클라이언트와의 연결이 끊겼을 때
  socket.on("disconnect", () => {
    console.log("클라이언트와의 연결이 끊겼습니다.");
  });
});

server.listen(1004, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다.");
});
