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

// 이미지와 텍스트 데이터를 저장할 배열
const data = [];

// 이미지 업로드 및 데이터 추가 엔드포인트 설정
app.post("/submit", upload.single("image"), (req, res) => {
  // 이미지 업로드 후 data 배열에 이미지 정보와 텍스트 추가
  const item = {
    imagePath: req.file.path,
    text: req.body.text,
  };
  data.push(item);
  res.status(200).send("이미지 업로드 및 데이터 추가 완료");
});

// 서버에서 데이터 배열을 반환하는 엔드포인트 설정
app.get("/data", (req, res) => {
  res.json(data);
});

// 서브페이지 서비스 (public 폴더 내에 subindex.html 파일 있어야 함)
app.use(express.static("public"));

// 서버 시작
app.listen(3000, () => {
  console.log("서버가 3000번 포트에서 실행 중입니다.");
});
