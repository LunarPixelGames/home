// Theme Toggle & System Preference Logic
const themeBtn = document.getElementById("theme-toggle");

function getInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) return savedTheme;

  // Check system preference
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

// Apply theme on load
let currentTheme = getInitialTheme();
applyTheme(currentTheme);

themeBtn.addEventListener("click", () => {
  const isLight = document.documentElement.hasAttribute("data-theme");
  const newTheme = isLight ? "dark" : "light";

  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
});

// Listen for system theme changes (only if user hasn't set a manual preference)
window
  .matchMedia("(prefers-color-scheme: light)")
  .addEventListener("change", (e) => {
    if (!localStorage.getItem("theme")) {
      const newTheme = e.matches ? "light" : "dark";
      applyTheme(newTheme);
    }
  });

async function initApp() {
  try {
    // Set Year
    document.getElementById("year").textContent = new Date().getFullYear();

    const response = await fetch("games.json");
    const data = await response.json();

    // Update studio info
    document.getElementById("studio-name").textContent = data.studio_info.name;
    document.getElementById("studio-tagline").textContent =
      data.studio_info.tagline;
    document.getElementById("studio-about").textContent =
      data.studio_info.about;
    document.getElementById("github-link").href = data.studio_info.github_url;

    // Render games with animation delay
    const gamesGrid = document.getElementById("games-grid");
    gamesGrid.innerHTML = data.games
      .map((game, index) => {
        const playBtn = game.show_play_button
          ? `<a href="${game.play_link}" class="btn btn-play" target="_blank">Google Play</a>`
          : "";
        const itchBtn = game.show_itch_button
          ? `<a href="${game.itch_link}" class="btn btn-itch" target="_blank">itch.io</a>`
          : "";

        // Add style for staggered animation
        const delay = index * 100;
        return `
                <article class="game-card" style="opacity: 0; animation: fadeIn 0.6s ease forwards ${delay}ms">
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

// Add animation keyframes dynamically
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(styleSheet);

document.addEventListener("DOMContentLoaded", initApp);
