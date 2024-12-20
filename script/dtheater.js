let currentPage = 1;

// Mengambil data anggota acara dari API
// Mengambil data anggota acara dari API
async function getEventMembers(eventId) {
  if (!eventId) {
    return null;
  }

  const apiUrl = `https://api.crstlnz.my.id/api/theater/${eventId}`;

  try {
    const response = await fetch(apiUrl);
    const eventData = await response.json();
    console.log("Data Event Members:", eventData); // Log data API

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
      console.log("Data Theater:", data); // Log data API
      const theaterList = data.theater;

      // Menghapus konten lama dari daftar teater
      document.getElementById("theaterList").innerHTML = '';

      // Memuat gambar dan banner dari file JSON
      fetch("script/cdnpicture.json")
        .then(response => response.json())
        .then(pictureData => {
          console.log("Data Picture JSON:", pictureData); // Log data gambar JSON
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
      console.log("Data Theater Detail:", data); // Log data detail teater
      document.getElementById('theaterDetail').innerHTML = '';

      fetch("script/cdnpicture.json")
        .then(response => response.json())
        .then(pictureData => {
          console.log("Data Picture JSON Detail:", pictureData); // Log data gambar JSON untuk detail
          data.shows.forEach(show => {
            const picture = pictureData.find(p => p.setlist === show.title);
            const bannerImage = picture ? picture.banner : '';
            // ... (rest of the code for detail rendering)
          });
        })
        .catch(error => console.error("Error saat mengambil data gambar:", error));
    })
    .catch(error => console.error("Error saat mengambil data detail teater:", error));
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
      <div style="display: flex; gap: 0px; flex-wrap: wrap;margin-left: -15px;">
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
  ? `<button onclick="goToLink('${show.showroomTheater.entrance_url}')" style="width: 95%;display: flex; gap: 10px; justify-content: center;align-items: center;height: 7vh;" class="btnn-beli">
      <span class="icon"><i class="fas fa-ticket"></i></span>
      <span style="margin-right: 5px;">Beli tiket Showroom</span> 
    </button>`
  : '';

const idnLiveTicketButton = show.idnTheater && show.idnTheater.slug
  ? `<button onclick="goToLink('https://idn.app/${show.idnTheater.username}/live/preview/${show.idnTheater.slug}')" style="width: 95%;display: flex; gap: 10px; justify-content: center;align-items: center;height: 7vh;" class="btnn-beli">
      <span class="icon"><i style="background: linear-gradient(90deg, #FF3C3C, #ff4d4d, #FF3C3C);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;" class="fas fa-ticket"></i></span>
      <span style="margin-right: 5px;">Beli tiket IDN Live</span> 
    </button>`
  : '';

// Tambahkan tombol ke dalam bagian tiket
const ticketSection = `
  <div style="display: flex; justify-content: center;width: 100%; align-items: center;gap: 5px;flex-direction: column; margin-top: 10px;">
    <button onclick="goToLink('${ticketUrl}')" class="btnn-beli" style="width: 95%;display: flex; gap: 10px; justify-content: center;align-items: center;height: 7vh;">
      <span class="icon"><i class="fas fa-ticket"></i></span>
      <span style="margin-right: 5px;">Beli tiket Offline</span> 
    </button>
    ${onlineTicketButton}
    ${idnLiveTicketButton}
  </div>
`;

// Masukkan ke dalam template detail


            const theaterDetailCard = document.createElement("div");
            theaterDetailCard.innerHTML = `
         
  <div class="header_app" style="height: 50px;background-color: #0F131DCF;">


      <div class="header_logo">
    <button class="buttongoweb" onclick="goToLink('event.html')"><span class="mdi mdi-chevron-left"></span>    </button>
        <span style="font-size: 20px; font-weight: 700; font-family: 'Zen Maru Gothic';margin-left: 10px;" >${show.title} - ${dateString}</span>
      </div>


  </div>
<br>
              <br>
              <div class="row2" style="display: flex; flex-direction: column; width: 100%;">
              <div style="display: flex;width: 100%;justify-content: center; align-items: center;">
                <img src="${bannerImage}" style="max-width: 100%;  ">
                </div>
                <div style="display: flex; justify-content: left; align-items: center ;width: 95%;margin-top: -50px;">
                    <h2 class="titleup" style="margin-left: 0px; font-size: 27px;font-family: 'Zen Maru Gothic';">${show.title}</h2>

                                     </div>
                <div style="display: flex; justify-content: left; align-items: center ;width: 95%;margin-top: 5px;">
<h1 class="animated-gradient" style="font-size: 14px; font-family: 'Zen Maru Gothic';">Show Theater</h1>
                                   </div>
                                     <br>
                                     
                <div style="display: flex; flex-direction: column; width: 95%;justify-content: center;">

                  <h3 style="line-height: 1.5;line-width: 1; font-weight: 400; font-size: 17px;"> ${show.setlist.description}</h3><br>
                  <div style="display: flex; width: 100%; justify-content: left; flex-direction:column;gap: 10px;margin-top: 10px;">
<div style="display: flex; gap: 18px;align-items: center;">
<p style="font-weight: 400; color: white; opacity: 0.7;">Total Member</p>
<div style="display: flex; margin-left: 20px;">
                  <h3 style="font-weight: 400;  ">${memberCount}</h3>
                  </div>
                  </div>
                  <div style="display: flex; gap: 18px;align-items: center;">
                  <p style="font-weight: 400; color: white; opacity: 0.7;">Tanggal Show</p>
                  <div style="display: flex; margin-left: 18px;">
                  <h3 style="font-weight: 400;">${dateString}  -  ${timeString}</h3></div>
                  </div>

                  </div>
                  ${seitansaiHtml}
                </div>
              </div><br>
              <div style="display: flex; flex-direction: column; gap: 20px; margin-top: 10px; margin-left: 15px;">
              <h3 style="font-size: 20px; font-weight: 600; font-family: 'Zen Maru Gothic';"><i style="font-size: 20px; color: yellow;" class="mdi mdi-ticket"></i> Tiket Theater</h3>
              </div>
                <div style="display: flex; justify-content: center;width: 100%; align-items: center;gap:0px;flex-direction: column; margin-top: 10px;">

                ${ticketSection}
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