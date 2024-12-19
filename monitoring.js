document.addEventListener("DOMContentLoaded", function () {
  const sumber = 'https://api.crstlnz.my.id/api/now_live?group=jkt48';

  // Fungsi untuk mengirim notifikasi menggunakan OneSignal
  function sendNotification(memberName, platform, liveTitle, imgUrl) {
    const oneSignalUrl = "https://onesignal.com/api/v1/notifications";
    const apiKey = "os_v2_app_dxhckkbierahpoxitpgpvugliohijlkxgwauvdeb5y7l4akxayhbkme7v736to2tajc7itkis4ppw3zxsonafftkmds62m73i2dahsa"; // Ganti dengan API Key Anda
    const appId = "1dce2528-2824-4077-bae8-9bccfad0cb43";   // Ganti dengan App ID Anda

    // Fungsi untuk memformat teks platform dan heading
    function formatPlatformText(platform) {
      return platform.toLowerCase() === 'idn' ? 'IDN' : 'Showroom';
    }

    const headingText = platform.toLowerCase() === 'idn' 
      ? `IDN Live: ${liveTitle}` 
      : "Live Notification";

    const contentText = `${memberName} sedang live di ${formatPlatformText(platform)} nih!`;

    const notificationData = {
      app_id: appId,
      headings: { en: headingText },
      contents: { en: contentText },
      included_segments: ["All"], // Kirim ke semua pengguna
      data: {
        member_name: memberName,
        platform: formatPlatformText(platform),
        live_title: liveTitle,
      },
      url: `https://median.co/app/${memberName}`,
      big_picture: imgUrl, // Tambahkan gambar ke notifikasi
    };

    fetch(oneSignalUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${apiKey}`,
      },
      body: JSON.stringify(notificationData),
    })
      .then((response) => response.json())
      .then((data) => console.log("Notification sent:", data))
      .catch((error) => console.error("Error sending notification:", error));
  }

  // Fungsi utama untuk mengambil dan menampilkan data live
  function fetchLiveData(containerSelector, isLimit = true) {
    fetch(sumber)
      .then((response) => response.json())
      .then((data) => {
        const container = document.querySelector(containerSelector);
        container.innerHTML = ''; // Bersihkan container

        const liveMembers = data.filter((member) => member.started_at);
        const liveCount = liveMembers.length;

        document.getElementById('liveCount').textContent = ` ${liveCount} Member`;

        liveMembers.slice(0, isLimit ? 100 : liveMembers.length).forEach((member) => {
          const memberLiveTime = new Date(member.started_at).getTime();
          const liveTitle = member.title || "Live Streaming"; // Gunakan judul live atau default
          const imgUrl = member.img || "https://default-image-url.com"; // Gambar default jika tidak ada

          // Kirim notifikasi jika belum pernah dikirim sebelumnya
          let notifiedMembers = JSON.parse(localStorage.getItem("notifiedMembers")) || [];
          if (!notifiedMembers.includes(member.name) || memberLiveTime > localStorage.getItem("lastLiveTimestamp")) {
            sendNotification(member.name, member.type, liveTitle, imgUrl);

            // Simpan notifikasi
            notifiedMembers.push(member.name);
            localStorage.setItem("notifiedMembers", JSON.stringify(notifiedMembers));
            localStorage.setItem("lastLiveTimestamp", memberLiveTime);
          }
        });
      })
      .catch((error) => console.error('Error fetching NOW LIVE:', error));
  }

  // Fetch untuk SHOWROOM LIVE LIMIT
  fetchLiveData('.card-nowlive-container', true);

  // Fetch untuk SHOWROOM LIVE NO LIMIT
  fetchLiveData('.card-nowlive-container-up', false);

  // Set interval untuk otomatis refresh setiap 30 detik
  setInterval(() => {
    fetchLiveData('.card-nowlive-container', true);
    fetchLiveData('.card-nowlive-container-up', false);
  }, 10000); // 10 detik
});