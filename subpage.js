// 서버로부터 데이터를 가져와 이미지와 텍스트를 표시하는 함수 호출
fetch("/data")
  .then((response) => response.json())
  .then((data) => {
    const dataContainer = document.getElementById("data-container");

    data.forEach((item) => {
      const dataDiv = document.createElement("div");
      const image = document.createElement("img");
      image.src = item.imagePath;
      const text = document.createElement("p");
      text.textContent = item.text;
      dataDiv.appendChild(image);
      dataDiv.appendChild(text);
      dataContainer.appendChild(dataDiv);
    });
  })
  .catch((error) => {
    console.error("데이터 가져오기 실패: ", error);
  });
