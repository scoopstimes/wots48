let currentPage = 1;

// Mengambil data anggota acara dari API
async function getEventMembers(eventId) {
  if (!eventId) {
    return null;
  }

  const apiUrl = `https://api.crstlnz.my.id/api/theater/${eventId}`;

  try {
    const response = await fetch(apiUrl);
    const eventData = await response.json();

    // Validasi format data
    if (!eventData || !Array.isArray(eventData.shows) || eventData.shows.length === 0) {
      console.error("Data acara tidak valid:", eventData);
      return null;
    }

    // Mengambil daftar nama anggota dari setiap show
    const memberList = eventData.shows.flatMap(show => show.members.map(member => member.name));
    const seitansai = eventData.shows[0]?.seitansai || null;

    return { memberList, seitansai };
  } catch (error) {
    console.error("Error saat mengambil data anggota acara:", error);
    return null;
  }
}

// Memuat daftar teater dari API
function loadTheater(direction) {
  if (direction === "prev" && currentPage > 1) {
    currentPage--;
  } else if (direction === "next") {
    currentPage++;
  }

  const apiUrl = `https://api.crstlnz.my.id/api/theater?page=${currentPage}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const theaterList = data.theater;

      // Menghapus konten lama dari daftar teater
      document.getElementById("theaterList").innerHTML = '';

      // Memuat gambar dan banner dari file JSON
      fetch("script/cdnpicture.json")
        .then(response => response.json())
        .then(pictureData => {
          theaterList.forEach(theater => {
            const picture = pictureData.find(p => p.setlist === theater.title);
            const bannerImage = picture ? picture.banner : '';

            const eventDate = new Date(theater.date);
            const dateString = eventDate.toLocaleDateString("id-ID", { year: 'numeric', month: 'long', day: 'numeric' });

            const seitansai = theater.seitansai ? theater.seitansai.map(s => s.name).join(", ") : '';
            const seitansaiHtml = seitansai ? `<h1>🎂 Seintansai: ${seitansai}</h1>` : '';

            const theaterCard = document.createElement('div');
            theaterCard.innerHTML = `
              <br>
              <a href="dtheater?id=${theater.id}">
                <div class="row2">
                  <div>
                    <img src="${bannerImage}" class="poster" loading="lazy">
                  </div>
                  <div>
                    <h1>🎪 Theater: ${theater.title}</h1>
                    <h1>👥 Total Member: ${theater.member_count} Members</h1>
                    <h1>⏰ Start Show: ${theater.date.substring(11, 16)} WIB</h1>
                    <h1>🗓️ Tanggal Show: ${dateString}</h1>
                    ${seitansaiHtml}
                  </div>
                </div>
              </a>
              <br><hr>
            `;
            document.getElementById("theaterList").appendChild(theaterCard);
          });

          const totalPages = data.total_pages || Math.ceil(data.total_count / 5);
          document.getElementById("prevButton").disabled = currentPage === 1;
          document.getElementById('nextButton').disabled = currentPage === totalPages;
        })
        .catch(error => console.error("Error saat mengambil data gambar:", error));
    })
    .catch(error => console.error("Error saat mengambil data teater:", error));
}

// Menampilkan detail teater berdasarkan ID
function detailTheater() {
  const urlParams = new URLSearchParams(window.location.search);
  const theaterId = urlParams.get('id');
  let apiUrl = "https://api.crstlnz.my.id/api/theater";

  if (theaterId) {
    apiUrl += `/${theaterId}`;
  }

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      document.getElementById('theaterDetail').innerHTML = '';

      fetch("script/cdnpicture.json")
        .then(response => response.json())
        .then(pictureData => {
          data.shows.forEach(show => {
            const picture = pictureData.find(p => p.setlist === show.title);
            const bannerImage = picture ? picture.banner : '';

            const showDate = new Date(show.date);
            const dateString = showDate.toLocaleString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
            const timeString = showDate.toLocaleString('id-ID', { hour: 'numeric', minute: 'numeric' });

            const seitansai = show.seitansai.length > 0 ? show.seitansai.map(s => s.name).join(", ") : '';
            const seitansaiHtml = seitansai ? `<h3>🎂 Seintansai: ${seitansai}</h3>` : '';

            const memberCount = show.members.length;
            const ticketUrl = `https://jkt48.com/theater/schedule/id/${show.id}`;
            const onlineTicketButton = show.showroomTheater && show.showroomTheater.entrance_url
              ? `<a href="${show.showroomTheater.entrance_url}" class="btnn-beli">
                  <span class="icon"><i class="fas fa-ticket"></i></span>
                  <span style="margin-right: 5px;"></span> 
                  Beli tiket Online
                </a>`
              : '';

            const theaterDetailCard = document.createElement("div");
            theaterDetailCard.innerHTML = `
              <h2 class="titleup">⭐ Setlist Theater ${show.title} ⭐</h2><br><hr><br>
              <div class="row2">
                <img src="${bannerImage}" style="max-width: 100%;">
                <div>
                  <h3>📒 Description Setlist: ${show.setlist.description}</h3><br>
                  <h3>📅 Tanggal Show: ${dateString}</h3>
                  <h3>⏰ Waktu Show: ${timeString} WIB</h3>
                  ${seitansaiHtml}
                </div>
              </div><br><hr>
              <h3 class="row2-up">${memberCount > 0 ? `Total ${memberCount} member yang akan tampil` : "Lineup belum keluar 😭"}</h3>
              <div class="row3">
                ${memberCount > 0 ? show.members.map(member => `
                  <a href="${member.url_key ? `dmember.html?id=${member.url_key}` : 'notfound.html'}">
                    <img src="${member.img}" class="postermem2" loading="lazy">
                    <h3 class="titleup-detail">${member.name}</h3>
                  </a>
                `).join('') : ''}
              </div><br><hr><br>
              <div style="display: flex; justify-content: center;">
                <a href="${ticketUrl}" class="btnn-beli">
                  <span class="icon"><i class="fas fa-ticket"></i></span>
                  <span style="margin-right: 5px;"></span> 
                  Beli tiket Offline
                </a>
                ${onlineTicketButton}
              </div>
            `;
            document.getElementById('theaterDetail').appendChild(theaterDetailCard);
          });
        })
        .catch(error => console.error("Error saat mengambil data gambar:", error));
    })
    .catch(error => console.error("Error saat mengambil data detail teater:", error));
}

// Event listener untuk memuat teater setelah halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  loadTheater();
  detailTheater();
});