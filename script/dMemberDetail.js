async function getMemberId() {
  const _0x2bda8f = window.location.pathname.split('/');
  return _0x2bda8f[_0x2bda8f.length - 1];
}
async function getSSKData(_0x335120) {
  try {
    const _0xcb09d4 = await fetch("/data/ssk.json");
    if (!_0xcb09d4.ok) {
      return null;
    }
    const _0x4f1c0f = await _0xcb09d4.json();
    return _0x4f1c0f.find(_0x1cae19 => _0x1cae19.id === _0x335120);
  } catch (_0x196d78) {
    console.error("Error fetching SSK data:", _0x196d78);
    return null;
  }
}
async function getMemberJsonData() {
  try {
    const _0x5d7275 = await fetch("/data/member.json");
    if (!_0x5d7275.ok) {
      return null;
    }
    return await _0x5d7275.json();
  } catch (_0x23c2b3) {
    console.error("Error fetching member JSON data:", _0x23c2b3);
    return null;
  }
}
async function fetchMemberDetail() {
  try {
    const _0x26c9ad = await getMemberId();
    if (!_0x26c9ad) {
      throw new Error("Member ID not found 😭");
    }
    const [_0x10b301, _0x417baf, _0x28968b] = await Promise.all([fetch("https://intensprotectionexenew.vercel.app/api/member/" + _0x26c9ad), getSSKData(_0x26c9ad), getMemberJsonData()]);
    if (!_0x10b301.ok) {
      throw new Error("Failed to fetch member data");
    }
    const _0x353609 = await _0x10b301.json();
    const _0x58cba9 = _0x28968b?.["find"](_0x2a3a18 => _0x2a3a18.name === _0x353609.name);
    const _0x12770d = _0x58cba9?.["video_perkenalan"] || '';
    document.getElementById("loading-skeleton").classList.add("hidden");
    const _0x156290 = document.getElementById("member-content");
    _0x156290.classList.remove("hidden");
    _0x156290.innerHTML = "\n            <div class=\"p-4 md:p-8 relative\">\n                <div class=\"flex flex-col md:flex-row gap-8\">\n                    <div class=\"w-full md:w-1/3 lg:w-1/4\">\n                        <div class=\"relative\">\n                            <div class=\"relative w-full max-w-sm rounded-lg shadow-lg\">\n                                <img src=\"" + (_0x353609.profileImage || '') + "\" \n                                    alt=\"" + (_0x353609.name || "Member") + "\" \n                                    class=\"w-full max-w-sm object-cover rounded-lg\"\n                                    onerror=\"this.src='/assets/img/default-avatar.jpg'\">\n                            </div>\n                            <div class=\"mt-4 md:hidden flex justify-center\">\n                                <a href=\"https://ssk.jkt48.com/2024/id/vote\" \n                                    class=\"inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300  text-white font-medium shadow-lg w-full justify-center\">\n                                    Vote\n                                </a>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"flex-1 space-y-6\">\n                        <div class=\"flex items-start justify-between\">\n                            <div class=\"space-y-2\">\n                                <h1 class=\"text-2xl md:text-3xl lg:text-4xl font-bold\">" + (_0x353609.name || "Unknown Member") + "</h1>\n                                <p class=\"text-pink-500 text-lg\">" + (_0x353609.nickname || '-') + "</p>\n                            </div>\n                            <div class=\"hidden md:block\">\n                                <a href=\"https://ssk.jkt48.com/2024/id/vote\" \n                                    class=\"inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 transition-colors text-white font-medium shadow-lg\">\n                                    Vote\n                                </a>\n                            </div>\n                        </div>\n\n                        <div class=\"grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6\">\n                            <div class=\"bg-gray-700 p-4 rounded-lg\">\n                                <p class=\"text-gray-400 text-sm\">Birthday</p>\n                                <p class=\"font-medium\">" + (_0x353609.birthdate || '-') + "</p>\n                            </div>\n                            <div class=\"bg-gray-700 p-4 rounded-lg\">\n                                <p class=\"text-gray-400 text-sm\">Blood Type</p>\n                                <p class=\"font-medium\">" + (_0x353609.bloodType || '-') + "</p>\n                            </div>\n                            <div class=\"bg-gray-700 p-4 rounded-lg\">\n                                <p class=\"text-gray-400 text-sm\">Height</p>\n                                <p class=\"font-medium\">" + (_0x353609.height || '-') + "</p>\n                            </div>\n                            <div class=\"bg-gray-700 p-4 rounded-lg\">\n                                <p class=\"text-gray-400 text-sm\">Zodiac</p>\n                                <p class=\"font-medium\">" + (_0x353609.zodiac || '-') + "</p>\n                            </div>\n                        </div>\n\n                        " + (_0x353609.socialMedia ? "\n                            <div class=\"pt-6\">\n                                <h2 class=\"text-xl font-semibold mb-4\">Social Media</h2>\n                                <div class=\"flex flex-wrap gap-4\">\n                                    " + (_0x353609.socialMedia.twitter ? "\n                                        <a href=\"" + _0x353609.socialMedia.twitter + "\" \n                                            target=\"_blank\" \n                                            rel=\"noopener noreferrer\" \n                                            class=\"flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors\">\n                                                <i class=\"fab fa-twitter\"></i>\n                                                <span class=\"hidden sm:inline\">Twitter</span>\n                                        </a>\n                                    " : '') + "\n                                    " + (_0x353609.socialMedia.instagram ? "\n                                        <a href=\"" + _0x353609.socialMedia.instagram + "\" \n                                            target=\"_blank\" \n                                            rel=\"noopener noreferrer\"\n                                            class=\"flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors\">\n                                                <i class=\"fab fa-instagram\"></i>\n                                                <span class=\"hidden sm:inline\">Instagram</span>\n                                        </a>\n                                    " : '') + "\n                                    " + (_0x353609.socialMedia.tiktok ? "\n                                        <a href=\"" + _0x353609.socialMedia.tiktok + "\" \n                                            target=\"_blank\" \n                                            rel=\"noopener noreferrer\"\n                                            class=\"flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors\">\n                                                <i class=\"fab fa-tiktok\"></i>\n                                                <span class=\"hidden sm:inline\">TikTok</span>\n                                        </a>\n                                    " : '') + "\n                                </div>\n                            </div>\n                        " : '') + "\n\n                        " + (_0x417baf?.["data"]?.["url_video"] || _0x12770d ? "\n                            <div class=\"pt-6\">\n                                <h2 class=\"text-xl font-semibold mb-4\">\n                                    <i class=\"fa-solid fa-crown mr-2\"></i>\n                                    " + (_0x417baf?.["data"]?.["url_video"] ? "Sousenkyo 2024" : "Introduction Video") + "\n                                </h2>\n                                <div class=\"aspect-video w-full rounded-lg overflow-hidden\">\n                                    <iframe\n                                        width=\"100%\"\n                                        height=\"100%\"\n                                        src=\"https://www.youtube.com/embed/" + (_0x417baf?.["data"]?.["url_video"] || _0x12770d) + "\"\n                                        title=\"" + (_0x417baf?.["data"]?.["url_video"] ? "Sousenkyo Video" : "Introduction Video") + "\"\n                                        frameborder=\"0\"\n                                        allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture\"\n                                        allowfullscreen\n                                    ></iframe>\n                                </div>\n                            </div>\n                        " : '') + "\n                    </div>\n                </div>\n            </div>";
  } catch (_0x65b6d6) {
    console.error("Error fetching member details:", _0x65b6d6);
    document.getElementById("loading-skeleton").classList.add("hidden");
    const _0x3466c3 = document.getElementById("member-content");
    _0x3466c3.classList.remove("hidden");
    _0x3466c3.innerHTML = "\n            <div class=\"flex flex-col items-center justify-center p-8 text-center\">\n                <div class=\"rounded-lg p-8 max-w-md w-full\">\n                    <i class=\"fas fa-exclamation-circle text-4xl text-pink-500 mb-4\"></i>\n                    <h2 class=\"text-xl font-bold mb-2\">Oops!</h2>\n                    <p class=\"text-gray-400 mb-4\">Gagal mendapatkan data member 😭</p>\n                </div>\n            </div>";
  }
}
fetchMemberDetail();