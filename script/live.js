let currentPageIdn = 1;
let currentPageShowroom = 1;

// Fungsi utama saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  listLive();
  updateMemberDetails();

  // Fungsi untuk mencatat waktu refresh data
  function logRefreshTime() {
    console.log("Halaman recent live diperbarui pada: " + new Date().toLocaleString());
  }
  logRefreshTime();

  // Refresh data secara berkala setiap 60 detik (60000 ms)
  setInterval(function () {
    listLive();
    logRefreshTime();
  }, 60000);
});

// Fungsi untuk mengambil dan menggabungkan data live dari IDN dan Showroom
function listLive(filter = 'all') {
  const container = document.getElementById("liveList");
  container.innerHTML = "";  // Kosongkan kontainer sebelum menambahkan data baru

  let apiUrlIdn = `https://api.crstlnz.my.id/api/recent?sort=date&page=${currentPageIdn}&filter=all&order=-1&group=jkt48&type=idn&perpage=100`;
  let apiUrlShowroom = `https://api.crstlnz.my.id/api/recent?group=jkt48&page=${currentPageShowroom}&perpage=100`;

  // Ambil data live IDN jika filter adalah 'idn' atau 'all'
  if (filter === 'all' || filter === 'idn') {
    fetch(apiUrlIdn)
      .then((response) => response.json())
      .then((dataIdn) => {
        displayLiveData(dataIdn, 'idn');
      })
      .catch((error) => console.error("Error fetching data from IDN:", error));
  }

  // Ambil data live Showroom jika filter adalah 'showroom' atau 'all'
  if (filter === 'all' || filter === 'showroom') {
    fetch(apiUrlShowroom)
      .then((response) => response.json())
      .then((dataShowroom) => {
        displayLiveData(dataShowroom, 'showroom');
      })
      .catch((error) => console.error("Error fetching data from Showroom:", error));
  }
}

// Fungsi untuk menampilkan data live
function displayLiveData(data, type) {
  const container = document.getElementById("liveList");
  const dataList = type === 'idn' ? data.recents.filter(item => item.idn.username !== "ame-5xqz6mqgk4") : data.recents;

  // Gabungkan dan urutkan data berdasarkan waktu (terbaru di atas)
  const combinedData = dataList.sort((a, b) => new Date(b.live_info.date.start) - new Date(a.live_info.date.start));

  combinedData.forEach((live) => {
    const duration = calculateDuration(live.live_info.date.start, live.live_info.date.end);
    const liveElement = document.createElement("div");

    liveElement.innerHTML = `
      <br>
      <a href="drecentlive.html?id=${live.id}&start=${live.live_info.date.start}&end=${live.live_info.date.end}&gift=${live.gift_rate}&view=${live.live_info.viewers.num}&nama=${live.member.nickname}&image=${live.member.img_alt}">
        <div class="row-live" style="width: 100%;background: #2F2F2F;border-radius: 10px; width: 100%;">
          <img src="${live.member.img_alt}" style="width: 100px; object-fit: cover; margin-top: 10px;" loading="lazy">
          <div style="margin-top: 10px; display: flex; flex-direction: column;margin-left: -19px;">
            <h3 style="font-size: 17px; width: 150%;"> ${live.member.name}</h3>
            <div style="margin-top: 10px; display: flex; flex-direction: column;">
              <h3><span style="font-size: 17px" class="mdi mdi-access-point-network"> ${live.type}</span></h3>
              <h3><span style="font-size: 17px" class="mdi mdi-account-multiple"> ${formatDate(live.live_info.date.start)}</span></h3>
              <h3><span style="font-size: 17px" class="mdi mdi-access-point-network"> ${duration}</span></h3>
            </div>
          </div>
        </div>
      </a>
    `;
    container.appendChild(liveElement);
  });
}
            
          
// Fungsi utilitas
function calculateDuration(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const durationMs = endDate - startDate;

  const hours = Math.floor(durationMs / 3600000);
  const minutes = Math.floor((durationMs % 3600000) / 60000);

  return hours > 0 ? `${hours} Jam ${minutes} Menit` : `${minutes} Menit`;
}

function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString("id-ID", options);
}