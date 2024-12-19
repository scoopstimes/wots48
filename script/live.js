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
function listLive() {
  // Ambil data live IDN
  fetch(`https://api.crstlnz.my.id/api/recent?sort=date&page=${currentPageIdn}&filter=all&order=-1&group=jkt48&type=idn&perpage=10`)
    .then((response) => response.json())
    .then((dataIdn) => {
      // Ambil data live Showroom
      fetch(`https://api.crstlnz.my.id/api/recent?group=jkt48&page=${currentPageShowroom}&perpage=100`)
        .then((response) => response.json())
        .then((dataShowroom) => {
         
          // Gabungkan kedua data
          const combinedData = [
            ...dataIdn.recents.filter((item) => item.idn.username !== "ame-5xqz6mqgk4"),
            ...dataShowroom.recents
          ];

          // Urutkan berdasarkan waktu (terbaru di atas)
          combinedData.sort((a, b) => new Date(b.live_info.date.start) - new Date(a.live_info.date.start));

          const container = document.getElementById("liveList");
          container.innerHTML = "";

          // Loop melalui data gabungan dan tampilkan
          combinedData.map((live) => {
            const duration = calculateDuration(live.live_info.date.start, live.live_info.date.end);
            const liveElement = document.createElement("div");

            liveElement.innerHTML = `
              <br>
                <div style="display: flex; flex-direction: column;margin-right: auto; width: 100%;">
                <div class="row-live" style="width: 100%;background: #2A3347;border-radius: 10px; width: 110%;margin-left: -18px;">
                  <img src="${live.member.img_alt}" style="width: 100px;
                  object-fit: cover; margin-top: 10px;" loading="lazy">
                  <button class="buttongoweb" onclick="goToLink('drecentlive.html?id=${live.id}&start=${live.live_info.date.start}&end=${live.live_info.date.end}&gift=${live.gift_rate}&view=${live.live_info.viewers.num}&nama=${live.member.nickname}&image=${live.member.img_alt}')">
                  <div style="margin-top: -10px; display: flex; flex-direction: column;margin-left: -19px;">
                    <h3 style="font-size: 17px; width: 150%;"> ${live.member.name}</h3>
                    <div style="margin-top: 10px; display: flex; flex-direction: column;">
                      <h3><span style="font-size: 17px" class="mdi mdi-access-point-network"> ${live.type}</span></h3>
                      <h3><span style="font-size: 17px" class="mdi mdi-account-multiple"> ${formatDate(live.live_info.date.start)}</span></h3>
                      <h3><span style="font-size: 17px" class="mdi mdi-access-point-network"> ${duration}</span></h3>
                    </div>
                  </div>
                  </button>
                </div>
                </div>

            `;
            container.appendChild(liveElement);
          });

          document.getElementById("prevButtonIdn").disabled = currentPageIdn === 1;
          document.getElementById("nextButtonIdn").disabled = currentPageIdn === Math.ceil(dataIdn.total_count / 3);
          document.getElementById("prevButtonShowroom").disabled = currentPageShowroom === 1;
          document.getElementById("nextButtonShowroom").disabled = dataShowroom.recents.length < 3;
        })
        .catch((error) => console.error("Error fetching data from showroom:", error));
    })
    .catch((error) => console.error("Error fetching data from IDN:", error));
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