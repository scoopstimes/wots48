async function fetchMembers() {
  try {
    const _0x2e4d86 = await fetch("https://intensprotectionexenew.vercel.app/api/member");
    const _0xc330fc = await _0x2e4d86.json();
    const _0x3ca2e1 = _0xc330fc.members?.["member"];
    if (!Array.isArray(_0x3ca2e1)) {
      throw new Error("Data is not in the expected format");
    }
    const _0x10ac8b = await fetch("/data/member.json").then(_0xdcacd0 => _0xdcacd0.json());
    document.getElementById("core-members").innerHTML = '';
    document.getElementById("trainee-members").innerHTML = '';
    _0x3ca2e1.forEach(_0x1d7aa1 => {
      const _0x462ac2 = _0x10ac8b.find(_0x476a93 => _0x476a93.name === _0x1d7aa1.nama_member);
      const _0x4345a8 = _0x462ac2 ? _0x462ac2.generation : "Unknown";
      const _0x5c6986 = "\n                <div class=\"flex flex-col items-center text-center\">\n                    <div class=\"relative  max-w-sm  mb-2\">\n                        <img src=\"https://jkt48.com" + _0x1d7aa1.ava_member + "\" \n                            alt=\"" + _0x1d7aa1.nama_member + "\" \n                            onerror=\"this.src='/assets/img/default-avatar.jpg'\"\n                            class=\"w-full h-full object-cover rounded-lg shadow-lg\">\n                        <div class=\"absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-1/2 rounded-b-lg\"></div>\n                        <div class=\"absolute bottom-2 left-2 bg-gradient-to-r from-pink-300/85 via-purple-300/85 to-cyan-300/85 rounded-lg px-2 py-1 text-xs text-gray-900\">\n                            " + _0x4345a8 + "\n                        </div>\n                    </div>\n                    <div class=\"text-center w-full\">\n                        <a href=\"/dmember/" + _0x1d7aa1.id_member + "\" \n                            class=\"bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 inline-block hover:bg-white/20 transition-all duration-200\">\n                            <h3 class=\"text-sm text-white\">" + _0x1d7aa1.nama_member + "</h3>\n                        </a>\n                    </div>\n                </div>\n            ";
      if (_0x1d7aa1.kategori === "Anggota JKT48") {
        document.getElementById("core-members").innerHTML += _0x5c6986;
      } else if (_0x1d7aa1.kategori === "Trainee JKT48") {
        document.getElementById("trainee-members").innerHTML += _0x5c6986;
      }
    });
  } catch (_0x1902b6) {
    console.error("Error fetching members:", _0x1902b6);
    document.getElementById("core-members").innerHTML = "\n            <div class=\"col-span-full text-center text-gray-400\">\n                <i class=\"fas fa-exclamation-circle text-2xl mb-2\"></i>\n                <p>Failed to load data 😭</p>\n            </div>\n        ";
    document.getElementById("trainee-members").innerHTML = "\n            <div class=\"col-span-full text-center text-gray-400\">\n                <i class=\"fas fa-exclamation-circle text-2xl mb-2\"></i>\n                <p>Failed to load data 😭</p>\n            </div>\n        ";
  }
}
const loadingSkeleton = "\n    <div class=\"animate-pulse flex flex-col items-center text-center\">\n        <div class=\"w-full h-40 sm:h-48 bg-gray-700 rounded-lg mb-4\"></div>\n        <div class=\"h-6 bg-gray-700/30 rounded-lg w-3/4 mb-2\"></div>\n        <div class=\"h-4 bg-gray-700/20 rounded-lg w-1/2\"></div>\n    </div>\n".repeat(4);
document.getElementById("core-members").innerHTML = loadingSkeleton;
document.getElementById("trainee-members").innerHTML = loadingSkeleton;
fetchMembers();