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
  const uploadedTextFile = req.files.textFile;
  const uploadedText = req.body.text; // Get the uploaded text

  if (uploadedImage) {
    const newFileName = `image${++uploadCounter}.jpg`;
    const uploadPath = path.join(__dirname, 'uploads', newFileName);
    uploadedImage.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).send('이미지 파일 업로드에 실패했습니다.');
      }
    });
  }

  if (uploadedTextFile) {
    const textFileName = `text${++uploadCounter}.txt`;
    const textUploadPath = path.join(__dirname, 'uploads', textFileName);
    uploadedTextFile.mv(textUploadPath, (err) => {
      if (err) {
        return res.status(500).send('텍스트 파일 업로드에 실패했습니다.');
      }
    });
  }

  if (uploadedText) {
    const textFileName = `text${++uploadCounter2}.txt`;
    const textUploadPath = path.join(__dirname, 'uploads', textFileName);
    fs.writeFile(textUploadPath, uploadedText, (err) => {
      if (err) {
        return res.status(500).send('텍스트 파일 변환에 실패했습니다.');
      }
    });
  }

  res.redirect('/sub');
});


app.get('/get-image', (req, res) => {
  const filesInUploads = fs.readdirSync(path.join(__dirname, 'uploads'));
  res.json(filesInUploads); // 이미지 파일 이름 목록을 JSON 형식으로 전달
});

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});
