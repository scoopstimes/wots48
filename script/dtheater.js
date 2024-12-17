let currentPage = 1; // Halaman awal

// Fungsi untuk mengambil data anggota berdasarkan ID acara
async function getEventMembers(eventId) {
  if (!eventId) return null;

  const apiUrl = `https://api.crstlnz.my.id/api/theater/${eventId}`;

  try {
    const response = await fetch(apiUrl);
    const eventData = await response.json();

    // Validasi data event
    if (!eventData || !Array.isArray(eventData.shows) || eventData.shows.length === 0) {
      console.error("Invalid event data format:", eventData);
      return null;
    }

    // Mengambil daftar anggota dan data seitansai (perayaan ulang tahun)
    const memberList = eventData.shows.flatMap(show =>
      show.members.map(member => member.name)
    );
    const seitansai = eventData.shows[0]?.seitansai || null;

    return { memberList, seitansai };
  } catch (error) {
    console.error("Error fetching event members:", error);
    return null;
  }
}

// Fungsi untuk memuat daftar theater berdasarkan halaman
function loadTheater(action) {
  if (action === "prev" && currentPage > 1) {
    currentPage--;
  } else if (action === "next") {
    currentPage++;
  }

  const apiUrl = `https://api.crstlnz.my.id/api/theater?page=${currentPage}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(theaterData => {
      const theaterListContainer = document.getElementById("theaterList");
      theaterListContainer.innerHTML = ""; // Kosongkan kontainer

      // Fetch data gambar (jika ada)
      fetch("script/cdnpicture.json")
        .then(response => response.json())
        .then(pictureData => {
          const theaters = theaterData.theater;

          theaters.forEach(theater => {
            const pictureInfo = pictureData.find(picture => picture.setlist === theater.title);
            const bannerUrl = pictureInfo ? pictureInfo.banner : "";

            // Format tanggal
            const dateOptions = { year: "numeric", month: "long", day: "numeric" };
            const showTime = theater.date.substring(11, 16);
            const formattedDate = new Date(theater.date).toLocaleDateString("id-ID", dateOptions);

            // Seitansai (jika ada)
            const seitansaiMembers = theater.seitansai
              ? theater.seitansai.map(member => member.name).join(", ")
              : "";
            const seitansaiHtml = seitansaiMembers
              ? `<h1>🎂 Seitansai: ${seitansaiMembers}</h1>`
              : "";

            // Buat elemen theater
            const theaterElement = document.createElement("div");
            theaterElement.innerHTML = `
              <br>
              <a href="dtheater?id=${theater.id}">
                <div class="row2">
                  <div>
                    <img src="${bannerUrl}" class="poster" loading="lazy">
                  </div>
                  <div>
                    <h1>🎪 Theater : ${theater.title}</h1>
                    <h1>👥 Total Member : ${theater.member_count} Members</h1>
                    <h1>⏰ Start Show: ${showTime} WIB</h1>
                    <h1>🗓️ Tanggal Show : ${formattedDate}</h1>
                    ${seitansaiHtml}
                  </div>
                </div>
              </a>
              <br><hr>
            `;

            theaterListContainer.appendChild(theaterElement);
          });

          // Kontrol tombol halaman
          const totalPages = theaterData.total_pages || Math.ceil(theaterData.total_count / 5);
          document.getElementById("prevButton").disabled = currentPage === 1;
          document.getElementById("nextButton").disabled = currentPage === totalPages;
        })
        .catch(error => console.error("Error fetching picture data:", error));
    })
    .catch(error => console.error("Error fetching theater data:", error));
}

// Fungsi untuk menampilkan detail theater berdasarkan ID
function detailTheater() {
  const urlParams = new URLSearchParams(window.location.search);
  const theaterId = urlParams.get("id");

  if (!theaterId) return;

  const apiUrl = `https://api.crstlnz.my.id/api/theater/${theaterId}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(theaterDetails => {
      const detailContainer = document.getElementById("theaterDetail");
      detailContainer.innerHTML = ""; // Kosongkan kontainer

      // Fetch gambar
      fetch("script/cdnpicture.json")
        .then(response => response.json())
        .then(pictureData => {
          theaterDetails.shows.forEach(show => {
            const pictureInfo = pictureData.find(picture => picture.setlist === show.title);
            const bannerUrl = pictureInfo ? pictureInfo.banner : "";

            // Format tanggal dan waktu
            const showDate = new Date(show.date);
            const formattedDate = showDate.toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
            const formattedTime = showDate.toLocaleTimeString("id-ID", { hour: "numeric", minute: "numeric" });

            // Seitansai (jika ada)
            const seitansaiMembers = show.seitansai?.map(member => member.name).join(", ") || "Tidak ada";
            const seitansaiHtml = show.seitansai
              ? `<h3>🎂 Seitansai: ${seitansaiMembers}</h3>`
              : "";

            // Daftar anggota yang tampil
            const membersHtml = show.members
              .map(member => `<li>${member.name}</li>`)
              .join("");

            // Tampilkan detail theater
            const showElement = document.createElement("div");
            showElement.innerHTML = `
              <h2 class="titleup">⭐ Setlist Theater ${show.title} ⭐</h2><br><hr><br>
              <div class="row2">
                <img src="${bannerUrl}" style="max-width: 100%;">
                <div>
                  <h3>📒 Description Setlist: ${show.setlist.description}</h3>
                  <h3>📅 Tanggal Show: ${formattedDate}</h3>
                  <h3>⏰ Waktu Show: ${formattedTime} WIB</h3>
                  ${seitansaiHtml}
                  <h3>👥 Anggota yang Tampil:</h3>
                  <ul>${membersHtml}</ul>
                </div>
              </div><br><hr>
            `;

            detailContainer.appendChild(showElement);
          });
        })
        .catch(error => console.error("Error fetching picture data:", error));
    })
    .catch(error => console.error("Error fetching theater data:", error));
}

// Memuat data theater saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  loadTheater();
  detailTheater();
});