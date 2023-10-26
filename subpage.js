// 이미지를 표시할 요소 가져오기
const imageContainer = document.getElementById("image-container");

// 서버에서 이미지 목록을 가져오는 요청을 보낼 URL 설정
const imageUrl = "/getImages"; // 이미지 목록을 제공하는 백엔드 엔드포인트

// 서버에서 이미지 목록을 가져오는 요청 보내기
fetch(imageUrl)
  .then((response) => response.json())
  .then((data) => {
    // 이미지 목록을 반복하며 이미지를 표시
    data.forEach((imageName) => {
      const imageElement = document.createElement("img");
      imageElement.src = `uploads/${imageName}`; // 이미지 파일 경로 설정
      imageContainer.appendChild(imageElement);
    });
  })
  .catch((error) => {
    console.error("이미지 불러오기 실패: ", error);
  });
