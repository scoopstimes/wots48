document.addEventListener("DOMContentLoaded", function () {
  const sumber = 'https://api.crstlnz.my.id/api/now_live?group=jkt48';

  // Fungsi utama untuk mengambil dan menampilkan data live
  
function cleanLiveTitle(title) {
  // Menghapus tanda '-' yang ada di tengah kalimat, dan angka yang ada di akhir kalimat
  const cleanedTitle = title.replace(/-\s?/g, ' ') // 
                             .replace(/-\d+$/, '') // Menghapus angka setelah tanda '-' di akhir judul
                             .replace(/\d+$/, '') // Menghapus angka yang ada di akhir judul
                             .trim(); // Menghapus spasi yang tidak perlu

  return cleanedTitle.charAt(0).toUpperCase() + cleanedTitle.slice(1); // Huruf pertama menjadi kapital
}
  function fetchLiveData(containerSelector, isLimit = true) {
    fetch(sumber)
      .then(response => response.json())
      .then(data => {
        const container = document.querySelector(containerSelector);
        container.innerHTML = ''; // Bersihkan container

        const liveMembers = data.filter(member => member.started_at);
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
          liveMembers.slice(0, isLimit ? 100 : liveMembers.length).forEach(member => {
            console.log(member);
            const card = document.createElement('div');
            card.style = `
              background-color: #2A3347;
              border-radius: 10px;
              padding-top:10px;
              padding-bottom:20px;
              padding-right:10px;
              padding-left:10px;
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
// Tambahkan pengecekan jika nama sudah "JKT48", tidak perlu menambahkannya lagi
title.textContent = member.name + (member.type === 'idn' && member.name !== 'JKT48' ? ' JKT48' : '');
title.style = `
  font-size: 14px;
  font-weight: bold;
`;
card.appendChild(title);

            const liveType = document.createElement('p');
liveType.textContent = `${member.type === 'idn' ? 'IDN Live' : 'Showroom'}`;
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
  const showroomLink = document.createElement('button');
  showroomLink.classList.add('gotoweb', 'btn-live-link', 'btn-primary');
  showroomLink.innerHTML = '<span class="mdi mdi-arrow-top-right-thin-circle-outline"></span>';

  // URL tujuan
  const url = showroomUrl + (member.url_key || '');
  showroomLink.setAttribute('onclick', `window.open('${url}', '_blank')`);

  cardBody.appendChild(showroomLink);

  if (Array.isArray(member.streaming_url_list)) {
    member.streaming_url_list.forEach(urlObj => {
      if (urlObj.label === 'original quality' && urlObj.url) {
        const fullscreenBtn = document.createElement('button');
        fullscreenBtn.classList.add('gotoweb', 'btn-live', 'btn-primary');
        fullscreenBtn.innerHTML = '<span class="mdi mdi-video"></span>';

        const startDate = member.started_at ? encodeURIComponent(member.started_at) : 'Tidak diketahui';
        const viewers = member.viewers ? encodeURIComponent(member.viewers) : '0';
        const link = `showroom2.html#url=${encodeURIComponent(urlObj.url)}&name=${encodeURIComponent(member.name)}&viewers=${viewers}&start_date=${startDate}&type=${encodeURIComponent(member.type)}`;

        fullscreenBtn.setAttribute('onclick', `goToLink('${link}')`);
        cardBody.appendChild(fullscreenBtn);
      }
    });
  }
} else if (member.type === 'idn') {
  const idnLink = document.createElement('button');
  
  idnLink.classList.add('gotoweb', 'btn-live-link', 'btn-primary');
  idnLink.innerHTML = `<span class="mdi mdi-arrow-top-right-thin-circle-outline"></span>`;
  const url = `${idnUrl}${member.url_key}/live/${member.slug}`;
  idnLink.setAttribute('onclick', `window.open('${url}', '_blank')`);
  cardBody.appendChild(idnLink);

  if (Array.isArray(member.streaming_url_list)) {
    member.streaming_url_list.forEach((urlObj) => {
      const ProxyUrl = 'https://jkt48showroom-api.my.id/proxy?url=';
      if (urlObj.url) {
        const fullscreenBtn = document.createElement('a');
        fullscreenBtn.classList.add('btn-live', 'btn-primary');
        fullscreenBtn.innerHTML = '<span class="mdi mdi-video"></span>';

        // Tambahkan slug ke URL halaman idn.html
        const startDate = member.started_at ? encodeURIComponent(member.started_at) : 'Tidak diketahui';
        const viewers = member.viewers ? encodeURIComponent(member.viewers) : '0';
        const cleanedSlug = cleanLiveTitle(member.slug || '');

     const link = `idn2.html#url=${ProxyUrl}${encodeURIComponent(urlObj.url)}&name=${encodeURIComponent(member.name)}&viewers=${viewers}&start_date=${startDate}&type=${encodeURIComponent(member.type)}&slug=${encodeURIComponent(cleanedSlug)}&link=${encodeURIComponent(url)}`;
     fullscreenBtn.setAttribute('onclick', `goToLink('${link}')`);
        cardBody.appendChild(fullscreenBtn);
      }
    });
  }
}

card.appendChild(cardBody);

// Tambahkan kartu di awal container
container.prepend(card);
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

