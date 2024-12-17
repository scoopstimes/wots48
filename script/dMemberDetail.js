async function getMemberId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id");
}

async function getSSKData(memberId) {
  try {
    const response = await fetch("/data/ssk.json");
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.find(entry => entry.id === memberId);
  } catch (error) {
    console.error("Error fetching SSK data:", error);
    return null;
  }
}

async function getMemberJsonData() {
  try {
    const response = await fetch("/data/member.json");
    if (!response.ok) {
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching member JSON data:", error);
    return null;
  }
}

async function fetchMemberDetail() {
  try {
    const memberId = await getMemberId();
    if (!memberId) {
      throw new Error("Member ID not found 😭");
    }

    const [memberResponse, sskData, memberJson] = await Promise.all([
      fetch(`https://intensprotectionexenew.vercel.app/api/member/${memberId}`),
      getSSKData(memberId),
      getMemberJsonData(),
    ]);

    if (!memberResponse.ok) {
      throw new Error("Failed to fetch member data");
    }

    const memberData = await memberResponse.json();
    const memberLocalData = memberJson?.find(entry => entry.name === memberData.name);
    const introductionVideo = memberLocalData?.video_perkenalan || "";
    const sskVideo = sskData?.data?.url_video || "";

    document.getElementById("loading-skeleton").classList.add("hidden");
    const memberContent = document.getElementById("member-content");
    memberContent.classList.remove("hidden");

memberContent.innerHTML = `
  <div class="p-4 md:p-8 relative">
    <div class="flex flex-col md:flex-row gap-8">
      <div class="w-full md:w-1/3 lg:w-1/4">
        <div class="relative">
          <img src="${memberData.profileImage || '/assets/img/default-avatar.jpg'}" 
               alt="${memberData.name || 'Member'}" 
               class="w-full max-w-sm object-cover rounded-lg shadow-lg">
          <div class="mt-4 md:hidden flex justify-center">
            <a href="https://ssk.jkt48.com/2024/id/vote" 
               class="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 text-white font-medium shadow-lg w-full justify-center">
               Vote
            </a>
          </div>
        </div>
      </div>

      <div class="flex-1 space-y-6">
        <div class="flex items-start justify-between">
          <div class="space-y-2">
            <h1 class="text-2xl md:text-3xl lg:text-4xl font-bold">${memberData.name || "Unknown Member"}</h1>
            <p class="text-pink-500 text-lg">${memberData.nickname || '-'}</p>
          </div>
          <div class="hidden md:block">
            <a href="https://ssk.jkt48.com/2024/id/vote" 
               class="inline-flex items-center px-6 py-2 rounded-full bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 transition-colors text-white font-medium shadow-lg">
               Vote
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="bg-gray-700 p-4 rounded-lg">
            <p class="text-gray-400 text-sm">Birthday</p>
            <p class="font-medium">${memberData.birthdate || '-'}</p>
          </div>
          <div class="bg-gray-700 p-4 rounded-lg">
            <p class="text-gray-400 text-sm">Blood Type</p>
            <p class="font-medium">${memberData.bloodType || '-'}</p>
          </div>
          <div class="bg-gray-700 p-4 rounded-lg">
            <p class="text-gray-400 text-sm">Height</p>
            <p class="font-medium">${memberData.height || '-'}</p>
          </div>
          <div class="bg-gray-700 p-4 rounded-lg">
            <p class="text-gray-400 text-sm">Zodiac</p>
            <p class="font-medium">${memberData.zodiac || '-'}</p>
          </div>
        </div>

        ${memberData.socialMedia ? `
          <div class="pt-6">
            <h2 class="text-xl font-semibold mb-4">Social Media</h2>
            <div class="flex flex-wrap gap-4">
              ${memberData.socialMedia.twitter ? `
                <a href="${memberData.socialMedia.twitter}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                  <i class="fab fa-twitter"></i>
                  <span class="hidden sm:inline">Twitter</span>
                </a>
              ` : ''}
              ${memberData.socialMedia.instagram ? `
                <a href="${memberData.socialMedia.instagram}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                  <i class="fab fa-instagram"></i>
                  <span class="hidden sm:inline">Instagram</span>
                </a>
              ` : ''}
              ${memberData.socialMedia.tiktok ? `
                <a href="${memberData.socialMedia.tiktok}" 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   class="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors">
                  <i class="fab fa-tiktok"></i>
                  <span class="hidden sm:inline">TikTok</span>
                </a>
              ` : ''}
            </div>
          </div>
        ` : ''}

        ${sskVideo || introductionVideo ? `
          <div class="pt-6">
            <h2 class="text-xl font-semibold mb-4">
              <i class="fa-solid fa-crown mr-2"></i>
              ${sskVideo ? "Sousenkyo 2024" : "Introduction Video"}
            </h2>
            <div class="aspect-video w-full rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/${sskVideo || introductionVideo}"
                title="${sskVideo ? "Sousenkyo Video" : "Introduction Video"}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
              ></iframe>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  </div>
`;
  } catch (error) {
    console.error("Error fetching member details:", error);
    document.getElementById("loading-skeleton").classList.add("hidden");
    const memberContent = document.getElementById("member-content");
    memberContent.classList.remove("hidden");
    memberContent.innerHTML = `
      <div class="flex flex-col items-center justify-center p-8 text-center">
        <div class="rounded-lg p-8 max-w-md w-full">
          <i class="fas fa-exclamation-circle text-4xl text-pink-500 mb-4"></i>
          <h2 class="text-xl font-bold mb-2">Oops!</h2>
          <p class="text-gray-400 mb-4">Gagal mendapatkan data member 😭</p>
        </div>
      </div>
    `;
  }
}

// Panggil fungsi
fetchMemberDetail();