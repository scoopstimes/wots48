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
            const seitansaiHtml = show.seitansai.length > 0 ?
  `
    <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 20px;">
      <h3 style="font-size: 25px; font-weight: 500; font-family: 'Zen Maru Gothic';"><i style="font-size: 25px; color: pink;" class="fas fa-birthday-cake"></i> Seintansai</h3>
      <div style="display: flex; gap: 5px; flex-wrap: wrap;">
        ${show.seitansai.map(s => `

          <div style="display: flex; flex-direction: column; align-items: center; gap: 0px;">
            <img src="${s.img}" style="width: 100px;height:130px;border-radius: 10px;" loading="lazy">
            <h3 style="margin-top: -10px;
border-radius: 10px;
color: #fff;
display: flex;
justify-content: center;
background: transparent;
align-items: center;
font-weight: 400;
padding: 5px 10px;">${s.name}</h3>

          </div>
        `).join('')}
      </div>
    </div>
  ` :
  '';
            const memberCount = show.members.length;
            const ticketUrl = `https://jkt48.com/theater/schedule/id/${show.id}`;
            const onlineTicketButton = show.showroomTheater && show.showroomTheater.entrance_url
              ? `<a href="${show.showroomTheater.entrance_url}" style="width: 86%;display: flex; gap: 10px; justify-content: center;align-items: center;height: 5vh;" class="btnn-beli">
                  <span class="icon"><i class="fas fa-ticket"></i></span>
                  <span style="margin-right: 5px;">Beli tiket Online</span> 
                  
                </a>`
              : '';

            const theaterDetailCard = document.createElement("div");
            theaterDetailCard.innerHTML = `
              <h2 class="titleup">${show.title} - ${dateString} </h2><br><br>
              <div class="row2" style="display: flex; flex-direction: column; width: 100%;">
              <div style="display: flex;width: 100%;justify-content: center; align-items: center;">
                <img src="${bannerImage}" style="max-width: 100%;  ">
                </div>
                <div style="display: flex; justify-content: left; width: 95%;margin-top: -50px;">
                    <h2 class="titleup" style="margin-left: 0px; font-size: 27px;font-family: 'Zen Maru Gothic';">${show.title}</h2>
                                     </div>
                                     <br>
                                     
                <div style="display: flex; flex-direction: column; width: 95%;justify-content: center;">

                  <h3 style="line-height: 1.5;line-width: 1; font-weight: 400; font-size: 17px;"> ${show.setlist.description}</h3><br>
                  <div style="display: flex; width: 100%; justify-content: left; flex-direction:column;gap: 10px;margin-top: 10px;">
<div style="display: flex; gap: 18px;align-items: center;">
<p style="font-weight: 400; color: white; opacity: 0.7;">Total Member</p>
                  <h3 style="font-weight: 400;">${memberCount}</h3>
                  </div>
                  <div style="display: flex; gap: 18px;align-items: center;">
                  <p style="font-weight: 400; color: white; opacity: 0.7;">Tanggal Show</p>
                  <h3 style="font-weight: 400;">${dateString}  -  ${timeString}</h3>
                  </div>

                  </div>
                  ${seitansaiHtml}
                </div>
              </div><br>
              <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 10px; margin-left: 15px;">
              <h3 style="font-size: 20px; font-weight: 600; font-family: 'Zen Maru Gothic';"><i style="font-size: 20px; color: yellow;" class="fas fa-ticket"></i> Tiket Theater</h3>
              </div>
                <div style="display: flex; justify-content: center;width: 100%; align-items: center;gap: 10px;flex-direction: column; margin-top: 10px;">
                <a href="${ticketUrl}" class="btnn-beli" style="width: 86%;display: flex; gap: 10px; justify-content: center;align-items: center;height: 5vh;">

                  <span class="icon"><i class="fas fa-ticket"></i></span>
                  <span style="margin-right: 5px;">Beli tiket Offline</span> 
                  </a>

                ${onlineTicketButton}
                     </div>
              <div style="display: flex; justify-content: left; margin-left: 15px; align-items: center; width: 95%; gap: 10px;margin-top: 20px;">
              <span style="font-size: 30px;" class="mdi mdi-account-group"></span>
              <h3 style="font-size: 27px;font-weight: 400; font-family: 'Zen Maru Gothic';">${memberCount > 0 ? ` Daftar Member` : "Lineup segera"}</h3>
              </div>
              <div class="row3">
                ${memberCount > 0 ? show.members.map(member => `
                  <a>
                    <img src="${member.img}" style="width: 200px;height:130px;border-radius: 10px;" loading="lazy">
                    <h3 style="margin-top: 0px;
border-radius: 10px;
color: #fff;
display: flex;
justify-content: center;
background: transparent;
align-items: center;
font-weight: 400;
padding: 5px 10px;">${member.name}</h3>
                  </a>
                `).join('') : ''}
              </div><br><hr><br>

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