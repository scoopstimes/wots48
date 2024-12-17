let currentPage = 1;

// Fungsi untuk mengambil anggota event berdasarkan ID
async function getEventMembers(eventId) {
  if (!eventId) return null;

  const apiUrl = `https://api.crstlnz.my.id/api/theater/${eventId}`;
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (!data || !Array.isArray(data.shows) || data.shows.length === 0) {
      console.error("Format data event tidak valid:", data);
      return null;
    }

    const memberList = data.shows.flatMap(show =>
      show.members.map(member => member.name)
    );
    const seitansai = data.shows[0]?.seitansai || null;

    return {
      memberList,
      seitansai
    };
  } catch (error) {
    console.error("Gagal mengambil data anggota event:", error);
    return null;
  }
}

// Fungsi untuk memuat daftar teater berdasarkan halaman
function loadTheater(action) {
  // Menavigasi halaman
  if (action === "prev" && currentPage > 1) {
    currentPage--;
  } else if (action === "next") {
    currentPage++;
  }

  fetch(`https://api.crstlnz.my.id/api/theater?page=${currentPage}`)
    .then(response => response.json())
    .then(theaterData => {
      document.getElementById("theaterList").innerHTML = "";

      fetch("script/cdnpicture.json")
        .then(response => response.json())
        .then(pictures => {
          theaterData.theater.forEach(show => {
            const picture = pictures.find(p => p.setlist === show.title);
            const banner = picture ? picture.banner : "";
            const showDate = new Date(show.date);
            const formattedDate = showDate.toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });
            const showTime = show.date.substring(11, 16);
            const seitansaiMembers =
              show.seitansai?.map(member => member.name).join(", ") || "";
            const seitansaiHTML = seitansaiMembers
              ? `<h1>🎂 Seitansai: ${seitansaiMembers}</h1>`
              : "";

            const showElement = document.createElement("div");
            showElement.innerHTML = `
              <br>
              <a href="dtheater?id=${show.id}">
                <div class="row2">
                  <div>
                    <img src="${banner}" class="poster" loading="lazy">
                  </div>
                  <div>
                    <h1>🎪 Theater : ${show.title}</h1>
                    <h1>👥 Total Member : ${show.member_count} Members</h1>
                    <h1>⏰ Start Show: ${showTime} WIB</h1>
                    <h1>🗓️ Tanggal Show : ${formattedDate}</h1>
                    ${seitansaiHTML}
                  </div>
                </div>
              </a>
              <br><hr>
            `;
            document.getElementById("theaterList").appendChild(showElement);
          });

          const totalPages =
            theaterData.total_pages ||
            Math.ceil(theaterData.total_count / 5);

          document.getElementById("prevButton").disabled = currentPage === 1;
          document.getElementById("nextButton").disabled =
            currentPage === totalPages;
        })
        .catch(error =>
          console.error("Gagal mengambil data gambar dari cdnpicture:", error)
        );
    })
    .catch(error => console.error("Gagal mengambil data teater:", error));
}

// Fungsi untuk memuat detail teater
function detailTheater() {
  const params = new URLSearchParams(window.location.search);
  const theaterId = params.get("id");

  let apiUrl = "https://api.crstlnz.my.id/api/theater";
  if (theaterId) {
    apiUrl += `/${theaterId}`;
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(theaterDetails => {
      document.getElementById("theaterDetail").innerHTML = "";

      fetch("script/cdnpicture.json")
        .then(response => response.json())
        .then(pictures => {
          theaterDetails.shows.forEach(show => {
            const picture = pictures.find(p => p.setlist === show.title);
            const banner = picture ? picture.banner : "";
            const showDate = new Date(show.date).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric"
            });
            const showTime = new Date(show.date).toLocaleTimeString("id-ID", {
              hour: "numeric",
              minute: "numeric"
            });

            const seitansaiMembers =
              show.seitansai?.map(member => member.name).join(", ") || "";
            const seitansaiHTML = seitansaiMembers
              ? `<h3>🎂 Seitansai: ${seitansaiMembers}</h3>`
              : "";

            const membersHTML =
              show.members.length > 0
                ? show.members
                    .map(
                      member => `
                    <a href="${member.url_key ? `dmember.html?id=${member.url_key}` : "notfound.html"}">
                      <img src="${member.img}" class="postermem2" loading="lazy">
                      <h3>${member.name}</h3>
                    </a>
                  `
                    )
                    .join("")
                : "Lineup belum tersedia 😭";

            const showElement = document.createElement("div");
            showElement.innerHTML = `
              <h2>⭐ Setlist Theater ${show.title} ⭐</h2>
              <br><hr><br>
              <div class="row2">
                <img src="${banner}" style="max-width: 100%;">
                <div>
                  <h3>📒 Description: ${show.setlist.description}</h3>
                  <h3>📅 Tanggal: ${showDate}</h3>
                  <h3>⏰ Waktu: ${showTime} WIB</h3>
                  ${seitansaiHTML}
                </div>
              </div>
              <br><hr>
              <h3>${show.members.length > 0 ? `Total ${show.members.length} Member Tampil` : "Lineup belum keluar 😭"}</h3>
              <div class="row3">
                ${membersHTML}
              </div>
              <br><hr><br>
            `;

            document.getElementById("theaterDetail").appendChild(showElement);
          });
        })
        .catch(error => console.error("Gagal mengambil gambar cdnpicture:", error));
    })
    .catch(error => console.error("Gagal mengambil detail teater:", error));
}

// Event Listener untuk memuat data saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("theaterList")) {
    loadTheater();
  } else if (document.getElementById("theaterDetail")) {
    detailTheater();
  }
});