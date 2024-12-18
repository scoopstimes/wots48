let currentPage = 1; // Halaman saat ini

// Fungsi untuk membatasi jumlah berita yang ditampilkan
function limitNews() {
  fetch(`https://api.crstlnz.my.id/api/news?page=${currentPage}&perpage=6`)
    .then(response => response.json())
    .then(data => {
      const newsContainer = document.getElementById("newsLimit");
      newsContainer.innerHTML = ''; // Kosongkan kontainer sebelum mengisi ulang

      data.news.forEach(newsItem => {
        const newsDiv = document.createElement("div");

        // Format tanggal
        const dateOptions = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(newsItem.date).toLocaleDateString('id-ID', dateOptions);

        newsDiv.innerHTML = `
          <a href="dnews?id=${newsItem.id}"><br>
            <div class="row1">
              <img src="https://res.cloudinary.com/haymzm4wp/image/upload/assets/jkt48${newsItem.label}" alt="Category Icon">
              <p class="date">${formattedDate}</p>
            </div>
            <h2>${newsItem.title}</h2><br><hr>
          </a>
        `;
        newsContainer.appendChild(newsDiv);
      });
    })
    .catch(error => console.error("Error fetching data:", error));
}

// Fungsi untuk membatasi berita member
function limitNewsmember() {
  fetch(`https://api.crstlnz.my.id/api/news?page=${currentPage}&perpage=6`)
    .then(response => response.json())
    .then(data => {
      const newsContainer = document.getElementById("newsLimimember");
      newsContainer.innerHTML = '';

      data.news.forEach(newsItem => {
        const newsDiv = document.createElement("div");

        // Format tanggal
        const dateOptions = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(newsItem.date).toLocaleDateString("id-ID", dateOptions);

        newsDiv.innerHTML = `
          <a href="dnews?id=${newsItem.id}"><br>
            <div class="row1">
              <img src="https://res.cloudinary.com/haymzm4wp/image/upload/assets/jkt48${newsItem.label}" alt="Category Icon">
              <p class="date">${formattedDate}</p>
            </div>
            <h2>${newsItem.title}</h2><br><hr>
          </a>
        `;
        newsContainer.appendChild(newsDiv);
      });
    })
    .catch(error => console.error("Error fetching data:", error));
}

// Fungsi untuk memuat daftar berita dengan navigasi halaman
function loadNews(action) {
  if (action === "prev" && currentPage > 1) {
    currentPage--; // Mundur satu halaman
  } else if (action === "next") {
    currentPage++; // Maju satu halaman
  }

  fetch(`https://api.crstlnz.my.id/api/news?page=${currentPage}`)
    .then(response => response.json())
    .then(data => {
      const newsList = document.getElementById("newsList");
      newsList.innerHTML = '';

      data.news.forEach(newsItem => {
        const newsDiv = document.createElement("div");

        // Format tanggal
        const dateOptions = { year: "numeric", month: "long", day: "numeric" };
        const formattedDate = new Date(newsItem.date).toLocaleDateString("id-ID", dateOptions);

        newsDiv.innerHTML = `
          <a href="dnews?id=${newsItem.id}"><br>
          <div style="display: flex; width: 100%; flex-direction: column; justify-content: center; align-items: center;">
          <div style="width: 90%; margin-left: 0px;display: flex; background: #1F202B; flex-direction: column;padding: 15px;border-radius: 10px;">
            <div class="row1">
              <img style="border-radius: 10px;" src="https://res.cloudinary.com/haymzm4wp/image/upload/assets/jkt48${newsItem.label}" alt="Category Icon">

            </div>
            <h2 style="font-weight: 400; font-size: 17px; margin-top: -5px;">${newsItem.title}</h2>
            <div style="display: flex; margin-left: auto; width: 100%; margin-top: 15px;">
            <p style="font-weight: 400;">${formattedDate}</p>
            </div>
            </div>
            
            </div>
          </a>
        `;
        newsList.appendChild(newsDiv);
      });

      // Atur status tombol navigasi
      document.getElementById("prevButton").disabled = currentPage === 1;
      document.getElementById("nextButton").disabled = currentPage === Math.ceil(data.total_count / data.perpage);
    })
    .catch(error => console.error("Error fetching data:", error));
}

// Fungsi untuk memuat detail berita
function detailNews() {
  const queryParams = new URLSearchParams(window.location.search);
  const newsId = queryParams.get('id');
  const apiUrl = newsId ? `https://api.crstlnz.my.id/api/news/${newsId}` : 'https://api.crstlnz.my.id/api/news';

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const newsDetailContainer = document.getElementById("newsDetail");
      newsDetailContainer.innerHTML = '';

      const detailLink = `https://jkt48.com/news/detail/id/${data.id}`;
      const newsDiv = document.createElement("div");

      newsDiv.innerHTML = `
        <br>
        <div style="display: flex; flex-direction: column; width: 95%;"<h1 class="titleup"> ${data.title}</h1><br><hr><br>
        <div class="content">${data.content}</div>
        <hr>
        <br><a href="${detailLink}" class="btn">🌐 Lihat di web JKT48</a></div><br><br>
      `;

      // Penyesuaian gaya
      const contentElement = newsDiv.querySelector(".content");
      contentElement.style.fontSize = "13px";
      contentElement.style.lineHeight = "1.5";
      contentElement.style.marginBottom = "20px";
      contentElement.querySelectorAll("span").forEach(span => {
        span.style.color = "white";
      });

      newsDetailContainer.appendChild(newsDiv);
    })
    .catch(error => console.error("Error fetching data:", error));
}

// Eksekusi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  limitNews();
  loadNews();
  detailNews();
  limitNewsmember();
});