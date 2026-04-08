// Star Generation Logic
function createStars() {
  const container = document.getElementById("stars");
  const count = 150;
  
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 2 + 1;
    
    // Random duration for twinkle
    const duration = Math.random() * 3 + 2;
    
    star.style.left = `${x}%`;
    star.style.top = `${y}%`;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.setProperty("--duration", `${duration}s`);
    
    container.appendChild(star);
  }
}

async function initApp() {
  try {
    // Generate Stars
    createStars();

    // Set Year
    document.getElementById("year").textContent = new Date().getFullYear();

    const response = await fetch("games.json");
    const data = await response.json();

    // Update studio info
    document.getElementById("studio-name").textContent = data.studio_info.name;
    document.getElementById("studio-tagline").textContent = data.studio_info.tagline;
    document.getElementById("studio-about").textContent = data.studio_info.about;
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
        const delay = index * 150;
        return `
                <article class="game-card" style="opacity: 0; transform: translateY(30px); animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards ${delay}ms">
                    <div class="card-glow"></div>
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
  @keyframes slideUp {
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
`;
document.head.appendChild(styleSheet);

document.addEventListener("DOMContentLoaded", initApp);
