// === SHOW TRACKER SCRIPT (Backend Connected) ===

// Backend API Base URL
const API_URL = "http://localhost:5000/api/shows";

// Select main container
const showSection = document.querySelector(".show-section");

// === FETCH & DISPLAY SHOWS ===
async function fetchShows() {
  const res = await fetch(API_URL);
  const data = await res.json();
  displayShows(data);
}

// === DISPLAY SHOWS ===
function displayShows(list) {
  showSection.innerHTML = "";

  list.forEach((show) => {
    const card = document.createElement("div");
    card.className = "show-card";
    card.innerHTML = `
      <img src="${show.img}" alt="${show.title}">
      <div class="show-info">
        <h3>${show.title}</h3>
        <p>${show.year} • ${show.genre} • ${show.rating}/10</p>
        <button class="edit-btn">✏️</button>
        <button class="delete-btn">🗑️</button>
      </div>
    `;
    showSection.appendChild(card);

    // Delete Show
    card.querySelector(".delete-btn").addEventListener("click", async () => {
      if (confirm(`Delete "${show.title}"?`)) {
        await fetch(`${API_URL}/${show.id}`, { method: "DELETE" });
        fetchShows();
      }
    });

    // Edit Show
    card.querySelector(".edit-btn").addEventListener("click", () => editShow(show));
  });
}

// === ADD SHOW ===
document.querySelector(".add-btn").addEventListener("click", async (e) => {
  e.preventDefault();

  const title = prompt("Enter show title:");
  if (!title) return alert("Title cannot be empty!");

  const year = prompt("Enter release year:") || "Unknown";
  const genre = prompt("Enter genre:") || "N/A";
  const rating = prompt("Enter rating (out of 10):") || "N/A";
  const img = prompt("Enter image URL (optional):") || `https://via.placeholder.com/200x280?text=${encodeURIComponent(title)}`;

  const newShow = { title, year, genre, rating, img };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newShow),
  });

  fetchShows();
});

// === EDIT SHOW ===
async function editShow(show) {
  const newTitle = prompt("Edit title:", show.title);
  const newYear = prompt("Edit year:", show.year);
  const newGenre = prompt("Edit genre:", show.genre);
  const newRating = prompt("Edit rating:", show.rating);
  const newImg = prompt("Edit image URL:", show.img);

  const updated = {
    title: newTitle || show.title,
    year: newYear || show.year,
    genre: newGenre || show.genre,
    rating: newRating || show.rating,
    img: newImg || show.img,
  };

  await fetch(`${API_URL}/${show.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });

  fetchShows();
}

// === SEARCH BAR ===
const searchBox = document.createElement("input");
searchBox.type = "text";
searchBox.placeholder = "🔍 Search shows...";
searchBox.style.cssText = `
  margin-top: 25px;
  padding: 10px 15px;
  border-radius: 8px;
  border: none;
  width: 250px;
  outline: none;
  font-size: 15px;
`;
document.querySelector("body").insertBefore(searchBox, showSection);

searchBox.addEventListener("input", async () => {
  const res = await fetch(API_URL);
  const shows = await res.json();
  const query = searchBox.value.toLowerCase();
  const filtered = shows.filter((s) => s.title.toLowerCase().includes(query));
  displayShows(filtered);
});

// === SORT BUTTONS ===
const sortDiv = document.createElement("div");
sortDiv.style.marginTop = "15px";
sortDiv.innerHTML = `
  <button id="sortYear" class="add-btn" style="padding:8px 18px;margin-right:10px;">Sort by Year</button>
  <button id="sortRating" class="add-btn" style="padding:8px 18px;">Sort by Rating</button>
`;
document.querySelector("body").insertBefore(sortDiv, showSection);

document.getElementById("sortYear").addEventListener("click", async () => {
  const res = await fetch(API_URL);
  const shows = await res.json();
  shows.sort((a, b) => a.year - b.year);
  displayShows(shows);
});

document.getElementById("sortRating").addEventListener("click", async () => {
  const res = await fetch(API_URL);
  const shows = await res.json();
  shows.sort((a, b) => b.rating - a.rating);
  displayShows(shows);
});

// === INITIAL DISPLAY ===
fetchShows();
