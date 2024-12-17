document.addEventListener("DOMContentLoaded", function () {
  const sumber = 'https://api.crstlnz.my.id/api/now_live?group=jkt48';

  // Fungsi utama untuk mengambil dan menampilkan data live
  function fetchLiveData(containerSelector, isLimit = true) {
    fetch(sumber)
      .then(response => response.json())
      .then(data => {
        const container = document.querySelector(containerSelector);
        container.innerHTML = ''; // Bersihkan container

        const liveMembers = data.filter(member => member.started_at);
        const liveCount = liveMembers.length;

        // Menampilkan jumlah member yang sedang live
        document.getElementById('liveCount').textContent = ` ${liveCount} member`;

        if (liveCount === 0) {
          document.getElementById('noLiveMessage').textContent = 'Tidak ada yang live ';
        } else {
          document.getElementById('noLiveMessage').textContent = '';

          const idnUrl = 'https://www.idn.app/';

          liveMembers.slice(0, isLimit ? 2 : liveMembers.length).forEach(member => {
            const card = document.createElement('div');
            card.style = `
              background-color: #2c2c2e; 
              border-radius: 10px; 
              padding: 10px; 
              width: 150px; 
              position: relative;`;

            const img = document.createElement('img');
            img.src = member.img;
            img.alt = member.name;
            img.style = 'width: 100%; height: 150px; border-radius: 10px;';
            card.appendChild(img);

            const title = document.createElement('div');
            title.textContent = member.name;
            title.style = 'font-size: 14px; margin-top: 10px; font-weight: bold;';
            card.appendChild(title);

            const optionsIcon = document.createElement('div');
            optionsIcon.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
            optionsIcon.style = 'position: absolute; top: 10px; right: 10px; color: #b0b0b0;';
            card.appendChild(optionsIcon);

            // Tombol Nonton Sesuai Permintaan
            const cardBody = document.createElement('div');
            cardBody.style = 'margin-top: 10px; display: flex; justify-content: center; gap: 10px;'

            if (member.type === 'showroom') {
              const showroomUrl = 'https://www.showroom-live.com/r/';
              const showroomLink = document.createElement('a');
              showroomLink.classList.add('btn-live-link', 'btn-primary', 'mx-2');
              showroomLink.innerHTML = ' <span class="mdi mdi-arrow-top-right-thin-circle-outline"></span>';
              showroomLink.href = showroomUrl + member.url_key;
              showroomLink.target = '_blank';
              cardBody.appendChild(showroomLink);

              member.streaming_url_list.forEach(urlObj => {
                if (urlObj.label === 'original quality') {
                  const fullscreenBtn = document.createElement('a');
                  fullscreenBtn.classList.add('btn-live', 'btn-primary', 'mx-2');
                  fullscreenBtn.innerHTML = '<span class="mdi mdi-video"></span>';
                  fullscreenBtn.href = `showroom.html#${encodeURIComponent(urlObj.url)}`;
                  
                  cardBody.appendChild(fullscreenBtn);
                }
              });
            } else if (member.type === 'idn') {
              const idnLink = document.createElement('a');
              idnLink.classList.add('btn-live-link', 'btn-primary', 'mx-2');
              idnLink.innerHTML = '<span class="mdi mdi-arrow-top-right-thin-circle-outline"></span>';
              idnLink.href = `${idnUrl}${member.url_key}/live/${member.slug}`;
              
              cardBody.appendChild(idnLink);

              member.streaming_url_list.forEach(urlObj => {
                const ProxyUrl = 'https://jkt48showroom-api.my.id/proxy?url=';
                const fullscreenBtn = document.createElement('a');
                fullscreenBtn.classList.add('btn-live', 'btn-primary', 'mx-2');
                fullscreenBtn.innerHTML = '<span class="mdi mdi-video"></span>'
                fullscreenBtn.href = `showroom.html#${ProxyUrl}${encodeURIComponent(urlObj.url)}`;
                
                cardBody.appendChild(fullscreenBtn);
              });
            }

            card.appendChild(cardBody);
            container.appendChild(card);
          });
        }
      })
      .catch(error => console.error('Error fetching NOW LIVE:', error));
  }

  // Fetch untuk SHOWROOM LIVE LIMIT
  fetchLiveData('.card-nowlive-container', true);

  // Fetch untuk SHOWROOM LIVE NO LIMIT
  fetchLiveData('.card-nowlive-container-up', false);
});