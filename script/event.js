// Fungsi untuk menampilkan daftar acara
function listEvent() {
  fetch("https://api.crstlnz.my.id/api/next_schedule")
    .then(response => response.json())
    .then(data => {
      const filteredEvents = data.filter(event => 
        event.url.startsWith('/event/schedule/id/') || 
        event.url.startsWith("/calendar/list/")
      );
      const limitedEvents = filteredEvents.slice(0, 5);

      document.getElementById("eventList").innerHTML = '';

      limitedEvents.forEach(event => {
        const eventTitle = event.title
          .replace(/^\d{2}:\d{2}\s/, '')
          .replace(/^\d{8}-\d{2}:\d{2}-/, '')
          .replace(/^\d{4}-\d{2}-\d{2}-\d{2}:\d{2}-/, '');
        
        const eventElement = document.createElement("div");
        const dateOptions = { year: "numeric", month: "long", day: "numeric" };

        eventElement.innerHTML = `
          <br>
          <div class="row1">
              <img src="https://res.cloudinary.com/haymzm4wp/image/upload/assets/jkt48${event.label}" alt="Category Icon">
              <h4 class="date">${new Date(event.date).toLocaleDateString('id-ID', dateOptions)}</h4>
          </div>
          <h2> ${eventTitle}</h2><br><hr>
        `;
        document.getElementById('eventList').appendChild(eventElement);
      });
    })
    .catch(error => console.error("Error fetching data:", error));
}

// Fungsi untuk menampilkan daftar acara dengan lebih banyak data
function listEventDetails() {
  fetch("https://api.crstlnz.my.id/api/next_schedule")
    .then(response => response.json())
    .then(data => {
      const filteredEvents = data.filter(event => 
        event.url.startsWith("/event/schedule/id/") || 
        event.url.startsWith("/calendar/list/")
      );
      const limitedEvents = filteredEvents.slice(0, 10);

      document.getElementById("eventList-dir").innerHTML = '';

      limitedEvents.forEach(event => {
        const eventTitle = event.title
          .replace(/^\d{2}:\d{2}\s/, '')
          .replace(/^\d{8}-\d{2}:\d{2}-/, '')
          .replace(/^\d{4}-\d{2}-\d{2}-\d{2}:\d{2}-/, '');

        const eventElement = document.createElement("div");
        const dateOptions = { year: "numeric", month: "long", day: "numeric" };

        eventElement.innerHTML = `
          <br>
          <div class="row1">
              <img src="https://res.cloudinary.com/haymzm4wp/image/upload/assets/jkt48${event.label}" alt="Category Icon">
              <h4 class="date">${new Date(event.date).toLocaleDateString('id-ID', dateOptions)}</h4>
          </div>
          <h2> ${eventTitle}</h2><br><hr>
        `;
        document.getElementById("eventList-dir").appendChild(eventElement);
      });
    })
    .catch(error => console.error("Error fetching data:", error));
}

// Fungsi untuk menampilkan daftar teater terbaru
async function recentTheater() {
  try {
    const eventResponse = await fetch('https://api.crstlnz.my.id/api/event');
    const eventData = await eventResponse.json();

    const imageResponse = await fetch("script/cdnpicture.json");
    const imageData = await imageResponse.json();

    const recentTheaterList = eventData.theater.recent.slice(0, 3);
    const theaterContainer = document.getElementById("recent");
    theaterContainer.innerHTML = '';

    if (recentTheaterList.length === 0) {
      document.getElementById("noTheaterMessage").textContent = "Tidak ada theater";
      document.getElementById("noTheaterMessage").style.display = "block";
      return;
    }

    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    recentTheaterList.forEach(theater => {
      const matchedImage = imageData.find(image => image.setlist === theater.title);
      const theaterImage = matchedImage ? matchedImage.banner : '';
      const birthdayMembers = theater.seitansai?.length > 0 
        ? theater.seitansai.map(member => member.name).join(", ") 
        : '';
      const birthdayText = birthdayMembers ? `<h3>🎂 Seintansai: ${birthdayMembers}</h3>` : '';

      const theaterElement = document.createElement("div");
      theaterElement.classList.add("card-up-recent");
      theaterElement.innerHTML = `
        <a href="dtheater?id=${theater.id}">
            <img src="${theaterImage}" class="poster-event" loading="lazy"><br>
            <h3>🎪 Theater: ${theater.title}</h3>
            <h3>⭐ Total Member: ${theater.member_count} member yang tampil</h3>
            <h3>🗓️ Tanggal Show: ${new Date(theater.date).toLocaleDateString("id-ID", dateOptions)}</h3>
            ${birthdayText}
            <br>
        </a>
        <br>
      `;
      theaterContainer.appendChild(theaterElement);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Event listener untuk DOM siap
document.addEventListener("DOMContentLoaded", function () {
  listEvent();
  listEventDetails();
  recentTheater();
});