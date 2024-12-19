document.addEventListener("DOMContentLoaded", function () {
  const sumber = 'https://api.crstlnz.my.id/api/now_live?group=jkt48';

  // Fungsi untuk mengirim notifikasi menggunakan OneSignal
  function sendNotification(memberName, platform, liveTitle) {
    const oneSignalUrl = "https://onesignal.com/api/v1/notifications";
    const apiKey = "os_v2_app_dxhckkbierahpoxitpgpvugliohijlkxgwauvdeb5y7l4akxayhbkme7v736to2tajc7itkis4ppw3zxsonafftkmds62m73i2dahsa"; // Ganti dengan API Key Anda
    const appId = "1dce2528-2824-4077-bae8-9bccfad0cb43"; // Ganti dengan App ID Anda

    // Heading teks berbeda untuk IDN dan Showroom
    const headingText = platform.toLowerCase() === 'idn' 
      ? `IDN Live: ${liveTitle}` 
      : "Live Notification";

    const contentText = platform.toLowerCase() === 'idn' 
      ? `${memberName} sedang live di platform nih!` 
      : `${memberName} sedang live di Showroom nih!`;

    const notificationData = {
      app_id: appId,
      headings: { en: headingText },
      contents: { en: contentText },
      included_segments: ["All"], // Kirim ke semua pengguna
      data: {
        member_name: memberName,
        platform,
        live_title: liveTitle,
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
  function fetchLiveData(containerSelector, isLimit = true) {
    fetch(sumber)
      .then((response) => response.json())
      .then((data) => {
        const container = document.querySelector(containerSelector);
        container.innerHTML = ''; // Bersihkan container

        const liveMembers = data.filter((member) => member.started_at);
        const liveCount = liveMembers.length;

        // Menampilkan jumlah member yang sedang live
        document.getElementById('liveCount').textContent = ` ${liveCount} Member`;

        // Update indikator live
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

            if (!notifiedMembers.includes(member.name) || memberLiveTime > lastLiveTimestamp) {
              sendNotification(member.name, member.type, member.title || 'Live');
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
            liveType.textContent = `Live: ${member.type.toUpperCase()}`;
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

            if (member.type === 'showroom') {
              const showroomUrl = 'https://www.showroom-live.com/r/';
              const showroomLink = document.createElement('a');
              showroomLink.classList.add('btn-live-link', 'btn-primary');
              showroomLink.innerHTML = '<span class="mdi mdi-arrow-top-right-thin-circle-outline"></span>';
              showroomLink.href = showroomUrl + member.url_key;
              showroomLink.target = '_blank';
              cardBody.appendChild(showroomLink);
            } else if (member.type === 'idn') {
              const idnLink = document.createElement('a');
              idnLink.classList.add('btn-live-link', 'btn-primary');
              idnLink.innerHTML = '<span class="mdi mdi-arrow-top-right-thin-circle-outline"></span>';
              idnLink.href = `https://www.idn.app/${member.url_key}/live/${member.slug}`;
              cardBody.appendChild(idnLink);
            }

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
  }, 30000); // 30 detik
});