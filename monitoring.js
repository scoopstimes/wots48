document.addEventListener("DOMContentLoaded", function () {
  const sumber = 'https://api.crstlnz.my.id/api/now_live?group=jkt48';

  // Fungsi untuk mengirim notifikasi menggunakan OneSignal
  function sendNotification(memberName, platform) {
    const oneSignalUrl = "https://onesignal.com/api/v1/notifications";
    const apiKey = "os_v2_app_dxhckkbierahpoxitpgpvugliohijlkxgwauvdeb5y7l4akxayhbkme7v736to2tajc7itkis4ppw3zxsonafftkmds62m73i2dahsa"; // Ganti dengan API Key Anda
    const appId = "1dce2528-2824-4077-bae8-9bccfad0cb43";   // Ganti dengan App ID Anda

    const notificationData = {
      app_id: appId,
      headings: { en: "Live Notification" },
      contents: { en: `${memberName} is live on ${platform}` },
      included_segments: ["All"], // Kirim ke semua pengguna
      data: {
        member_name: memberName,
        platform: platform,
      },
      url: `https://median.co/app/${memberName}`, // Opsional: URL ke aplikasi Median
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
  function fetchLiveData() {
    fetch(sumber)
      .then((response) => response.json())
      .then((data) => {
        const liveMembers = data.filter((member) => member.started_at);
        const liveCount = liveMembers.length;

        // Update jumlah member yang sedang live
        document.getElementById('liveCount').textContent = ` ${liveCount} Member`;

        const liveIndicator = document.querySelector('.live-indicator') || document.querySelector('.nolive-indicator');
        if (liveIndicator) {
          if (liveCount === 0) {
            document.getElementById('noLiveMessage').textContent = 'Tidak ada yang live';
            liveIndicator.classList.remove('live-indicator');
            liveIndicator.classList.add('nolive-indicator');
          } else {
            document.getElementById('noLiveMessage').textContent = '';
            liveIndicator.classList.remove('nolive-indicator');
            liveIndicator.classList.add('live-indicator');
          }
        }

        // Loop through live members and send notifications
        liveMembers.forEach((member) => {
          // Cek apakah member sudah mendapat notifikasi sebelumnya
          let notifiedMembers = JSON.parse(localStorage.getItem("notifiedMembers")) || [];
          let lastLiveTimestamp = localStorage.getItem("lastLiveTimestamp");

          const memberLiveTime = new Date(member.started_at).getTime();
          const isNewLiveMember = memberLiveTime > lastLiveTimestamp;

          // Kirim notifikasi hanya untuk member baru yang live atau jika timestampnya lebih baru
          if (!notifiedMembers.includes(member.name) && isNewLiveMember) {
            sendNotification(member.name, member.type);

            // Simpan member yang sudah diberi notifikasi dan timestamp
            notifiedMembers.push(member.name);
            localStorage.setItem("notifiedMembers", JSON.stringify(notifiedMembers));
            localStorage.setItem("lastLiveTimestamp", memberLiveTime);
          }
        });
      })
      .catch((error) => console.error('Error fetching NOW LIVE:', error));
  }

  // Set interval untuk memantau live data setiap 1 menit (60000 ms)
  setInterval(fetchLiveData, 60000);
  
  // Initial fetch on load
  fetchLiveData();
});