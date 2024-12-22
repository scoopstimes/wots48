// Fungsi untuk mengambil daftar ulang tahun mendatang
async function getUpcomingBirthdays() {
  try {
    const response = await fetch("https://api.crstlnz.my.id/api/next_birthday?group=jkt48");
    const birthdays = await response.json();

    // Ambil hanya 10 data teratas dan format ulang datanya
    return birthdays.slice(0, 10).map(({ name, birthdate, img, url_key }) => ({
      name,
      birthdate,
      img,
      url_key
    }));
  } catch (error) {
    console.error("Error while fetching upcoming birthdays:", error);
    return [];
  }
}

// Fungsi untuk menghitung sisa waktu (bulan, hari, atau hari ini)
function calculateRemainingTime(birthdate) {
  const today = new Date();
  const target = new Date(birthdate);

  // Setel ulang tahun ke tahun ini
  target.setFullYear(today.getFullYear());

  // Jika ulang tahun sudah lewat tahun ini, atur ke tahun depan
  if (target < today) {
    target.setFullYear(today.getFullYear() + 1);
  }

  // Hitung jarak hari
  const totalDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));

  // Jika hari ini ulang tahun
  if (
    today.getDate() === new Date(birthdate).getDate() &&
    today.getMonth() === new Date(birthdate).getMonth()
  ) {
    return "Hari Ini";
  }

  // Hitung bulan dan sisa hari
  const months = Math.floor(totalDays / 30); // Asumsi 1 bulan = 30 hari
  const days = totalDays % 30;

  if (months >= 1) {
    return `${months} Bulan Lagi`;
  } else {
    return `${days} Hari Lagi`;
  }
}

// Fungsi untuk menampilkan daftar ulang tahun mendatang
async function displayUpcomingBirthdays() {
  try {
    const birthdays = await getUpcomingBirthdays();
    const container = document.querySelector(".birthnext");

    // Jika tidak ada data ulang tahun
    if (birthdays.length === 0) {
      container.innerHTML = `
        <div class="nobirthdaymessage">
          <div class="thumb">
            <div class="bdt">
              <p>Tidak ada yang ulang tahun</br></p>
            </div>
          </div>
        </div>
      `;
      return;
    }

    // Bersihkan kontainer sebelum menambahkan data
    container.innerHTML = '';

    // Tampilkan setiap ulang tahun
    birthdays.forEach(({ name, birthdate, img, url_key }) => {
      const remainingTime = calculateRemainingTime(birthdate);

      // Format tanggal ke bahasa Indonesia
      const formattedDate = new Date(birthdate).toLocaleDateString('id', {
        year: "numeric",
        month: "long",
        day: "numeric"
      });

      // Buat elemen HTML
      const birthdayHTML = `

  <div class="birthday-item" style="justify-content: center;">
    <img src="${img}" alt="${name} Image" class="postermem" loading="lazy">
    <div class="birthday-info">
      <h2 style="color: white;">${name} JKT48</h2>
      <h4 style="color: white;"> ${formattedDate}</h4>
      <h5 style="margin-top: 10px;">${remainingTime}</h5>
    </div>

  </div>
</div>
      `;

      container.insertAdjacentHTML("beforeend", birthdayHTML);
    });

    console.log("Halaman next birthday diperbarui pada: " + new Date().toLocaleString());
  } catch (error) {
    console.error("Error while displaying upcoming birthdays:", error);
  }
}

// Jalankan fungsi setiap 60 detik
setInterval(displayUpcomingBirthdays, 60000);

// Jalankan saat halaman dimuat
displayUpcomingBirthdays();