// DOM elements
const gameScreen = document.getElementById("game-screen");
const score = document.getElementById("score");
const lives = document.getElementById("lives");
const timer = document.getElementById("timer");
const paddle = document.getElementById("paddle");
const ball = document.getElementById("ball");
const brick = document.getElementsByClassName("brick");
const grid = document.getElementsByClassName("grid");
const pause = document.getElementById("pause-btn");
const powerup = document.getElementById("powerup");

var elprimo = document.getElementById("elprimo");
var video = document.getElementById("myVideo");
const modal = document.getElementById("pauseModal");
const howmodal = document.getElementById("howto");

// Game variables

let levelcount = 1;
let paused = false;
let introdone = false;
let animationId;

let ballSpeed = 5;
let ballRadius = 10;

let powerupExists = false;
let timerInterval;

// -----------------------------------------------Bricks------------------------------------------------
// Constants for brick dimensions and layout
const numCols = 9;
const numRows = 5;
const brickWidth = 40;
const brickHeight = 20;
const brickSpacing = 2;
let count = 0;

function createBricks(levelData) {
  // Calculate the width of the grid based on the number of columns, brick width, and spacing
  const gridWidth = numCols * (brickWidth + brickSpacing) - brickSpacing;

  // Calculate the left position of the grid to center it on the screen
  const gridLeft = (gameScreen.clientWidth - gridWidth) / 2;

  // Set the style properties of the grid
  grid[0].style.width = gridWidth + "px";
  grid[0].style.left = gridLeft + "px";
  grid[0].style.top = gridLeft + "px";

  // Loop through each row and column of the level data
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      // Create a new brick element only if the value at that position is 1
      if (levelData[row][col] === 1) {
        count++;
        const brick = document.createElement("div");
        brick.classList.add("brick");
        brick.style.top = row * (brickHeight + brickSpacing) + "px";
        brick.style.left = col * (brickWidth + brickSpacing) + "px";
        grid[0].appendChild(brick);
      }
      if (levelData[row][col] === 2) {
        count++;
        const brick = document.createElement("div");
        brick.classList.add("brick");
        brick.dataset.health = 2; // add remaining health
        // change the style of the brick to become red
        brick.style.backgroundColor = "red";
        brick.style.top = row * (brickHeight + brickSpacing) + "px";
        brick.style.left = col * (brickWidth + brickSpacing) + "px";
        grid[0].appendChild(brick);
      }
      if (levelData[row][col] === 3) {
        count++;
        const brick = document.createElement("div");
        brick.classList.add("brick");
        brick.dataset.health = 3; // add remaining health
        // change the style of the brick to become red
        brick.style.backgroundColor = "purple";
        brick.style.top = row * (brickHeight + brickSpacing) + "px";
        brick.style.left = col * (brickWidth + brickSpacing) + "px";
        grid[0].appendChild(brick);
      }
      if (levelData[row][col] === 4) {
        // count++;
        const brick = document.createElement("div");
        brick.classList.add("brick");
        brick.dataset.health = 4; // add remaining health
        // change the style of the brick to become red
        brick.style.backgroundColor = "green";
        brick.style.top = row * (brickHeight + brickSpacing) + "px";
        brick.style.left = col * (brickWidth + brickSpacing) + "px";
        grid[0].appendChild(brick);
      }
    }
  }
}

function removeAllBricks() {
  const bricks = document.querySelectorAll(".brick");
  bricks.forEach((brick) => brick.remove());
}

// -----------------------------------------------Levels------------------------------------------------

// array with all levels

// const level1 = [
//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];
const level2 = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];
const level3 = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 3, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const level1 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];
// const level3 = [
//   [1, 0, 1, 0, 1, 0, 1, 0, 1],
//   [0, 1, 0, 1, 1, 1, 0, 1, 0],
//   [1, 0, 1, 0, 1, 0, 1, 0, 1],
//   [0, 1, 0, 1, 1, 1, 0, 1, 0],
//   [1, 0, 1, 0, 1, 0, 1, 0, 1],
// ];

const levels = [level1, level2, level3];
// createBricks(level1);

// -----------------------------------------------Game assets------------------------------------------------

// Sound effects and music
function sound(src) {
  let sound = new Audio("music/" + src);
  sound.play();
}

function blinkRed() {
  paddle.style.backgroundColor = "red";
  setTimeout(function () {
    paddle.style.backgroundColor = "#333";
  }, 100);
}

// const timer = document.getElementById("timer");
let initialTime;
let startTime;

// Timer function removes one second from timer
function timerCounter() {
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;
  const remainingTime = Math.max(
    0,
    Math.floor((initialTime * 1000 - elapsedTime) / 1000)
  );

  timer.innerHTML = "Time: " + remainingTime;

  if (remainingTime <= 0) {
    clearInterval(timerInterval);
    alert("Game over, ran out of time");
    document.location.reload();
  }
}

// Starts timer and runs timerCounter function every second
function startTimer() {
  initialTime = parseInt(timer.innerHTML.split(" ")[1]);
  startTime = Date.now();

  timerInterval = setInterval(timerCounter, 100);
}

function random() {
  // return true or false randomly (10% chance of true)
  return Math.random() < 0.1;
}

function randomNum() {
  // return a random number between 1 and 3 as a string
  return Math.floor(Math.random() * 3 + 1).toString();
}

// Score counter
function scoreCounter() {
  let currentScore = parseInt(score.innerHTML.split(" ")[1]);
  currentScore++;
  brickdestroyed++;
  score.innerHTML = "Score: " + currentScore;
  if (brickdestroyed === count) {
    sound("mlg.mp3");
    // nextLevel();
  }
}

// -----------------------------------------------Movement paddle------------------------------------------------

const paddleWidth = paddle.offsetWidth;
const gameScreenWidth = gameScreen.offsetWidth - 3;
const gameScreenHeight = gameScreen.offsetHeight;

const minPaddleX = 5;
const maxPaddleX = gameScreenWidth - paddleWidth - 10;

let currentDirection = null;

function centerPaddle() {
  paddle.style.left = gameScreenWidth / 2 - paddleWidth / 2 - 2 + "px";
}

function updatePaddle() {
  if (currentDirection === "left") {
    movePaddleLeft();
  } else if (currentDirection === "right") {
    movePaddleRight();
  }
}

function movePaddleLeft() {
  let currentPaddleX = paddle.offsetLeft;
  if (currentPaddleX > minPaddleX) {
    currentPaddleX -= 5;
    paddle.style.left = currentPaddleX + "px";
  }
}

function movePaddleRight() {
  let currentPaddleX = paddle.offsetLeft;
  if (currentPaddleX < maxPaddleX) {
    currentPaddleX += 5;
    paddle.style.left = currentPaddleX + "px";
  }
}

document.addEventListener("keydown", function (event) {
  if (paused) {
    return;
  }
  if (event.code === "ArrowLeft") {
    currentDirection = "left";
  } else if (event.code === "ArrowRight") {
    currentDirection = "right";
  }
});

document.addEventListener("keyup", function (event) {
  if (
    (event.code === "ArrowLeft" && currentDirection === "left") ||
    (event.code === "ArrowRight" && currentDirection === "right")
  ) {
    currentDirection = null;
  }
});

// -----------------------------------------------Ball movement------------------------------------------------

// Initialize ball position and direction
let ballX = paddle.offsetLeft + paddleWidth / 2 - 10;
let ballY = paddle.offsetTop - 35;
let ballDirectionX = 0;
let ballDirectionY = -1;
let ballReleased = false;

function isBallCollidingWithPaddle(ballX, ballY) {
  if (ballY + 30 > paddle.offsetTop && ballY + 30 < paddle.offsetTop + 10) {
    if (
      ballX + 20 > paddle.offsetLeft &&
      ballX - 20 < paddle.offsetLeft + paddleWidth &&
      ballY + 30 > paddle.offsetTop
    ) {
      ballDirectionY = -1;

      // Calculate the distance from the center of the paddle
      let distanceFromCenter = ballX - (paddle.offsetLeft + paddleWidth / 2);

      // Scale the distance to a reasonable value for ballDirectionX
      let scaleFactor = 10;
      ballDirectionX = distanceFromCenter / scaleFactor;
      blinkRed();
      sound("blaster.mp3");
    }
  }
}

function isRectanglesColliding(rect1, rect2) {
  return (
    rect1.right >= rect2.left &&
    rect1.left <= rect2.right &&
    rect1.bottom >= rect2.top &&
    rect1.top <= rect2.bottom
  );
}

// Powerups;
function generatePowerup(x, y) {
  if (random() && !powerupExists) {
    gameScreenRect = gameScreen.getBoundingClientRect();

    let powerup = document.createElement("div");
    powerup.classList.add("powerup" + randomNum());

    // add the id to it
    powerup.id = "powerup";

    powerup.style.left =
      x - gameScreenRect.left - powerup.offsetWidth / 2 + ballRadius + "px";
    powerup.style.top =
      y - gameScreenRect.top - powerup.offsetHeight / 2 + "px";

    gameScreen.appendChild(powerup);

    powerupExists = true;

    movePowerup(powerup);
  }
}

function movePowerup(powerup) {
  let powerupY = powerup.offsetTop;
  let powerupX = powerup.offsetLeft;
  if (powerupY < gameScreen.offsetHeight - powerup.offsetHeight) {
    if (!paused) {
      requestAnimationFrame(function () {
        powerupY += 4;
        powerup.style.top = powerupY + "px";
        movePowerup(powerup);
      });
    }
  } else {
    powerup.remove();
    powerupExists = false;
  }
  if (
    powerupY + powerup.offsetHeight > paddle.offsetTop &&
    powerupY + powerup.offsetHeight < paddle.offsetTop + 10
  ) {
    if (
      powerupX + powerup.offsetWidth > paddle.offsetLeft &&
      powerupX < paddle.offsetLeft + paddleWidth &&
      powerupY + powerup.offsetHeight > paddle.offsetTop
    ) {
      //implement powerups here
      doPowerup(powerup);
      powerup.remove();
      powerupExists = false;
      sound("hit.wav");
    }
  }
}

// Brick collision detection
function detectBrickCollisions() {
  const ballRect = ball.getBoundingClientRect();

  for (let i = 0; i < brick.length; i++) {
    let brickRect = brick[i].getBoundingClientRect();

    if (isRectanglesColliding(ballRect, brickRect)) {
      // Calculate the hit direction
      const hitLeft = ballRect.right - brickRect.left;
      const hitRight = brickRect.right - ballRect.left;
      const hitTop = ballRect.bottom - brickRect.top;
      const hitBottom = brickRect.bottom - ballRect.top;

      const minHorizontal = Math.min(hitLeft, hitRight);
      const minVertical = Math.min(hitTop, hitBottom);

      // If horizontal collision is smaller, change X direction
      if (minHorizontal < minVertical) {
        ballDirectionX = -ballDirectionX;
      } else {
        // If vertical collision is smaller, change Y direction
        ballDirectionY = -ballDirectionY;
      }

      sound("tap.wav");
      if (brick[i].dataset.health > 1 && brick[i].dataset.health <= 3) {
        brick[i].dataset.health--; // decrease remaining health
      } else if (brick[i].dataset.health >= 4) {
      } else {
        brick[i].remove(); // destroy brick if health is 0
        // scoreCounter();
        generatePowerup(brickRect.left, brickRect.top);
      }
    }
  }
}

// Move the ball based on the current direction and detect collisions
function updateBall() {
  if (ballReleased && !paused) {
    // This makes the ball move
    ballX += ballDirectionX * ballSpeed;
    ballY += ballDirectionY * ballSpeed;
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";

    // Detect collisions
    const ballRadius = 10;
    // Ball hits the top
    if (ballY < 0) {
      ballDirectionY = 1;
      sound("wallhit.mp3");
    }
    // Ball hits the bottom
    if (ballY >= gameScreen.offsetHeight - (ballRadius * 2 + 5)) {
      sound("yoda.mp3");
      //   livesCounter();
      ballDirectionX = 1;
      ballDirectionY = -1;
      ballReleased = false;
    }
    // Ball hits the left
    if (ballX <= ballRadius) {
      ballDirectionX = 1;
      sound("wallhit.mp3");
    }
    // Ball hits the right
    if (ballX >= gameScreenWidth - ballRadius) {
      ballDirectionX = -1;
      sound("wallhit.mp3");
    }
    // Ball hits the paddle
    isBallCollidingWithPaddle(ballX, ballY);
    // Ball hits a brick
    detectBrickCollisions();
  } else if (paused) {
    // do nothing, ball movement is paused
  } else {
    // Reset ball position to the paddle when ball is not released
    ballX = paddle.offsetLeft + paddleWidth / 2 - 10;
    ballY = paddle.offsetTop - 35;
    ball.style.left = ballX + "px";
    ball.style.top = ballY + "px";
  }
}

// Start the game with spacebar
document.addEventListener("keydown", function (event) {
  if (!paused) {
    if (event.code === "Space") {
      if (!ballReleased) {
        ballReleased = true;
        startTimer();
      }
    }
  }
});

// Game loop function that calls the movePaddle() function
function gameLoop(timestamp) {
  updatePaddle();
  updateBall();
  //   startTimer();
  requestAnimationFrame(gameLoop);
}

// Call requestAnimationFrame once at the start of the game to start the game loop
createBricks(level1);
centerPaddle();
startTimer();
requestAnimationFrame(gameLoop);

// function gameLoop() {}
