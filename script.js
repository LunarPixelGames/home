async function initApp() {
  try {
    // Set Year
    const yearElement = document.getElementById("year");
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    const response = await fetch("games.json");
    if (!response.ok) throw new Error("Failed to fetch games.json");
    const data = await response.json();

    // Update studio info
    const studioName = document.getElementById("studio-name");
    const studioTagline = document.getElementById("studio-tagline");
    const studioAbout = document.getElementById("studio-about");
    const githubLink = document.getElementById("github-link");

    if (studioName) studioName.textContent = data.studio_info.name;
    if (studioTagline) studioTagline.textContent = data.studio_info.tagline;
    if (studioAbout) studioAbout.textContent = data.studio_info.about;
    if (githubLink) githubLink.href = data.studio_info.github_url;

    // Render projects
    const gamesGrid = document.getElementById("games-grid");
    if (gamesGrid) {
      gamesGrid.innerHTML = data.games
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
    }
  } catch (err) {
    console.error("Error initializing LunarPixel:", err);
    const studioAbout = document.getElementById("studio-about");
    if (studioAbout)
      studioAbout.textContent = "Error loading content. Please refresh.";
  }
}

document.addEventListener("DOMContentLoaded", initApp);
