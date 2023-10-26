const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const app = express();
const port = 5000; // 사용할 포트 번호

app.use(fileUpload());
app.use(express.static(__dirname)); // 정적 파일을 서비스하도록 설정

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html')); // index.html 페이지 반환
});

app.get('/sub', (req, res) => {
  res.sendFile(path.join(__dirname, 'sub.html')); // sub.html 페이지 반환
});


app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('파일이 업로드되지 않았습니다.');
  }

  const uploadedFile = req.files.image;
  const uploadPath = path.join(__dirname, 'uploads', uploadedFile.name);

  app.get('/get-image', (req, res) => {
    // 이미지 파일 이름을 클라이언트로 전송
    res.send(uploadedFile ? uploadedFile.name : '');
  });
  
  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send('파일 업로드에 실패했습니다.');
    }

    // 이미지 파일 이름을 클라이언트로 전송
    res.sendFile(path.join(__dirname, 'sub.html'));
  });
});


app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});