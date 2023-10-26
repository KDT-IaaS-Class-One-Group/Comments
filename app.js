const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const app = express();

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

// 이미지와 텍스트 데이터를 저장할 JavaScript 객체
const data = {
  images: [],
  text: [],
};

// 이미지 업로드 엔드포인트 설정
app.post("/upload-image", upload.single("image"), (req, res) => {
  // 이미지 업로드 후 data 객체에 이미지 정보 추가
  const imageInfo = {
    filename: req.file.originalname,
    path: req.file.path,
  };
  data.images.push(imageInfo);
  res.status(200).send("이미지 업로드 완료");
});

// 텍스트 데이터 엔드포인트 설정
app.post("/upload-text", (req, res) => {
  // POST 요청의 텍스트 데이터를 data 객체에 추가
  const textData = req.body.text;
  data.text.push(textData);
  res.status(200).send("텍스트 데이터 업로드 완료");
});

// 이미지와 텍스트 데이터를 반환하는 엔드포인트 설정
app.get("/data", (req, res) => {
  res.json(data);
});

// 서버 시작
app.listen(3000, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다.");
});
