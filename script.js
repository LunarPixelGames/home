async function initApp() {
  try {
    const response = await fetch("games.json");
    const data = await response.json();

    // Update studio info
    document.getElementById("studio-name").textContent = data.studio_info.name;
    document.getElementById("studio-tagline").textContent =
      data.studio_info.tagline;
    document.getElementById("studio-about").textContent =
      data.studio_info.about;
    document.getElementById("github-link").href = data.studio_info.github_url;

    // Render games
    const gamesGrid = document.getElementById("games-grid");
    gamesGrid.innerHTML = data.games
      .map((game) => {
        const playBtn = game.show_play_button
          ? `<a href="${game.play_link}" class="btn btn-play" target="_blank">Google Play</a>`
          : "";
        const itchBtn = game.show_itch_button
          ? `<a href="${game.itch_link}" class="btn btn-itch" target="_blank">itch.io</a>`
          : "";

        return `
                <article class="game-card">
                    <h3>${game.name}</h3>
                    <p>${game.description}</p>
                    <div class="button-group">
                        ${playBtn}
                        ${itchBtn}
                    </div>
                </article>
            `;
      })
      .join("");
  } catch (err) {
    console.error("Error loading games:", err);
  }
}

// Theme Toggle Logic
const themeBtn = document.getElementById("theme-toggle");
const currentTheme = localStorage.getItem("theme") || "dark";

if (currentTheme === "light") {
  document.documentElement.setAttribute("data-theme", "light");
  themeBtn.textContent = "🌙 Mode";
}

themeBtn.addEventListener("click", () => {
  let theme = document.documentElement.getAttribute("data-theme");
  if (theme === "light") {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "dark");
    themeBtn.textContent = "☀️ Mode";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
    themeBtn.textContent = "🌙 Mode";
  }
});

document.addEventListener("DOMContentLoaded", initApp);
