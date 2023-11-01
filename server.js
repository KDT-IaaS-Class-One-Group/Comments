const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");
const socketIo = require("socket.io");
const app = express();
const port = 5000;
const http = require("http");
const server = http.createServer(app);
const io = socketIo(server);

app.use(fileUpload());
app.use(express.static(__dirname));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json()); // JSON 파싱 미들웨어 추가

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/sub", (req, res) => {
  res.sendFile(path.join(__dirname, "sub.html"));
});

const uploadCounter = { image: 0, text: 0 };

app.post("/upload", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("파일이 업로드되지 않았습니다.");
  }

  const uploadedImage = req.files.image;
  const uploadedTextFile = req.files.textFile;
  const uploadedText = req.body.text;

  if (uploadedImage) {
    const newFileName = `image${++uploadCounter.image}.jpg`;
    const uploadPath = path.join(__dirname, "uploads", newFileName);
    uploadedImage.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).send("이미지 파일 업로드에 실패했습니다.");
      }
    });
  }

  if (uploadedTextFile) {
    const newFileName = `text${++uploadCounter.text}.txt`;
    const textUploadPath = path.join(__dirname, "uploads", newFileName);
    uploadedTextFile.mv(textUploadPath, (err) => {
      if (err) {
        return res.status(500).send("텍스트 파일 업로드에 실패했습니다.");
      }
    });
  }

  if (uploadedText) {
    const newFileName = `text${++uploadCounter.text}.txt`;
    const textUploadPath = path.join(__dirname, "uploads", newFileName);
    fs.writeFile(textUploadPath, uploadedText, "utf8", (err) => {
      if (err) {
        return res.status(500).send("텍스트 파일 변환에 실패했습니다.");
      }
    });
  }

  res.redirect("/sub");
});

app.get("/get-image", (req, res) => {
  const filesInUploads = fs.readdirSync(path.join(__dirname, "uploads"));
  res.json(filesInUploads);
});

// 텍스트 파일 업데이트를 위한 라우트 추가
app.post("/update-text", (req, res) => {
  const { fileName, text } = req.body;

  if (fileName && text) {
    const textFilePath = path.join(__dirname, "uploads", fileName);

    fs.writeFile(textFilePath, text, "utf8", (err) => {
      if (err) {
        return res.json({ success: false, message: "텍스트 파일 업데이트에 실패했습니다." });
      }
      res.json({ success: true, message: "텍스트 파일이 성공적으로 업데이트되었습니다." });
    });
  } else {
    res.json({ success: false, message: "요청에 필요한 데이터가 누락되었습니다." });
  }
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});