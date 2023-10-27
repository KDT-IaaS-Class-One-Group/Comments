const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(fileUpload());
app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/sub', (req, res) => {
  res.sendFile(path.join(__dirname, 'sub.html'));
});

let uploadCounter = 0;

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('파일이 업로드되지 않았습니다.');
  }

  const uploadedFile = req.files.image;

  const newFileName = `image${++uploadCounter}.jpg`;

  const uploadPath = path.join(__dirname, 'uploads', newFileName);

  uploadedFile.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send('파일 업로드에 실패했습니다.');
    }

    res.redirect('/sub');
  });
});

app.get('/get-image', (req, res) => {
  const filesInUploads = fs.readdirSync(path.join(__dirname, 'uploads'));
  res.json(filesInUploads); // 이미지 파일 이름 목록을 JSON 형식으로 전달
});

app.listen(port, () => {
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
});