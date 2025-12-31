const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let paddle = {
  x: canvas.width / 2 - 50,
  y: canvas.height - 30,
  width: 100,
  height: 15,
  speed: 7
};

let ball = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  radius: 8,
  dx: 4,
  dy: -4
};

let bricks = [];
let rows = 5;
let cols = 7;
let brickWidth = 60;
let brickHeight = 20;
let brickPadding = 10;
let offsetTop = 60;
let offsetLeft = 25;

let score = 0;
let level = 1;
let keys = {};

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function createBricks() {
  bricks = [];
  for (let r = 0; r < rows; r++) {
    bricks[r] = [];
    for (let c = 0; c < cols; c++) {
      bricks[r][c] = {
        x: c * (brickWidth + brickPadding) + offsetLeft,
        y: r * (brickHeight + brickPadding) + offsetTop,
        status: 1,
        color: neonColor()
      };
    }
  }
}

function neonColor() {
  const colors = ["#00eaff", "#ff00ff", "#00ff88", "#ff8800", "#ff0044"];
  return colors[Math.floor(Math.random() * colors.length)];
}

createBricks();

function drawPaddle() {
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#00eaff";
  ctx.fillStyle = "#00eaff";
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.shadowBlur = 0;
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.shadowBlur = 20;
  ctx.shadowColor = "#ffffff";
  ctx.fill();
  ctx.closePath();
  ctx.shadowBlur = 0;
}

function drawBricks() {
  bricks.forEach(row => {
    row.forEach(b => {
      if (b.status === 1) {
        ctx.fillStyle = b.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = b.color;
        ctx.fillRect(b.x, b.y, brickWidth, brickHeight);
        ctx.shadowBlur = 0;
      }
    });
  });
}

function movePaddle() {
  if (keys["ArrowLeft"] || keys["a"]) paddle.x -= paddle.speed;
  if (keys["ArrowRight"] || keys["d"]) paddle.x += paddle.speed;

  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width)
    paddle.x = canvas.width - paddle.width;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0)
    ball.dx *= -1;

  if (ball.y - ball.radius < 0)
    ball.dy *= -1;

  if (
    ball.y + ball.radius > paddle.y &&
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width
  ) {
    ball.dy *= -1;
  }

  if (ball.y + ball.radius > canvas.height) {
    resetBall();
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = -4;
}

function collisionDetection() {
  bricks.forEach(row => {
    row.forEach(b => {
      if (b.status === 1) {
        if (
          ball.x > b.x &&
          ball.x < b.x + brickWidth &&
          ball.y > b.y &&
          ball.y < b.y + brickHeight
        ) {
          ball.dy *= -1;
          b.status = 0;
          score++;

          if (score === rows * cols) {
            nextLevel();
          }
        }
      }
    });
  });
}

function nextLevel() {
  level++;
  rows++;
  score = 0;
  createBricks();
  resetBall();
}

function drawScore() {
  ctx.fillStyle = "#00eaff";
  ctx.font = "20px Arial";
  ctx.fillText("Level: " + level, 10, 25);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBricks();
  drawPaddle();
  drawBall();
  drawScore();

  movePaddle();
  moveBall();
  collisionDetection();

  requestAnimationFrame(update);
}

update();
