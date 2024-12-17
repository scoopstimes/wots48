async function fetchMembers() {
  try {
    const response = await fetch("https://intensprotectionexenew.vercel.app/api/member");
    const data = await response.json();
    const members = data.members?.["member"];

    if (!Array.isArray(members)) {
      throw new Error("Data is not in the expected format");
    }

    const localData = await fetch("/data/member.json").then(res => res.json());
    document.getElementById("core-members").innerHTML = '';
    document.getElementById("trainee-members").innerHTML = '';

    members.forEach(member => {
      const localMember = localData.find(local => local.name === member.nama_member);
      const generation = localMember ? localMember.generation : "Unknown";

      const memberCard = `
        <div class="flex flex-col items-center text-center">
          <div class="relative max-w-sm mb-2">
            <img src="https://jkt48.com${member.ava_member}" 
                 alt="${member.nama_member}" 
                 onerror="this.src='/assets/img/default-avatar.jpg'"
                 class="w-full h-full object-cover rounded-lg shadow-lg">
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent h-1/2 rounded-b-lg"></div>
            <div class="absolute bottom-2 left-2 bg-gradient-to-r from-pink-300/85 via-purple-300/85 to-cyan-300/85 rounded-lg px-2 py-1 text-xs text-gray-900">
              ${generation}
            </div>
          </div>
          <div class="text-center w-full">
            <a href="dmember.html?id=${member.id_member}" 
               class="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 inline-block hover:bg-white/20 transition-all duration-200">
              <h3 class="text-sm text-white">${member.nama_member}</h3>
            </a>
          </div>
        </div>
      `;

      if (member.kategori === "Anggota JKT48") {
        document.getElementById("core-members").innerHTML += memberCard;
      } else if (member.kategori === "Trainee JKT48") {
        document.getElementById("trainee-members").innerHTML += memberCard;
      }
    });
  } catch (error) {
    console.error("Error fetching members:", error);
    document.getElementById("core-members").innerHTML = `
      <div class="col-span-full text-center text-gray-400">
        <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
        <p>Failed to load data 😭</p>
      </div>
    `;
    document.getElementById("trainee-members").innerHTML = `
      <div class="col-span-full text-center text-gray-400">
        <i class="fas fa-exclamation-circle text-2xl mb-2"></i>
        <p>Failed to load data 😭</p>
      </div>
    `;
  }
}

// Loading skeleton to show while fetching data
const loadingSkeleton = `
  <div class="animate-pulse flex flex-col items-center text-center">
    <div class="w-full h-40 sm:h-48 bg-gray-700 rounded-lg mb-4"></div>
    <div class="h-6 bg-gray-700/30 rounded-lg w-3/4 mb-2"></div>
    <div class="h-4 bg-gray-700/20 rounded-lg w-1/2"></div>
  </div>
`.repeat(4);

document.getElementById("core-members").innerHTML = loadingSkeleton;
document.getElementById("trainee-members").innerHTML = loadingSkeleton;

// Fetch member data
fetchMembers();