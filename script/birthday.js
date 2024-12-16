async function getUpcomingBirthdays() {
  try {
    const _0x504e72 = await fetch("https://api.crstlnz.my.id/api/next_birthday?group=jkt48");
    const _0x8b7c5b = await _0x504e72.json();
    const _0x327500 = _0x8b7c5b.slice(0, 10);
    const _0x54a9e6 = _0x327500.map(({
      name: _0x1539f5,
      birthdate: _0x2b87e2,
      img: _0x37d39b,
      url_key: _0x43709d
    }) => ({
      'name': _0x1539f5,
      'birthdate': _0x2b87e2,
      'img': _0x37d39b,
      'url_key': _0x43709d
    }));
    return _0x54a9e6;
  } catch (_0x2be9e7) {
    console.error("Error while fetching upcoming birthdays:", _0x2be9e7);
    return [];
  }
}
async function displayUpcomingBirthdays() {
  try {
    const _0xa42d85 = await getUpcomingBirthdays();
    const _0x1d2706 = document.querySelector(".birthnext");
    if (_0xa42d85.length === 0) {
      _0x1d2706.insertAdjacentHTML("beforeend", "\n                <div class=\"nobirthdaymessage\">\n                    <div class=\"thumb\">\n                        <div class=\"bdt\">\n                            <p>Tidak ada yang ulang tahun</br>😭😭😭</p>\n                        </div>\n                    </div>\n                </div>\n            ");
    } else {
      _0x1d2706.innerHTML = '';
      _0xa42d85.forEach(_0x5c7ec4 => {
        const {
          name: _0x577958,
          birthdate: _0x35763c,
          img: _0x50fb1b,
          url_key: _0x5bee7d
        } = _0x5c7ec4;
        const _0x454458 = "dmember.html?id=" + _0x5bee7d;
        const _0x4d7c4d = new Date(_0x35763c).toLocaleDateString('id', {
          'year': "numeric",
          'month': "long",
          'day': "numeric"
        });
        const _0x3323c6 = new Date();
        const _0x38283e = new Date(_0x35763c);
        _0x38283e.setFullYear(_0x3323c6.getFullYear());
        let _0x584376;
        if (_0x38283e < _0x3323c6) {
          _0x38283e.setFullYear(_0x3323c6.getFullYear() + 1);
          _0x584376 = 0;
        } else {
          const _0x1ec5ef = Math.abs(_0x38283e - _0x3323c6);
          _0x584376 = Math.ceil(_0x1ec5ef / 86400000);
        }
        let _0x1af7c4 = '';
        if (_0x584376 <= 1) {
          if (_0x584376 === 1) {
            _0x1af7c4 = "Besok";
          } else {
            _0x1af7c4 = "Hari Ini";
          }
        } else if (_0x584376 === 2) {
          _0x1af7c4 = "2 Hari Lagi";
        }
        const _0x5ad9d4 = "\n                    <div class=\"item\">\n                        <a href=\"" + _0x454458 + "\">\n                            <img src=\"" + _0x50fb1b + "\" alt=\"" + _0x454458 + " Image\" class=\"postermem\" loading=\"lazy\">\n                            <div>\n                                <h3>🎂 " + _0x577958 + " JKT48</h3>\n                                <h4>🗓️ " + _0x4d7c4d + "</h4></br>\n                                " + (_0x1af7c4 ? "<h5>" + _0x1af7c4 + "</h5>" : '') + "\n                            </div>\n                        </a>\n                    </div>\n                ";
        _0x1d2706.insertAdjacentHTML("beforeend", _0x5ad9d4);
      });
    }
    console.log("Halaman next birthday diperbarui pada: " + new Date().toLocaleString());
  } catch (_0x820adc) {
    console.error("Error while displaying upcoming birthdays:", _0x820adc);
  }
}
setInterval(displayUpcomingBirthdays, 60000);
displayUpcomingBirthdays();