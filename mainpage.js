const form = document.getElementById("data-form");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const response = await fetch("/submit", {
    method: "POST",
    body: formData,
  });

  if (response.status === 200) {
    // 서브페이지 열기
    window.open("/subindex.html", "_blank");
  }
});
