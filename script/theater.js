async function fetchCDNPictureData() {
  try {
    const _0x7f03d5 = await fetch('script/cdnpicture.json');
    if (!_0x7f03d5.ok) {
      throw new Error("Failed to fetch CDN picture data");
    }
    return await _0x7f03d5.json();
  } catch (_0x3a85bc) {
    console.error("Error fetching CDN picture data:", _0x3a85bc);
    return [];
  }
}
async function nextTheater() {
  try {
    const _0x434edc = await fetch("https://api.crstlnz.my.id/api/event");
    const _0x46c748 = await _0x434edc.json();
    const _0x19090f = document.getElementById("upcoming");
    _0x19090f.innerHTML = '';
    const _0x5c3685 = await fetch('script/cdnpicture.json');
    const _0x1b1cdd = await _0x5c3685.json();
    const _0x33f959 = new Date();
    const _0x14da25 = new Date(_0x33f959);
    _0x14da25.setDate(_0x14da25.getDate() + 0x1);
    if (!_0x46c748.theater || _0x46c748.theater.upcoming.length === 0x0) {
      document.getElementById("noTheaterMessage").textContent = "Tidak ada theater 😭😭";
      document.getElementById("noTheaterMessage").style.display = "block";
      return;
    }
    for (const _0x27401a of _0x46c748.theater.upcoming) {
      const _0x641d46 = _0x1b1cdd.find(_0x4cb0e3 => _0x4cb0e3.setlist.trim() === _0x27401a.title.trim());
      const _0x2fc9f3 = _0x641d46 ? _0x641d46.banner : _0x27401a.banner;
      const _0x237de7 = new Date(_0x27401a.date);
      const _0x3a2e74 = {
        'timeZone': "Asia/Jakarta",
        'year': 'numeric',
        'month': 'long',
        'day': "numeric"
      };
      const _0x2763e3 = {
        'timeZone': "Asia/Jakarta",
        'hour': "numeric",
        'minute': "numeric"
      };
      const _0x59a5d1 = _0x237de7.toLocaleString("id-ID", _0x3a2e74);
      const _0xf409de = _0x237de7.toLocaleString('id-ID', _0x2763e3);
      const _0x16857d = _0x27401a.seitansai && _0x27401a.seitansai.length > 0x0 ? _0x27401a.seitansai.map(_0x4dd941 => _0x4dd941.name).join(", ") : '';
      const _0x261d70 = _0x16857d ? "<h3>🎂 " + _0x16857d + "</h3>" : '';
      const _0x150cb5 = _0x237de7.toDateString() === _0x33f959.toDateString() ? _0x237de7 <= new Date() ? "Sedang Berlangsung" : "Hari ini" : _0x237de7.toDateString() === _0x14da25.toDateString() ? "Besok" : _0x59a5d1;
      const _0x450d7d = new Date().toLocaleTimeString('en-US', {
        'hour12': false,
        'hour': "2-digit",
        'minute': "2-digit"
      });
      const _0x2d111f = _0x237de7.toDateString() === _0x33f959.toDateString() && _0xf409de <= _0x450d7d;
      const _0x31d6f2 = _0x2d111f ? "Sedang Berlangsung" : _0x150cb5;
      const _0x4fa1fa = document.createElement('div');
      _0x4fa1fa.classList.add('card-up');
      _0x4fa1fa.innerHTML = "\n                <a href=\"dtheater?id=" + _0x27401a.id + "\" class=\"btnn\">\n                    <h2>" + _0x31d6f2 + "</h2>\n                    <img src=\"" + _0x2fc9f3 + "\" class=\"poster-event\" loading=\"lazy\"><br>\n                    <h3>🎪 " + _0x27401a.title + "</h3>\n                    <h3>🗓️ " + _0x59a5d1 + "</h3>\n                    <h3>⏰  " + _0xf409de + " WIB</h3>\n                    <h3>⭐ " + _0x27401a.member_count + " </h3>\n                    " + _0x261d70 + "\n                    <br><div style=\"display: flex; justify-content: center; align-items: center;\"><h1>Cek Info</h1></div>\n                </a>\n            ";
      _0x19090f.appendChild(_0x4fa1fa);
    }
  } catch (_0x403052) {
    console.error("Error fetching data:", _0x403052);
  }
}
function getTheaterId(_0x214a74) {
  if (!_0x214a74) {
    return null;
  }
  return _0x214a74;
}
document.addEventListener("DOMContentLoaded", function () {
  nextTheater();
});