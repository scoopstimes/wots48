let currentPageIdn = 0x1;
let currentPageShowroom = 0x1;
document.addEventListener("DOMContentLoaded", function () {
  listLiveIdn();
  listLiveShowroom();
  function _0x525952() {
    console.log("Halaman recent live diperbarui pada: " + new Date().toLocaleString());
  }
  _0x525952();
  setInterval(function () {
    listLiveIdn();
    listLiveShowroom();
    _0x525952();
  }, 0xea60);
});
function listLiveIdn(_0x567fc4) {
  if (_0x567fc4 === 'prev' && currentPageIdn > 0x1) {
    currentPageIdn--;
  } else if (_0x567fc4 === "next") {
    currentPageIdn++;
  }
  fetch("https://api.crstlnz.my.id/api/recent?sort=date&page=" + currentPageIdn + "&filter=all&order=-1&group=jkt48&type=idn&perpage=3").then(_0x21e7fa => _0x21e7fa.json()).then(_0x3d20b7 => {
    const _0x3a1b3c = _0x3d20b7.recents.filter(_0x5a813d => _0x5a813d.idn.username !== 'ame-5xqz6mqgk4');
    document.getElementById("liveListIdn").innerHTML = '';
    _0x3a1b3c.map(_0x5ea784 => {
      const _0x272e4c = document.createElement("div");
      const _0x33d461 = {
        'year': 'numeric',
        'month': "long",
        'day': "numeric"
      };
      const _0x296de0 = new Date(_0x5ea784.live_info.date.start);
      const _0x4759f1 = new Date(_0x5ea784.live_info.date.end);
      const _0x4ec78b = _0x4759f1 - _0x296de0;
      const _0x154c20 = Math.floor(_0x4ec78b / 3600000);
      const _0x2342d3 = Math.floor(_0x4ec78b % 3600000 / 60000);
      let _0x3f87e0 = '';
      if (_0x154c20 > 0x0) {
        _0x3f87e0 = _0x154c20 + " Jam " + _0x2342d3 + " Menit";
      } else {
        _0x3f87e0 = _0x2342d3 + " Menit";
      }
      _0x272e4c.innerHTML = "\n                    <br><hr><br>\n                    <a href=\"dmember.html?id=" + _0x5ea784.member.url + "\">\n                        <div class=\"row-live\">\n                            <img src=\"" + _0x5ea784.member.img_alt + "\" class=\"postermemlive\" loading=\"lazy\">\n                            <div>\n                                <h3>👥 Nama Member: " + _0x5ea784.member.nickname + " JKT48</h3>\n                                <h3>💻 Streaming di : " + _0x5ea784.type + "</h3>\n                                <h3>🗓️ Tanggal Live: " + new Date(_0x5ea784.live_info.date.start).toLocaleDateString('id-ID', _0x33d461) + "</h3>\n                                <h3>⏱️ Durasi: " + _0x3f87e0 + "</h3>\n                                <h3>👀 Penonton: " + (_0x5ea784.live_info.viewers ? _0x5ea784.live_info.viewers.num + " viewers" : "data tidak tersedia") + "</h3>\n                                <h3>🎁 Gift: " + _0x5ea784.gift_rate + " G</h3>\n                            </div>\n                        </div>\n                    </a>\n                ";
      document.getElementById("liveListIdn").appendChild(_0x272e4c);
    });
    document.getElementById("prevButtonIdn").disabled = currentPageIdn === 0x1;
    document.getElementById("nextButtonIdn").disabled = currentPageIdn === Math.ceil(_0x3d20b7.total_count / 0x3);
  })["catch"](_0x3c131d => console.error("Error fetching data:", _0x3c131d));
}
function listLiveShowroom(_0x356b41) {
  if (_0x356b41 === "prev" && currentPageShowroom > 0x1) {
    currentPageShowroom--;
  } else if (_0x356b41 === "next") {
    currentPageShowroom++;
  }
  fetch("https://api.crstlnz.my.id/api/recent?group=jkt48&page=" + currentPageShowroom + "&perpage=3").then(_0xcd6d7b => _0xcd6d7b.json()).then(_0x3e6070 => {
    document.getElementById("liveListShowroom").innerHTML = '';
    _0x3e6070.recents.map(_0x403cf0 => {
      const _0x25eb1d = document.createElement("div");
      const _0x4083aa = {
        'year': "numeric",
        'month': "long",
        'day': "numeric"
      };
      const _0x1f52e7 = new Date(_0x403cf0.live_info.date.start);
      const _0x4fdb4f = new Date(_0x403cf0.live_info.date.end);
      const _0x378a0c = _0x4fdb4f - _0x1f52e7;
      const _0x474121 = Math.floor(_0x378a0c / 3600000);
      const _0x5f5016 = Math.floor(_0x378a0c % 3600000 / 60000);
      let _0x1dc162 = '';
      if (_0x474121 > 0x0) {
        _0x1dc162 = _0x474121 + " Jam " + _0x5f5016 + " Menit";
      } else {
        _0x1dc162 = _0x5f5016 + " Menit";
      }
      _0x25eb1d.innerHTML = "\n                    <br><hr><br>\n                    <a href=\"dmember.html?id=" + _0x403cf0.member.url + "\">\n                        <div class=\"row-live\">\n                            <img src=\"" + _0x403cf0.member.img_alt + "\" class=\"postermemlive\" loading=\"lazy\">\n                            <div>\n                                <h3>👥 Nama Member: " + _0x403cf0.member.name + "</h3>\n                                <h3>💻 Streaming di : " + _0x403cf0.type + "</h3>\n                                <h3>🗓️ Tanggal Live: " + new Date(_0x403cf0.live_info.date.start).toLocaleDateString('id-ID', _0x4083aa) + "</h3>\n                                <h3>⏱️ Durasi: " + _0x1dc162 + "</h3>\n                                <h3>👀 Penonton: " + (_0x403cf0.live_info.viewers ? _0x403cf0.live_info.viewers.num + " viewers" : "data tidak tersedia") + "</h3>\n                                <h3>🎁 Gift: " + _0x403cf0.gift_rate + " G</h3>\n                            </div>\n                        </div>\n                    </a>\n                ";
      document.getElementById('liveListShowroom').appendChild(_0x25eb1d);
    });
    document.getElementById('prevButtonShowroom').disabled = currentPageShowroom === 0x1;
    document.getElementById("nextButtonShowroom").disabled = _0x3e6070.recents.length < 0x3;
  })["catch"](_0xded9db => console.error("Error fetching data:", _0xded9db));
}