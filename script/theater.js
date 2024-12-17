// Fungsi untuk mengambil data CDN Picture dari file JSON
async function fetchCDNPictureData() {
  try {
    const response = await fetch('script/cdnpicture.json');
    if (!response.ok) {
      throw new Error("Gagal mengambil data CDN gambar");
    }
    return await response.json();
  } catch (error) {
    console.error("Error saat mengambil data CDN gambar:", error);
    return [];
  }
}

// Fungsi utama untuk menampilkan theater yang akan datang
async function nextTheater() {
  try {
    // Ambil data theater dari API
    const response = await fetch("https://api.crstlnz.my.id/api/event");
    const eventData = await response.json();

    // Ambil elemen HTML untuk menampilkan theater
    const upcomingContainer = document.getElementById("upcoming");
    upcomingContainer.innerHTML = '';

    // Ambil data gambar tambahan dari file JSON
    const cdnPictureResponse = await fetch('script/cdnpicture.json');
    const cdnPictureData = await cdnPictureResponse.json();

    // Tanggal hari ini dan besok
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Cek apakah ada theater yang akan datang
    if (!eventData.theater || eventData.theater.upcoming.length === 0) {
      document.getElementById("noTheaterMessage").textContent = "Tidak ada theater 😭😭";
      document.getElementById("noTheaterMessage").style.display = "block";
      return;
    }

    // Loop melalui daftar theater yang akan datang
    for (const theater of eventData.theater.upcoming) {
      // Cari gambar banner yang cocok dari data CDN
      const matchedBanner = cdnPictureData.find(item => item.setlist.trim() === theater.title.trim());
      const bannerImage = matchedBanner ? matchedBanner.banner : theater.banner;

      // Format tanggal dan waktu
      const eventDate = new Date(theater.date);
      const dateOptions = { timeZone: "Asia/Jakarta", year: 'numeric', month: 'long', day: "numeric" };
      const timeOptions = { timeZone: "Asia/Jakarta", hour: "numeric", minute: "numeric" };

      const formattedDate = eventDate.toLocaleString("id-ID", dateOptions);
      const formattedTime = eventDate.toLocaleString("id-ID", timeOptions);

      // Cek jika ada Seitansai (perayaan ulang tahun anggota)
      const seitansai = theater.seitansai && theater.seitansai.length > 0
        ? theater.seitansai.map(member => member.name).join(", ")
        : '';
      const seitansaiText = seitansai ? `<h3 style="font-size: 15px;width: 130%; ">🎂 ${seitansai}</h3>` : '';

      // Menentukan status event (Hari Ini, Besok, atau tanggal biasa)
      let eventStatus;
      if (eventDate.toDateString() === today.toDateString()) {
        eventStatus = eventDate <= new Date() ? "Sedang Berlangsung" : "Hari ini";
      } else if (eventDate.toDateString() === tomorrow.toDateString()) {
        eventStatus = "Besok";
      } else {
        eventStatus = formattedDate;
      }

      // Cek apakah event sedang berlangsung berdasarkan waktu
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit" });
      const isOngoing = eventDate.toDateString() === today.toDateString() && formattedTime <= currentTime;

      const displayStatus = isOngoing ? "Sedang Berlangsung" : eventStatus;

      // Buat elemen card untuk setiap theater
      const card = document.createElement('div');
      card.classList.add('card-up');
      card.innerHTML = `
      <div style="display: flex; width: 200px;margin-left: 20px;">
        <a href="dtheater?id=${theater.id}" class="btnn">
<div style="display: flex; justify-content: center; align-items: center; width: 100%; ">
          <img src="${bannerImage}" ></div><br>
          <div style="display: flex; flex-direction: column;><h2>${displayStatus}</h2></div>
          <div style="display: flex; flex-direction: column; padding-bottom: 10px; ">

          <h3 style="font-size: 15px;">🎪 ${theater.title}</h3>
          <h3 style="font-size: 15px;">🗓️ ${formattedDate}</h3>
          <h3 style="font-size: 15px;">⏰ ${formattedTime} WIB</h3>
          <h3 style="font-size: 15px;">⭐ ${theater.member_count}</h3>
          ${seitansaiText}
          </div>
          <br>
        </a>
        </div>
      `;
      upcomingContainer.appendChild(card);
    }
  } catch (error) {
    console.error("Error saat mengambil data:", error);
  }
}

// Fungsi untuk mendapatkan ID theater
function getTheaterId(theaterId) {
  return theaterId || null;
}

// Jalankan fungsi saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", function () {
  nextTheater();
});