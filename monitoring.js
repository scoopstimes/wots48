document.addEventListener("DOMContentLoaded", function () {
  const sumber = 'https://api.crstlnz.my.id/api/now_live?group=jkt48';

  // Fungsi untuk mengirim notifikasi menggunakan OneSignal
  function sendNotification(memberName, platform, liveTitle, memberImg) {
    const oneSignalUrl = "https://onesignal.com/api/v1/notifications";
    const apiKey = "os_v2_app_dxhckkbierahpoxitpgpvugliohijlkxgwauvdeb5y7l4akxayhbkme7v736to2tajc7itkis4ppw3zxsonafftkmds62m73i2dahsa"; // Ganti dengan API Key Anda
    const appId = "1dce2528-2824-4077-bae8-9bccfad0cb43";   // Ganti dengan App ID Anda

    // Format teks platform dan isi notifikasi
    function formatNotificationText(platform, liveTitle) {
      if (platform.toLowerCase() === 'idn') {
        return `IDN Live: ${liveTitle}`;
      } else if (platform.toLowerCase() === 'showroom') {
        return `${memberName} sedang live di Showroom nih!`;
      }
      return `${memberName} sedang live di ${platform}!`;
    }

    const notificationData = {
      app_id: appId,
      headings: { en: "Live Notification" },
      contents: { en: formatNotificationText(platform, liveTitle) },
      included_segments: ["All"], // Kirim ke semua pengguna
      data: {
        member_name: memberName,
        platform,
        live_title: liveTitle,
      },
      big_picture: memberImg, // Gambar untuk notifikasi
       
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

        const liveIndicator = document.querySelector('.live-indicator') || document.querySelector('.nolive-indicator');

        if (liveIndicator) {
          if (liveCount === 0) {
            document.getElementById('noLiveMessage').textContent = 'Tidak ada yang live ';
            liveIndicator.classList.remove('live-indicator');
            liveIndicator.classList.add('nolive-indicator');
          } else {
            document.getElementById('noLiveMessage').textContent = '';
            liveIndicator.classList.remove('nolive-indicator');
            liveIndicator.classList.add('live-indicator');
          }
        }

        if (liveCount > 0) {
          liveMembers.slice(0, isLimit ? 100 : liveMembers.length).forEach((member) => {
            let notifiedMembers = JSON.parse(localStorage.getItem("notifiedMembers")) || [];
            let lastLiveTimestamp = localStorage.getItem("lastLiveTimestamp");
            const memberLiveTime = new Date(member.started_at).getTime();

            const isNewLiveMember = memberLiveTime > lastLiveTimestamp;

            if (!notifiedMembers.includes(member.name) || isNewLiveMember) {
              sendNotification(member.name, member.type, member.title || "Live", member.img);

              notifiedMembers.push(member.name);
              localStorage.setItem("notifiedMembers", JSON.stringify(notifiedMembers));
              localStorage.setItem("lastLiveTimestamp", memberLiveTime);
            }

            const card = document.createElement('div');
            card.style = `
              background-color: #2A3347;
              border-radius: 10px;
              padding: 10px;
              position: relative;
              width: 150px;
              text-align: center;
              display: flex;
              flex-direction: column;
              gap: 10px;
            `;

            const img = document.createElement('img');
            img.src = member.img;
            img.alt = member.name;
            img.style = `
              width: 100%;
              height: auto;
              object-fit: cover;
              border-radius: 10px;
              aspect-ratio: 1 / 1;
            `;
            card.appendChild(img);

            const title = document.createElement('div');
            title.textContent = member.name + (member.type === 'idn' ? ' JKT48' : '');
            title.style = `
              font-size: 14px;
              font-weight: bold;
            `;
            card.appendChild(title);

            const liveType = document.createElement('p');
            liveType.textContent = `Live: ${member.type}`;
            liveType.style = `
              font-size: 14px;
              color: #b0b0b0;
              margin-top: -5px;
            `;
            card.appendChild(liveType);

            const cardBody = document.createElement('div');
            cardBody.style = `
              display: flex;
              justify-content: center;
              gap: 10px;
            `;

            card.appendChild(cardBody);
            container.prepend(card);
          });
        }
      })
      .catch((error) => console.error('Error fetching NOW LIVE:', error));
  }

  fetchLiveData('.card-nowlive-container', true);
  fetchLiveData('.card-nowlive-container-up', false);

  setInterval(() => {
    fetchLiveData('.card-nowlive-container', true);
    fetchLiveData('.card-nowlive-container-up', false);
  }, 10000); // 10 detik
});