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
  fetch(`https://api.crstlnz.my.id/api/recent?sort=date&page=${currentPageIdn}&filter=all&order=-1&group=jkt48&type=idn&perpage=30`)
    .then((response) => response.json())
    .then((dataIdn) => {
      // Ambil data live Showroom
      fetch(`https://api.crstlnz.my.id/api/recent?group=jkt48&page=${currentPageShowroom}&perpage=30`)
        .then((response) => response.json())
        .then((dataShowroom) => {
          console.log(dataShowroom);
          // Gabungkan kedua data
          const combinedData = [
            ...dataIdn.recents.filter((item) => item.idn.username !== "ame-5xqz6mqgk4"),
            ...dataShowroom.recents
          ];

          // Filter data agar tidak menampilkan live yang baru dimulai (< 10 menit yang lalu)
          
          // Urutkan berdasarkan waktu (terbaru di atas)
          combinedData.sort((a, b) => {
  const aEndTime = new Date(a.live_info?.date?.end ?? 0).getTime();
  const bEndTime = new Date(b.live_info?.date?.end ?? 0).getTime();
  const aStartTime = new Date(a.live_info?.date?.start ?? 0).getTime();
  const bStartTime = new Date(b.live_info?.date?.start ?? 0).getTime();

  // Jika salah satu live sudah selesai, prioritaskan yang selesai
  if (aEndTime && bEndTime) {
    return bEndTime - aEndTime; // Urutkan berdasarkan waktu selesai (terbaru di atas)
  }

  // Jika live sedang berlangsung, gunakan waktu mulai
  return bStartTime - aStartTime;
});
          const container = document.getElementById("liveList");
          container.innerHTML = "";

          // Loop melalui data yang difilter dan tampilkan
          combinedData.map((live) => {
            const duration = calculateDuration(
              live.live_info?.date?.start ?? "",
              live.live_info?.date?.end ?? ""
            );
            
            const viewers = live.live_info?.viewers?.num ?? 0; // Nilai default 0
            const giftRate = live.points ?? 0; // Nilai default 0
            
            const points = live.points ?? 0; // Nilai default 0
            const type = live.type;
            const imgidn = live.idn?.image?? 0;
            const imgsr = live.member?.img?? 0;
            const title = live.idn?.title?? 0;
            const liveElement = document.createElement("div");

            liveElement.innerHTML = `
              <br>
              <div style="display: flex; flex-wrap: nowrap;margin-right: auto; width: 100%;padding: 0px;">
                <img src="${live.member?.img_alt ?? ''}" style="width: 100px;border-radius:10px 10px 10px 10px;
                height: 141px;
                object-fit: cover; margin-top: 0px;z-index: 99;">

                <div class="row-live" style="width: 115%;background: #2A3347;border-radius: 0px 10px 10px 0px; margin-left: -18px;justify-content: left;padding-left: 20px;
                padding-right: 20px;align-items: center; padding-bottom: 0px;height: 141px;">

                  <button class="buttongoweb" onclick="goToLink('drecentlive.html?id=${live.id}&start=${live.live_info?.date?.start ?? ''}&end=${live.live_info?.date?.end ?? ''}&gift=${giftRate}&view=${viewers}&nama=${live.member?.name ?? ''}&image=${live.member?.img_alt ?? ''}&points=${points}&type=${type}&title=${title}&imgidn=${imgidn}&imgsr=${imgsr}')">
                  
                  <div style="margin-top: -25px; display: flex; flex-direction: column;margin-left: 10px;width: 100%;">
                    <h3 style="font-size: 17px; width: 150%;font-family: 'Quicksand';"> ${live.member?.name ?? ''}</h3>
                    <div style="margin-top: 0px; display: flex; flex-direction: column;">
<h3><span style="font-size: 17px;font-family: 'Quicksand';" class="mdi mdi mdi-broadcast"> 
  ${live.type === 'idn' ? 'IDN Live' : live.type === 'showroom' ? 'Showroom' : ''}
</span></h3>
                      <h3><span style="font-size: 17px;font-family: 'Quicksand';" class="mdi mdi-timer"> ${duration}</span></h3>
                      <h3><span style="font-size: 17px;font-family: 'Quicksand';" class="mdi mdi-clock"> ${formatDate(live.live_info?.date?.end ?? '')}</span></h3>
                    </div>
                  </div>
                  </button>
                </div>
              </div>
            `;
            container.appendChild(liveElement);
          });

          // Perbarui status tombol navigasi
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
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;

  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) {
    return `${diffMinutes} menit yang lalu`;
  } else if (diffHours < 24) {
    return `${diffHours} jam yang lalu`;
  } else {
    return `${diffDays} hari yang lalu`;
  }
}