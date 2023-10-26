const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;

// 이미지 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // 이미지가 저장될 디렉토리 설정
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// 미들웨어 설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // 정적 파일 제공을 위한 폴더 설정 (subindex.html 파일이 있어야 함)

// 이미지와 텍스트 데이터를 저장할 배열
const data = [];

// 이미지 업로드 및 데이터 추가 엔드포인트 설정
app.post("/upload", upload.single("image"), (req, res) => {
  const item = {
    imagePath: req.file.path,
    text: req.body.text,
  };
  data.push(item);
  res.status(200).send("이미지 업로드 및 데이터 추가 완료");
});

// 이미지와 텍스트 데이터를 반환하는 엔드포인트 설정
app.get("/data", (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`서버가 ${port}번 포트에서 실행 중입니다.`);
});
