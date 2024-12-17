let currentPageIdn = 1;
let currentPageShowroom = 1;

// Fungsi utama saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  listLiveIdn();
  listLiveShowroom();
  updateMemberDetails();

  // Fungsi untuk mencatat waktu refresh data
  function logRefreshTime() {
    console.log("Halaman recent live diperbarui pada: " + new Date().toLocaleString());
  }
  logRefreshTime();

  // Refresh data secara berkala setiap 60 detik (60000 ms)
  setInterval(function () {
    listLiveIdn();
    listLiveShowroom();
    logRefreshTime();
  }, 60000);
});

// Fetch dan tampilkan data live IDN
function listLiveIdn(action) {
  if (action === "prev" && currentPageIdn > 1) {
    currentPageIdn--;
  } else if (action === "next") {
    currentPageIdn++;
  }

  fetch(`https://api.crstlnz.my.id/api/recent?sort=date&page=${currentPageIdn}&filter=all&order=-1&group=jkt48&type=idn&perpage=3`)
    .then((response) => response.json())
    .then((data) => {
      const liveList = data.recents.filter((item) => item.idn.username !== "ame-5xqz6mqgk4");
      const container = document.getElementById("liveListIdn");
      container.innerHTML = "";

      liveList.map((live) => {
        const duration = calculateDuration(live.live_info.date.start, live.live_info.date.end);
        const liveElement = document.createElement("div");

        liveElement.innerHTML = `
          <br><hr><br>
          <a href="drecentlive.html?id=${live.id}&start=${live.live_info.date.start}&end=${live.live_info.date.end}">
            <div class="row-live">
              <img src="${live.member.img_alt}" class="postermemlive" loading="lazy">
              <div>
                <h3>👥 Nama Member: ${live.member.nickname} JKT48</h3>
                <h3>💻 Streaming di : ${live.type}</h3>
                <h3>🗓️ Tanggal Live: ${formatDate(live.live_info.date.start)}</h3>
                <h3>⏱️ Durasi: ${duration}</h3>
                <h3>👀 Penonton: ${live.live_info.viewers ? live.live_info.viewers.num + " viewers" : "data tidak tersedia"}</h3>
                <h3>🎁 Gift: ${live.gift_rate} G</h3>
              </div>
            </div>
          </a>
        `;
        container.appendChild(liveElement);
      });

      document.getElementById("prevButtonIdn").disabled = currentPageIdn === 1;
      document.getElementById("nextButtonIdn").disabled = currentPageIdn === Math.ceil(data.total_count / 3);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

// Fetch dan tampilkan data live Showroom
function listLiveShowroom(action) {
  if (action === "prev" && currentPageShowroom > 1) {
    currentPageShowroom--;
  } else if (action === "next") {
    currentPageShowroom++;
  }

  fetch(`https://api.crstlnz.my.id/api/recent?group=jkt48&page=${currentPageShowroom}&perpage=3`)
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("liveListShowroom");
      container.innerHTML = "";

      data.recents.map((live) => {
        const duration = calculateDuration(live.live_info.date.start, live.live_info.date.end);
        const liveElement = document.createElement("div");

        liveElement.innerHTML = `
          <br><hr><br>
          <a href="drecentlive.html?id=${live.id}&start=${live.live_info.date.start}&end=${live.live_info.date.end}">
            <div class="row-live">
              <img src="${live.member.img_alt}" class="postermemlive" loading="lazy">
              <div>
                <h3>👥 Nama Member: ${live.member.name}</h3>
                <h3>💻 Streaming di : ${live.type}</h3>
                <h3>🗓️ Tanggal Live: ${formatDate(live.live_info.date.start)}</h3>
                <h3>⏱️ Durasi: ${duration}</h3>
                <h3>👀 Penonton: ${live.live_info.viewers ? live.live_info.viewers.num + " viewers" : "data tidak tersedia"}</h3>
                <h3>🎁 Gift: ${live.gift_rate} G</h3>
              </div>
            </div>
          </a>
        `;
        container.appendChild(liveElement);
      });

      document.getElementById("prevButtonShowroom").disabled = currentPageShowroom === 1;
      document.getElementById("nextButtonShowroom").disabled = data.recents.length < 3;
    })
    .catch((error) => console.error("Error fetching data:", error));
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