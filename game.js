// Canvas and context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI elements
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const finalScore = document.getElementById("finalScore");

// Game state
let gameStarted = false;
let gameOver = false;
let score = 0;
let level = 1;

// Player object
const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  color: "#cc5500",
  speed: 5,
  dx: 0,
  shield: false
};

// Entities
const blocks = [];
const powerups = [];

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
  if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
});

document.addEventListener("keyup", (e) => {
  if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) player.dx = 0;
});

// Start and restart buttons
startButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameStarted = true;
  resetGame();
});

restartButton.addEventListener("click", () => {
  gameOverScreen.style.display = "none";
  gameStarted = true;
  resetGame();
});

// Reset game state
function resetGame() {
  blocks.length = 0;
  powerups.length = 0;
  score = 0;
  level = 1;
  gameOver = false;
  player.x = canvas.width / 2 - 25;
  player.shield = false;
  player.speed = 5;
  update();
}

// Spawn falling block
function spawnBlock() {
  const size = 40;
  const x = Math.random() * (canvas.width - size);
  blocks.push({ x, y: -size, width: size, height: size, speed: 3 + level });
}

// Spawn power-up
function spawnPowerup() {
  const size = 30;
  const x = Math.random() * (canvas.width - size);
  const type = Math.random() < 0.5 ? "shield" : "speed";
  powerups.push({ x, y: -size, width: size, height: size, speed: 2 + level, type });
}

// Collision detection
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// Game loop
function update() {
  if (!gameStarted) return;
  if (gameOver) {
    finalScore.textContent = "Your Score: " + score;
    gameOverScreen.style.display = "flex";
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move player
  player.x += player.dx;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  // Draw player
  ctx.fillStyle = player.shield ? "#00ccff" : player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Update and draw blocks
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    b.y += b.speed;
    ctx.fillStyle = "#444";
    ctx.fillRect(b.x, b.y, b.width, b.height);

    if (isColliding(player, b)) {
      if (player.shield) {
        player.shield = false;
        blocks.splice(i, 1);
        i--;
        continue;
      }
      gameOver = true;
      return;
    }

    if (b.y > canvas.height) {
      blocks.splice(i, 1);
      i--;
      score++;
      if (score % 10 === 0) level++;
    }
  }

  // Update and draw powerups
  for (let i = 0; i < powerups.length; i++) {
    const p = powerups[i];
    p.y += p.speed;
    ctx.fillStyle = p.type === "shield" ? "#00ccff" : "#66ff66";
    ctx.fillRect(p.x, p.y, p.width, p.height);

    if (isColliding(player, p)) {
      if (p.type === "shield") {
        player.shield = true;
      } else {
        player.speed += 2;
        setTimeout(() => {
          player.speed = Math.max(5, player.speed - 2);
        }, 5000);
      }
      powerups.splice(i, 1);
      i--;
    }

    if (p.y > canvas.height) {
      powerups.splice(i, 1);
      i--;
    }
  }

  // Draw score and level
  ctx.fillStyle = "#333";
  ctx.font = "20px Segoe UI";
  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Level: " + level, 10, 55);

  requestAnimationFrame(update);
}

// Start spawning
setInterval(spawnBlock, 1000);
setInterval(spawnPowerup, 5000);
