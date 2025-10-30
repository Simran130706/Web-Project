// === SHOW TRACKER SCRIPT ===

// Select main container
const showSection = document.querySelector(".show-section");

// Load saved shows from localStorage
let shows = JSON.parse(localStorage.getItem("shows")) || [
  {
    title: "Breaking Bad",
    year: 2008,
    genre: "Crime, Drama",
    rating: 9.5,
    img: "https://via.placeholder.com/200x280?text=Breaking+Bad"
  },
  {
    title: "Game of Thrones",
    year: 2011,
    genre: "Fantasy, Drama",
    rating: 9.2,
    img: "https://via.placeholder.com/200x280?text=Game+of+Thrones"
  },
  {
    title: "The Witcher",
    year: 2019,
    genre: "Fantasy, Action",
    rating: 8.2,
    img: "https://via.placeholder.com/200x280?text=The+Witcher"
  },
  {
    title: "Peaky Blinders",
    year: 2013,
    genre: "Crime, Drama",
    rating: 8.8,
    img: "https://via.placeholder.com/200x280?text=Peaky+Blinders"
  }
];

// === DISPLAY SHOWS ===
function displayShows(list = shows) {
  showSection.innerHTML = "";
  list.forEach((show, index) => {
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
    card.querySelector(".delete-btn").addEventListener("click", () => {
      if (confirm(`Delete "${show.title}"?`)) {
        shows.splice(index, 1);
        saveShows();
        displayShows();
      }
    });

    // Edit Show
    card.querySelector(".edit-btn").addEventListener("click", () => editShow(index));
  });
}

// === ADD SHOW ===
document.querySelector(".add-btn").addEventListener("click", (e) => {
  e.preventDefault();

  const title = prompt("Enter show title:");
  if (!title) return alert("Title cannot be empty!");

  const year = prompt("Enter release year:");
  const genre = prompt("Enter genre:");
  const rating = prompt("Enter rating (out of 10):");
  const img = prompt("Enter image URL (optional):") || `https://via.placeholder.com/200x280?text=${encodeURIComponent(title)}`;

  const newShow = {
    title,
    year: year || "Unknown",
    genre: genre || "N/A",
    rating: rating || "N/A",
    img
  };

  shows.push(newShow);
  saveShows();
  displayShows();
});

// === EDIT SHOW ===
function editShow(index) {
  const show = shows[index];

  const newTitle = prompt("Edit title:", show.title);
  const newYear = prompt("Edit year:", show.year);
  const newGenre = prompt("Edit genre:", show.genre);
  const newRating = prompt("Edit rating:", show.rating);
  const newImg = prompt("Edit image URL:", show.img);

  shows[index] = {
    title: newTitle || show.title,
    year: newYear || show.year,
    genre: newGenre || show.genre,
    rating: newRating || show.rating,
    img: newImg || show.img
  };

  saveShows();
  displayShows();
}

// === SAVE TO LOCALSTORAGE ===
function saveShows() {
  localStorage.setItem("shows", JSON.stringify(shows));
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

searchBox.addEventListener("input", () => {
  const query = searchBox.value.toLowerCase();
  const filtered = shows.filter(s => s.title.toLowerCase().includes(query));
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

document.getElementById("sortYear").addEventListener("click", () => {
  shows.sort((a, b) => a.year - b.year);
  saveShows();
  displayShows();
});

document.getElementById("sortRating").addEventListener("click", () => {
  shows.sort((a, b) => b.rating - a.rating);
  saveShows();
  displayShows();
});

// === INITIAL DISPLAY ===
displayShows();
