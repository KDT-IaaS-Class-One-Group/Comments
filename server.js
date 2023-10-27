const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const socketIo = require("socket.io");
const app = express();
const port = 3000;
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server);

app.use(fileUpload());
app.use(express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/sub", (req, res) => {
  res.sendFile(path.join(__dirname, "sub.html"));
});

let uploadCounter = 0;

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("파일이 업로드되지 않았습니다.");
  }

  const uploadedFile = req.files.image;

  const newFileName = `image${++uploadCounter}.jpg`;

  const uploadPath = path.join(__dirname, "uploads", newFileName);

  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send("파일 업로드에 실패했습니다.");
    }

    res.redirect("/sub");
  });
});

app.get("/get-image", (req, res) => {
  const filesInUploads = fs.readdirSync(path.join(__dirname, "uploads"));
  res.json(filesInUploads); // 이미지 파일 이름 목록을 JSON 형식으로 전달
});

const chatLogFile = "chatlog.txt";

// 추가된 부분: 텍스트를 txt 파일로 저장
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

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
