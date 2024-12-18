document.addEventListener("DOMContentLoaded", function () {
  const sumber = 'https://api.crstlnz.my.id/api/now_live?group=jkt48';

  // Set untuk menyimpan nama member yang sudah dinotifikasi
  let notifiedMembers = new Set();

  // Fungsi untuk mengirim notifikasi menggunakan OneSignal
  function sendNotification(memberName, platform) {
    const oneSignalUrl = "https://onesignal.com/api/v1/notifications";
    const apiKey = "os_v2_app_dxhckkbierahpoxitpgpvugliohijlkxgwauvdeb5y7l4akxayhbkme7v736to2tajc7itkis4ppw3zxsonafftkmds62m73i2dahsa"; // Ganti dengan API Key Anda
    const appId = "1dce2528-2824-4077-bae8-9bccfad0cb43";   // Ganti dengan App ID Anda

    const notificationData = {
      app_id: appId,
      headings: { en: "Live Notification" },
      contents: { en: `${memberName} Sedang live di ${platform}` },
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

        // Ambil indikator live
        const liveIndicator = document.querySelector('.live-indicator') || document.querySelector('.nolive-indicator');

        if (liveIndicator) {
          if (liveCount === 0) {
            // Jika tidak ada yang live
            document.getElementById('noLiveMessage').textContent = 'Tidak ada yang live ';
            liveIndicator.classList.remove('live-indicator');
            liveIndicator.classList.add('nolive-indicator');
          } else {
            // Jika ada yang live
            document.getElementById('noLiveMessage').textContent = '';
            liveIndicator.classList.remove('nolive-indicator');
            liveIndicator.classList.add('live-indicator');
          }
        }

        if (liveCount > 0) {
          const idnUrl = 'https://www.idn.app/';
          liveMembers.slice(0, isLimit ? 100 : liveMembers.length).forEach((member) => {
            console.log(member);

            // Kirim notifikasi hanya untuk member baru yang live
            if (!notifiedMembers.has(member.name)) {
              sendNotification(member.name, member.type);
              notifiedMembers.add(member.name); // Tambahkan ke Set setelah dinotifikasi
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

            if (member.type === 'showroom') {
              const showroomUrl = 'https://www.showroom-live.com/r/';
              const showroomLink = document.createElement('a');
              showroomLink.classList.add('btn-live-link', 'btn-primary');
              showroomLink.innerHTML = '<span class="mdi mdi-arrow-top-right-thin-circle-outline"></span>';
              showroomLink.href = showroomUrl + member.url_key;
              showroomLink.target = '_blank';
              cardBody.appendChild(showroomLink);

              member.streaming_url_list.forEach((urlObj) => {
                if (urlObj.label === 'original quality') {
                  const fullscreenBtn = document.createElement('a');
                  fullscreenBtn.classList.add('btn-live', 'btn-primary');
                  fullscreenBtn.innerHTML = '<span class="mdi mdi-video"></span>';

                  const startDate = member.started_at ? encodeURIComponent(member.started_at) : 'Tidak diketahui';
                  const viewers = member.viewers ? encodeURIComponent(member.viewers) : '0';
                  fullscreenBtn.href = `showroom.html#url=${encodeURIComponent(urlObj.url)}&name=${encodeURIComponent(member.name)}&viewers=${viewers}&start_date=${startDate}&type=${encodeURIComponent(member.type)}`;
                  cardBody.appendChild(fullscreenBtn);
                }
              });
            } else if (member.type === 'idn') {
              const idnLink = document.createElement('a');
              idnLink.classList.add('btn-live-link', 'btn-primary');
              idnLink.innerHTML = '<span class="mdi mdi-arrow-top-right-thin-circle-outline"></span>';
              idnLink.href = `${idnUrl}${member.url_key}/live/${member.slug}`;
              cardBody.appendChild(idnLink);

              member.streaming_url_list.forEach((urlObj) => {
                const ProxyUrl = 'https://jkt48showroom-api.my.id/proxy?url=';
                const fullscreenBtn = document.createElement('a');
                fullscreenBtn.classList.add('btn-live', 'btn-primary');
                fullscreenBtn.innerHTML = '<span class="mdi mdi-video"></span>';

                const startDate = member.started_at ? encodeURIComponent(member.started_at) : 'Tidak diketahui';
                const viewers = member.viewers ? encodeURIComponent(member.viewers) : '0';

                fullscreenBtn.href = `idn.html#${ProxyUrl}${encodeURIComponent(urlObj.url)}&name=${encodeURIComponent(member.name)}&viewers=${viewers}&start_date=${startDate}&type=${encodeURIComponent(member.type)}`;
                cardBody.appendChild(fullscreenBtn);
              });
            }

            card.appendChild(cardBody);
            container.prepend(card);
          });
        }
      })
      .catch((error) => console.error('Error fetching NOW LIVE:', error));
  }

  // Fetch untuk SHOWROOM LIVE LIMIT
  fetchLiveData('.card-nowlive-container', true);

  // Fetch untuk SHOWROOM LIVE NO LIMIT
  fetchLiveData('.card-nowlive-container-up', false);
});