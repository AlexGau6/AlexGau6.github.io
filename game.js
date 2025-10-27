const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hitSound = document.getElementById("hitSound");
const powerupSound = document.getElementById("powerupSound");

const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const finalScore = document.getElementById("finalScore");

let gameStarted = false;
let gameOver = false;
let score = 0;
let level = 1;

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

const blocks = [];
const powerups = [];

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

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" || e.key === "a") player.dx = -player.speed;
  if (e.key === "ArrowRight" || e.key === "d") player.dx = player.speed;
});

document.addEventListener("keyup", (e) => {
  if (["ArrowLeft", "ArrowRight", "a", "d"].includes(e.key)) player.dx = 0;
});

function spawnBlock() {
  const size = 40;
  const x = Math.random() * (canvas.width - size);
  blocks.push({ x, y: -size, width: size, height: size, speed: 3 + level });
}

function spawnPowerup() {
  const size = 30;
  const x = Math.random() * (canvas.width - size);
  powerups.push({ x, y: -size, width: size, height: size, speed: 2 + level, type: Math.random() < 0.5 ? "shield" : "speed" });
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

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

function update() {
  if (!gameStarted) return;
  if (gameOver) {
    finalScore.textContent = "Your Score: " + score;
    gameOverScreen.style.display = "flex";
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.x += player.dx;
  player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));

  ctx.fillStyle = player.shield ? "#00ccff" : player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    b.y += b.speed;
    ctx.fillStyle = "#444";
    ctx.fillRect(b.x, b.y, b.width, b.height);

    if (isColliding(player, b)) {
      if (player.shield) {
        player
