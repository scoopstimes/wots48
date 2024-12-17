let currentPage = 0x1;
async function getEventMembers(_0x515366) {
  if (!_0x515366) {
    return null;
  }
  const _0x5862f4 = "https://api.crstlnz.my.id/api/theater/" + _0x515366;
  try {
    const _0x3d6089 = await fetch(_0x5862f4);
    const _0x48f1ad = await _0x3d6089.json();
    if (!_0x48f1ad || !Array.isArray(_0x48f1ad.shows) || _0x48f1ad.shows.length === 0x0) {
      console.error("Invalid event data format:", _0x48f1ad);
      return null;
    }
    const _0x674528 = _0x48f1ad.shows.flatMap(_0x236b50 => _0x236b50.members.map(_0x46bfc3 => _0x46bfc3.name));
    const _0x1d8b59 = _0x48f1ad.shows[0x0]?.["seitansai"] || null;
    return {
      'memberList': _0x674528,
      'seitansai': _0x1d8b59
    };
  } catch (_0x187225) {
    console.error("Error fetching event members:", _0x187225);
    return null;
  }
}
function loadTheater(_0x283547) {
  if (_0x283547 === "prev" && currentPage > 0x1) {
    currentPage--;
  } else if (_0x283547 === "next") {
    currentPage++;
  }
  fetch("https://api.crstlnz.my.id/api/theater?page=" + currentPage).then(_0x156f8f => _0x156f8f.json()).then(_0x4196bd => {
    document.getElementById("theaterList").innerHTML = '';
    const _0x7ad4ff = fetch("script/cdnpicture.json").then(_0x44db2c => _0x44db2c.json());
    Promise.all([_0x7ad4ff]).then(([_0x20f794]) => {
      const _0x33edf8 = _0x4196bd.theater;
      _0x33edf8.forEach(_0x514904 => {
        const _0x570228 = _0x20f794.find(_0x220b9a => _0x220b9a.setlist === _0x514904.title);
        const _0x24b1e9 = _0x570228 ? _0x570228.banner : '';
        const _0x50bc3e = {
          'year': "numeric",
          'month': "long",
          'day': "numeric"
        };
        const _0x2384e4 = _0x514904.date.substring(0xb, 0x10);
        const _0x20e06b = _0x514904.seitansai ? _0x514904.seitansai.map(_0x44d026 => _0x44d026.name).join(", ") : '';
        const _0x20547b = _0x20e06b.length > 0x0 ? "<h1>🎂 Seintansai: " + _0x20e06b + "</h1>" : '';
        const _0x1ff2a8 = document.createElement('div');
        _0x1ff2a8.innerHTML = "\n                        <br>\n                            <a href=\"dtheater?id=" + _0x514904.id + "\">\n                                <div class=\"row2\">\n                                    <div>\n                                        <img src=\"" + _0x24b1e9 + "\" class=\"poster\" loading=\"lazy\">\n                                    </div>\n                                    <div>\n                                        <h1>🎪 Theater : " + _0x514904.title + "</h1>\n                                        <h1>👥 Total Member : " + _0x514904.member_count + " Members</h1>\n                                        <h1>⏰ Start Show: " + _0x2384e4 + " WIB</h1>\n                                        <h1>🗓️ Tanggal Show : " + new Date(_0x514904.date).toLocaleDateString("id-ID", _0x50bc3e) + "</h1>\n                                        " + _0x20547b + "\n                                    </div>\n                                </div>\n                            </a><br><hr>\n                        ";
        document.getElementById("theaterList").appendChild(_0x1ff2a8);
      });
      const _0x23286d = _0x4196bd.total_pages || Math.ceil(_0x4196bd.total_count / 0x5);
      document.getElementById("prevButton").disabled = currentPage === 0x1;
      document.getElementById('nextButton').disabled = currentPage === _0x23286d;
    })['catch'](_0x3a29a2 => console.error("Error fetching cdnpicture data:", _0x3a29a2));
  })["catch"](_0x38810f => console.error("Error fetching data:", _0x38810f));
}
document.addEventListener("DOMContentLoaded", function () {
  loadTheater();
});
function detailTheater() {
  const _0x2eb4d9 = new URLSearchParams(window.location.search);
  const _0x591242 = _0x2eb4d9.get('id');
  let _0x3214bc = "https://api.crstlnz.my.id/api/theater";
  if (_0x591242) {
    _0x3214bc += '/' + _0x591242;
  }
  fetch(_0x3214bc).then(_0x570bca => _0x570bca.json()).then(_0x3976cd => {
    document.getElementById('theaterDetail').innerHTML = '';
    fetch("script/cdnpicture.json").then(_0xfff724 => _0xfff724.json()).then(_0x3bb839 => {
      _0x3976cd.shows.forEach(_0x5203bf => {
        const _0x1cf586 = _0x3bb839.find(_0x2686de => _0x2686de.setlist === _0x5203bf.title);
        const _0x553f11 = _0x1cf586 ? _0x1cf586.banner : '';
        const _0x1c53c9 = new Date(_0x5203bf.date);
        const _0x30af2d = {
          'timeZone': "Asia/Jakarta",
          'year': 'numeric',
          'month': "long",
          'day': "numeric"
        };
        const _0x4ba78d = {
          'timeZone': 'Asia/Jakarta',
          'hour': "numeric",
          'minute': "numeric"
        };
        const _0x30ac8e = _0x1c53c9.toLocaleString('id-ID', _0x30af2d);
        const _0x209a4f = _0x1c53c9.toLocaleString("id-ID", _0x4ba78d);
        const _0x5ccfbc = _0x5203bf.seitansai.length > 0x0 ? _0x5203bf.seitansai.map(_0x219347 => _0x219347.name).join(", ") : '';
        const _0x291dd3 = _0x5203bf.seitansai.length > 0x0 ? "<h3>🎂 Seintansai: " + _0x5ccfbc + "</h3>" : '';
        const _0x582d07 = _0x5203bf.members.length;
        const _0xe72ddf = "https://jkt48.com/theater/schedule/id/" + _0x5203bf.id;
        const _0x1aa7ec = _0x5203bf.showroomTheater && _0x5203bf.showroomTheater.entrance_url ? "<a href=\"" + _0x5203bf.showroomTheater.entrance_url + "\" class=\"btnn-beli\">\n                            <span class=\"icon\"><i class=\"fas fa-ticket\"></i></span>\n                            <span style=\"margin-right: 5px;\"></span> \n                            Beli tiket Online\n                        </a>" : '';
        const _0x1bc428 = document.createElement("div");
        _0x1bc428.innerHTML = "\n                        <h2 class=\"titleup\">⭐ Setlist Theater " + _0x5203bf.title + " ⭐</h2><br><hr><br>\n                        <div class=\"row2\">\n                            <img src=\"" + _0x553f11 + "\" style=\"max-width: 100%;\">\n                            <div>\n                                <h3>📒 Description Setlist: " + _0x5203bf.setlist.description + "</h3><br>\n                                <h3>📅 Tanggal Show: " + _0x30ac8e + "</h3>\n                                <h3>⏰ Waktu Show: " + _0x209a4f + " WIB</h3>\n                                " + _0x291dd3 + "\n                            </div>\n                        </div><br><hr>\n                        <h3 class=\"row2-up\">" + (_0x582d07 > 0x0 ? "Inilah total " + _0x582d07 + " member yang akan tampil di show " + _0x5203bf.title : "Untuk show ini lineup belum keluar 😭😭") + "</h3>\n                        <div class=\"row3\">\n                            " + (_0x582d07 > 0x0 ? _0x5203bf.members.map(_0x2933e6 => "\n                                <a href=\"" + (_0x2933e6.url_key ? "dmember.html?id=" + _0x2933e6.url_key : 'notfound.html') + "\">\n                                    <img src=\"" + _0x2933e6.img + "\" class=\"postermem2\" loading=\"lazy\">\n                                    <h3 class=\"titleup-detail\">" + _0x2933e6.name + "</h3>\n                                </a>\n                            ").join('') : '') + "\n                        </div>\n                        <br><hr><br>\n                        <div style=\"display: flex; justify-content: center;\">\n                        <a href=\"" + _0xe72ddf + "\" class=\"btnn-beli\">\n                            <span class=\"icon\"><i class=\"fas fa-ticket\"></i></span>\n                            <span style=\"margin-right: 5px;\"></span> \n                            Beli tiket Offline\n                        </a>\n                        " + _0x1aa7ec + "\n                    </div>\n                    ";
        document.getElementById('theaterDetail').appendChild(_0x1bc428);
      });
    })["catch"](_0x6980f7 => console.error("Error fetching cdnpicture data:", _0x6980f7));
  })["catch"](_0x1ec876 => console.error("Error fetching data:", _0x1ec876));
}
document.addEventListener("DOMContentLoaded", function () {
  detailTheater();
});
