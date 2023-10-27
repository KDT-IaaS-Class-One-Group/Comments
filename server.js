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
let uploadCounter2 = 0;

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("파일이 업로드되지 않았습니다.");
  }

  const uploadedImage = req.files.image;

  // 이미지 파일 업로드 처리
  if (uploadedImage) {
    const newImageName = `image${++uploadCounter}.jpg`;
    const imagePath = path.join(__dirname, "uploads", newImageName);
    uploadedImage.mv(imagePath, (err) => {
      if (err) {
        return res.status(500).send("이미지 파일 업로드에 실패했습니다.");
      }
    });
  }

  if (req.body.text) {
    const text = req.body.text;
    const newTextName = `text${++uploadCounter2}.txt`;
    const textPath = path.join(__dirname, "uploads", newTextName);

    fs.writeFile(textPath, text, (err) => {
      if (err) {
        return res.status(500).send("텍스트 파일 업로드에 실패했습니다.");
      }
    });
  }

  res.redirect("/sub");
});
app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
