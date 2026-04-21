let gamesData = [];
let currentView = "card";

function formatDownloads(count) {
  if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  return count.toString();
}

function getDownloadHtml(game) {
  const hasItch = typeof game.itch_downloads === "number" && game.itch_downloads > 0;
  const hasPlay = typeof game.playstore_downloads === "number" && game.playstore_downloads > 0;

  if (!hasItch && !hasPlay) return "";

  const total = (hasItch ? game.itch_downloads : 0) + (hasPlay ? game.playstore_downloads : 0);
  const sources = [];
  if (hasItch) sources.push("itch.io");
  if (hasPlay) sources.push("Play Store");
  const tooltip = sources.join(" + ");

  return `<span class="download-count" title="Downloads from ${tooltip}">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
    ${formatDownloads(total)}
  </span>`;
}

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

        const downloadHtml = getDownloadHtml(game);

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
                        ${downloadHtml}
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

        const downloadHtml = getDownloadHtml(game);

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
                        ${downloadHtml}
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
