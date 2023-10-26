const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost/your-database-name');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 이미지가 저장될 디렉토리 설정
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('image'), (req, res) => {
  // 이미지가 업로드되었으므로 데이터베이스에 저장하실 수 있습니다.
  // 이미지 파일 이름 등의 정보를 데이터베이스에 저장하는 코드를 작성하세요.
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});