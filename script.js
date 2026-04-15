let gamesData = [];
let currentView = "card";

async function initApp() {
  try {
    // Set Year
    const yearElement = document.getElementById("year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    const response = await fetch("games.json");
    if (!response.ok) throw new Error("Failed to fetch games.json");
    const data = await response.json();
    gamesData = data.games;

    // Update studio info
    const studioName = document.getElementById("studio-name");
    const studioTagline = document.getElementById("studio-tagline");
    const studioAbout = document.getElementById("studio-about");
    const githubLink = document.getElementById("github-link");

    if (studioName) studioName.textContent = data.studio_info.name;
    if (studioTagline) studioTagline.textContent = data.studio_info.tagline;
    if (studioAbout) studioAbout.textContent = data.studio_info.about;
    if (githubLink) githubLink.href = data.studio_info.github_url;

    // Detect mobile and set default view
    const isMobile = window.matchMedia("(max-width: 600px)").matches;
    if (isMobile) {
      currentView = "list";
    }

    setupViewToggle();
    renderGames();
  } catch (err) {
    console.error("Error initializing LunarPixel:", err);
    const studioAbout = document.getElementById("studio-about");
    if (studioAbout)
      studioAbout.textContent = "Error loading content. Please refresh.";
  }
}

function setupViewToggle() {
  const cardBtn = document.getElementById("card-view-btn");
  const listBtn = document.getElementById("list-view-btn");

  if (cardBtn && listBtn) {
    // Set initial active state based on currentView
    if (currentView === "card") {
      cardBtn.classList.add("active");
      listBtn.classList.remove("active");
    } else {
      listBtn.classList.add("active");
      cardBtn.classList.remove("active");
    }

    cardBtn.addEventListener("click", () => {
      if (currentView === "card") return;
      currentView = "card";
      cardBtn.classList.add("active");
      listBtn.classList.remove("active");
      renderGames();
    });

    listBtn.addEventListener("click", () => {
      if (currentView === "list") return;
      currentView = "list";
      listBtn.classList.add("active");
      cardBtn.classList.remove("active");
      renderGames();
    });
  }
}

function renderGames() {
  const gamesContainer = document.getElementById("games-grid");
  if (!gamesContainer) return;

  if (currentView === "card") {
    gamesContainer.className = "projects-grid";
    gamesContainer.innerHTML = gamesData
      .map((game) => {
        const statusClass = `status-${game.status.toLowerCase().replace(/\s+/g, "-")}`;
        const tags = (game.tags || [])
          .map((tag) => `<span class="tag">${tag}</span>`)
          .join("");

        const playLink = game.play_link
          ? `<a href="${game.play_link}" class="btn-link" target="_blank">Play Store</a>`
          : "";
        const itchLink = game.itch_link
          ? `<a href="${game.itch_link}" class="btn-link" target="_blank">itch.io</a>`
          : "";

        const hasThumbnail = game.thumbnail && game.thumbnail !== "";
        const thumbnailHtml = hasThumbnail
          ? `<img src="${game.thumbnail}" alt="${game.name}" loading="lazy">`
          : "";

        return `
                <article class="project-card">
                    <div class="project-meta">
                        <span class="project-status ${statusClass}">${game.status}</span>
                        <span class="project-year">${game.year}</span>
                    </div>
                    
                    <div class="project-thumbnail ${hasThumbnail ? "" : "empty"}">
                        ${thumbnailHtml}
                    </div>

                    <div class="project-content">
                        <h3>${game.name}</h3>
                        <p class="project-desc">${game.description}</p>
                    </div>

                    <div class="project-tags">
                        ${tags}
                    </div>

                    <div class="project-links">
                        ${playLink}
                        ${itchLink}
                    </div>
                </article>
            `;
      })
      .join("");
  } else {
    gamesContainer.className = "projects-list";
    gamesContainer.innerHTML = gamesData
      .map((game) => {
        const statusClass = `status-${game.status.toLowerCase().replace(/\s+/g, "-")}`;
        const playLink = game.play_link
          ? `<a href="${game.play_link}" class="btn-link" target="_blank">Play Store</a>`
          : "";
        const itchLink = game.itch_link
          ? `<a href="${game.itch_link}" class="btn-link" target="_blank">itch.io</a>`
          : "";

        const hasThumbnail = game.thumbnail && game.thumbnail !== "";
        const thumbnailHtml = hasThumbnail
          ? `<img src="${game.thumbnail}" alt="${game.name}" loading="lazy">`
          : "";

        return `
                <article class="project-list-item">
                    <div class="list-thumbnail">
                        ${thumbnailHtml}
                    </div>
                    
                    <div class="list-content">
                        <h3>${game.name}</h3>
                        <p class="list-desc">${game.description}</p>
                    </div>

                    <div class="list-meta">
                        <span class="project-status ${statusClass}">${game.status}</span>
                        <span class="project-year">${game.year}</span>
                        <div class="list-links">
                            ${playLink}
                            ${itchLink}
                        </div>
                    </div>
                </article>
            `;
      })
      .join("");
  }
}

document.addEventListener("DOMContentLoaded", initApp);
