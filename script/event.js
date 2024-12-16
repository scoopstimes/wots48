function listEvent(_0x1b8fcd) {
  fetch("https://api.crstlnz.my.id/api/next_schedule").then(_0xe3acce => _0xe3acce.json()).then(_0x1c62b8 => {
    const _0x947132 = _0x1c62b8.filter(_0x9c05c2 => _0x9c05c2.url.startsWith('/event/schedule/id/') || _0x9c05c2.url.startsWith("/calendar/list/"));
    const _0x26e222 = _0x947132.slice(0x0, 0x5);
    document.getElementById("eventList").innerHTML = '';
    _0x26e222.forEach(_0x314221 => {
      const _0x473cb5 = _0x314221.title.replace(/^\d{2}:\d{2}\s/, '').replace(/^\d{8}-\d{2}:\d{2}-/, '').replace(/^\d{4}-\d{2}-\d{2}-\d{2}:\d{2}-/, '').replace(/^\d{4}-\d{2}-\d{2}-\d{2}:\d{2}-/, '');
      const _0x1e8f1f = document.createElement("div");
      const _0x1453c3 = {
        'year': "numeric",
        'month': 'long',
        'day': 'numeric'
      };
      _0x1e8f1f.innerHTML = "\n                    <br>\n                    <div class=\"row1\">\n                        <img src=\"https://res.cloudinary.com/haymzm4wp/image/upload/assets/jkt48" + _0x314221.label + "\" alt=\"Category Icon\">\n                        <h4 class=\"date\">" + new Date(_0x314221.date).toLocaleDateString('id-ID', _0x1453c3) + "</h4>\n                    </div>\n                    <h2>⭐ " + _0x473cb5 + "</h2><br><hr>\n                ";
      document.getElementById('eventList').appendChild(_0x1e8f1f);
    });
  })['catch'](_0x5886dd => console.error("Error fetching data:", _0x5886dd));
}
document.addEventListener("DOMContentLoaded", function () {
  listEvent();
});
function listEventt(_0x2a16e2) {
  fetch("https://api.crstlnz.my.id/api/next_schedule").then(_0x4b9e5f => _0x4b9e5f.json()).then(_0x2c7502 => {
    const _0x5d43a2 = _0x2c7502.filter(_0x11a309 => _0x11a309.url.startsWith("/event/schedule/id/") || _0x11a309.url.startsWith("/calendar/list/"));
    const _0x1b8d71 = _0x5d43a2.slice(0x0, 0xa);
    document.getElementById("eventList-dir").innerHTML = '';
    _0x1b8d71.forEach(_0x2aba79 => {
      const _0x5ef58c = _0x2aba79.title.replace(/^\d{2}:\d{2}\s/, '').replace(/^\d{8}-\d{2}:\d{2}-/, '').replace(/^\d{4}-\d{2}-\d{2}-\d{2}:\d{2}-/, '').replace(/^\d{4}-\d{2}-\d{2}-\d{2}:\d{2}-/, '');
      const _0x322845 = document.createElement("div");
      const _0x43ffe0 = {
        'year': "numeric",
        'month': 'long',
        'day': "numeric"
      };
      _0x322845.innerHTML = "\n                    <br>\n                    <div class=\"row1\">\n                        <img src=\"https://res.cloudinary.com/haymzm4wp/image/upload/assets/jkt48" + _0x2aba79.label + "\" alt=\"Category Icon\">\n                        <h4 class=\"date\">" + new Date(_0x2aba79.date).toLocaleDateString('id-ID', _0x43ffe0) + "</h4>\n                    </div>\n                    <h2>⭐ " + _0x5ef58c + "</h2><br><hr>\n                ";
      document.getElementById("eventList-dir").appendChild(_0x322845);
    });
  })["catch"](_0x36c0a2 => console.error("Error fetching data:", _0x36c0a2));
}
document.addEventListener('DOMContentLoaded', function () {
  listEventt();
});
async function recentTheater() {
  try {
    const _0x180367 = await fetch('https://api.crstlnz.my.id/api/event');
    const _0x1179f2 = await _0x180367.json();
    const _0x5ecd75 = document.getElementById("recent");
    _0x5ecd75.innerHTML = '';
    const _0x867aa5 = await fetch("script/cdnpicture.json");
    const _0x31ea16 = await _0x867aa5.json();
    const _0x48567b = {
      'year': "numeric",
      'month': "long",
      'day': "numeric"
    };
    if (_0x1179f2.theater.recent.length === 0x0) {
      document.getElementById("noTheaterMessage").textContent = "Tidak ada theater 😢😢";
      document.getElementById("noTheaterMessage").style.display = "block";
      return;
    }
    const _0xc9f6a7 = _0x1179f2.theater.recent.slice(0x0, 0x3);
    for (const _0xc66887 of _0xc9f6a7) {
      const _0x30b502 = _0x31ea16.find(_0x40cf7e => _0x40cf7e.setlist === _0xc66887.title);
      const _0x3ef67e = _0x30b502 ? _0x30b502.banner : '';
      const _0x31bb7b = _0xc66887.seitansai && _0xc66887.seitansai.length > 0x0 ? _0xc66887.seitansai.map(_0x2adece => _0x2adece.name).join(", ") : '';
      const _0x5f04c5 = _0x31bb7b ? "<h3>🎂 Seintansai: " + _0x31bb7b + "</h3>" : '';
      const _0x2418a0 = document.createElement("div");
      _0x2418a0.classList.add("card-up-recent");
      _0x2418a0.innerHTML = "\n                <a href=\"dtheater?id=" + _0xc66887.id + "\">\n                    <img src=\"" + _0x3ef67e + "\" class=\"poster-event\" loading=\"lazy\"><br>\n                    <h3>🎪 Theater: " + _0xc66887.title + "</h3>\n                    <h3>⭐ Total Member : " + _0xc66887.member_count + " member yang tampil</h3>\n                    <h3>🗓️ Tanggal Show: " + new Date(_0xc66887.date).toLocaleDateString("id-ID", _0x48567b) + "</h3>\n                    " + _0x5f04c5 + "\n                    <br>\n                </a>  \n                <br>\n            ";
      _0x5ecd75.appendChild(_0x2418a0);
    }
  } catch (_0x494fdc) {
    console.error("Error fetching data:", _0x494fdc);
  }
}
document.addEventListener("DOMContentLoaded", function () {
  recentTheater();
});