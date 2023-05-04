document.addEventListener("keydown", function (event) {
  if (event.code === "Enter" && introdone === false) {
    introdone = true;
    paused = false;
    centerPaddle();
    createBricks(level1);
    showLevel(1);
    // levelcount++;
    holdball();
  }
});

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
let paused = true;
let introdone = false;
let animationId;
let ballReleased = false;

let ballDirectionX = 0;
let ballDirectionY = 1;
let ballSpeed = 5;
let ballRadius = 10;

let powerupExists = false;
let timerInterval;

function showModal() {
  timerInterval = clearInterval(timerInterval);
  modal.style.display = "flex";
  paused = true;
}

function resume() {
  modal.style.display = "none";
  paused = false;
  moveBall();
  if (powerupExists) {
    movePowerup(document.getElementById("powerup"));
  }
  timerInterval = clearInterval(timerInterval);
  startTimer();
}

function nextLevel() {
  removeAllBricks();
  timerInterval = clearInterval(timerInterval);
  if (levelcount === levels.length) {
    paused = true;
    // clearInterval(timerInterval);
    document.getElementById("git-gud").innerHTML = "You saved the world!!!";
    document.getElementById("rude-h3").innerHTML = "Sigma move";
    document.getElementById("rude-text").innerHTML =
      "Your MURDERcount is " +
      score.innerHTML +
      "!!!" +
      "<br>" +
      "You are a true sigma!!!";
    document.getElementById("nice").innerHTML = "Go celebrate, nerd!";
    document.getElementById("game-over-modal").style.display = "flex";
  } else {
    // add 100 seconds to the timer element
    console.log("I was here");
    addTimer(100);
    if (powerupExists) {
      document.querySelectorAll("powerup").remove();
      powerupExists = false;
    }

    // Reset the ball position, direction, and speed
    ballDirectionX = 0;
    ballDirectionY = 1;
    ballSpeed = 5;
    holdball();
    ballReleased = false;
    moveBall();

    brickdestroyed = 0;
    count = 0;

    elprimo.style.display = "block";
    video.play();
    // paused = true;
    ballReleased = false;
    holdball();
    // timerInterval = clearInterval(timerInterval);

    pause.addEventListener("click", rickroll);

    video.addEventListener("ended", function () {
      paused = false;
      elprimo.style.display = "none";
      createBricks(levels[levelcount]);
      showLevel(levelcount + 1);
      levelcount++;
      pause.removeEventListener("click", rickroll);
    });
  }
}

function restart() {
  centerPaddle();
  // if there is a powerup, remove it and the powerup exists is false
  if (powerupExists) {
    document.getElementById("powerup").remove();
  }
  powerupExists = false;

  // Reset the ball position, direction, and speed
  ballDirectionX = 0;
  ballDirectionY = 1;
  ballSpeed = 5;
  holdball();
  ballReleased = false;
  moveBall();

  // Reset the score, lives, and timer
  score.innerHTML = "Score: 0";
  lives.innerHTML = "Lives: 3";
  timer.innerHTML = "Timer: 180";

  // Remove all bricks and create a new set
  removeAllBricks();
  brickdestroyed = 0;
  count = 0;
  createBricks(level1);

  // Hide the modal
  modal.style.display = "none";
  // Unpause the game
  paused = false;
  // Show the level
  levelcount = 1;
  showLevel(levelcount);
  levelcount++;
}

function quit() {
  modal.style.display = "none";
  window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
}

function howtoplay() {
  howmodal.style.display = "flex";
  modal.style.display = "none";
}

function howclose() {
  howmodal.style.display = "none";
  if (paused && introdone) {
    showModal();
  }
  // modal.style.display = "none";
}

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

const level1 = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
];

const level2 = [
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
];

const level3 = [
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
];

const level4 = [
  [0, 0, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 0, 0, 1, 0, 0, 1, 0],
  [1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1],
];

const level5 = [
  [2, 2, 2, 2, 2, 2, 2, 2, 2],
  [2, 0, 0, 0, 0, 0, 0, 0, 2],
  [2, 0, 3, 3, 3, 3, 3, 0, 2],
  [2, 0, 3, 0, 0, 0, 3, 0, 2],
  [2, 2, 2, 2, 2, 2, 2, 2, 2],
];

const level6 = [
  [1, 2, 1, 0, 0, 0, 1, 2, 1],
  [2, 0, 2, 1, 1, 1, 2, 0, 2],
  [1, 2, 1, 0, 0, 0, 1, 2, 1],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [1, 1, 1, 2, 1, 2, 1, 1, 1],
];

const level7 = [
  [0, 1, 0, 2, 0, 2, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 2, 0, 2, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 2, 0, 2, 0, 1, 0],
];

const level8 = [
  [4, 0, 4, 0, 4, 0, 4, 0, 4],
  [0, 3, 0, 3, 0, 3, 0, 3, 0],
  [4, 0, 4, 0, 4, 0, 4, 0, 4],
  [0, 3, 0, 3, 0, 3, 0, 3, 0],
  [4, 0, 4, 0, 4, 0, 4, 0, 4],
];

const level9 = [
  [0, 1, 2, 3, 4, 3, 2, 1, 0],
  [1, 0, 1, 2, 3, 2, 1, 0, 1],
  [2, 1, 0, 1, 2, 1, 0, 1, 2],
  [3, 2, 1, 0, 1, 0, 1, 2, 3],
  [4, 3, 2, 1, 0, 1, 2, 3, 4],
];

const level10 = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 0, 1, 1, 1, 1],
  [1, 1, 1, 4, 0, 4, 1, 1, 1],
  [1, 1, 1, 4, 0, 4, 1, 1, 1],
  [4, 4, 4, 4, 0, 4, 4, 4, 4],
];

// const level8 = [
//   [0, 0, 0, 0, 4, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];
// const level89 = [
//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];
// const level1 = [
//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];
// const level3 = [
//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 1, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 3, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0],
// ];

// const level1 = [
//   [1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1],
//   [1, 1, 1, 1, 1, 1, 1, 1, 1],
// ];
// const level3 = [
//   [1, 0, 1, 0, 1, 0, 1, 0, 1],
//   [0, 1, 0, 1, 1, 1, 0, 1, 0],
//   [1, 0, 1, 0, 1, 0, 1, 0, 1],
//   [0, 1, 0, 1, 1, 1, 0, 1, 0],
//   [1, 0, 1, 0, 1, 0, 1, 0, 1],
// ];

const levels = [
  level1,
  level2,
  level3,
  level4,
  level5,
  level6,
  level7,
  level8,
  level9,
  level10,
];
// createBricks(level1);

// -----------------------------------------------Paddle Movement------------------------------------------------

const paddleWidth = paddle.offsetWidth;
// width of the gamescreen - 3px (border kind of)
const gameScreenWidth = gameScreen.offsetWidth - 3;
const gameScreenHeight = gameScreen.offsetHeight;

const minPaddleX = 5;
const maxPaddleX = gameScreenWidth - paddleWidth - 10;

let currentDirection = null;

function centerPaddle() {
  paddle.style.left = gameScreenWidth / 2 - paddleWidth / 2 - 2 + "px";
}

document.addEventListener("keydown", function (event) {
  if (paused) {
    cancelAnimationFrame(animationId);
    return;
  }
  if (event.code === "ArrowLeft") {
    movePaddleLeft();
  } else if (event.code === "ArrowRight") {
    movePaddleRight();
  }
});

document.addEventListener("keyup", function (event) {
  if (
    (event.code === "ArrowLeft" && currentDirection === "left") ||
    (event.code === "ArrowRight" && currentDirection === "right")
  ) {
    currentDirection = null;
    cancelAnimationFrame(animationId);
  }
});

function movePaddleLeft() {
  if (currentDirection !== "left") {
    currentDirection = "left";
    let currentPaddleX = paddle.offsetLeft;
    if (currentPaddleX > minPaddleX) {
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(function moveLeft() {
        if (currentDirection === "left" && currentPaddleX > minPaddleX) {
          currentPaddleX -= 5;
          paddle.style.left = currentPaddleX + "px";
          // Ball follows paddle
          if (!ballReleased) {
            holdball();
          }
          animationId = requestAnimationFrame(moveLeft);
        } else {
          currentDirection = null;
        }
      });
    }
  }
}

function movePaddleRight() {
  if (currentDirection !== "right") {
    currentDirection = "right";
    let currentPaddleX = paddle.offsetLeft;
    if (currentPaddleX < maxPaddleX) {
      cancelAnimationFrame(animationId);
      animationId = requestAnimationFrame(function moveRight() {
        if (currentDirection === "right" && currentPaddleX < maxPaddleX) {
          currentPaddleX += 5;
          paddle.style.left = currentPaddleX + "px";
          // Ball follows paddle
          if (!ballReleased) {
            holdball();
          }
          animationId = requestAnimationFrame(moveRight);
        } else {
          currentDirection = null;
        }
      });
    }
  }
}

// -----------------------------------------------Ball Movement------------------------------------------------

// Initial position of the ball
function holdball() {
  ball.style.left = paddle.offsetLeft + paddleWidth / 2 - 10 + "px";
  ball.style.top = paddle.offsetTop - 35 + "px";
  ballDirectionX = 0;
}

// Start the game with spacebar
document.addEventListener("keydown", function (event) {
  if (!paused) {
    if (event.code === "Space") {
      if (!ballReleased) {
        ballReleased = true;
        moveBall();
        timerInterval = clearInterval(timerInterval);
        startTimer();
      }
    }
  }
});

function getDistance(ballX, ballY, x, y) {
  let xDistance = x2 - x1;
  let yDistance = y2 - y1;

  return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

// Ball collision detection
function detectBallCollisions() {
  const ballRadius = 10;
  let ballX = ball.offsetLeft + ballRadius;
  let ballY = ball.offsetTop - ballRadius;

  // Ball hits the top
  if (ballY < 0) {
    ballDirectionY = 1;
    sound("wallhit.mp3");
  }
  // Ball hits the bottom
  if (ballY >= gameScreen.offsetHeight - (ballRadius * 2 + 5)) {
    sound("yoda.mp3");
    timerInterval = clearInterval(timerInterval);
    livesCounter();
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
  detectBrickCollisions(ballX, ballY);
}

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
function blinkRed() {
  paddle.style.backgroundColor = "red";
  setTimeout(function () {
    paddle.style.backgroundColor = "#333";
  }, 100);
}

function detectBrickCollisions() {
  const ballRect = ball.getBoundingClientRect();
  const circle = {
    x: ballRect.x + ballRect.width / 2,
    y: ballRect.y + ballRect.height / 2,
    radius: Math.min(ballRect.width, ballRect.height) / 2,
  };

  let collidedHorizontally = false;
  let collidedVertically = false;
  let collisionProcessed = false;

  for (let i = 0; i < brick.length; i++) {
    let brickRect = brick[i].getBoundingClientRect();

    if (isRectanglesColliding(circle, brickRect)) {
      // Calculate the hit direction
      const hitLeft = ballRect.right - brickRect.left;
      const hitRight = brickRect.right - ballRect.left;
      const hitTop = ballRect.bottom - brickRect.top;
      const hitBottom = brickRect.bottom - ballRect.top;

      const minHorizontal = Math.min(hitLeft, hitRight);
      const minVertical = Math.min(hitTop, hitBottom);

      if (minHorizontal < minVertical && !collisionProcessed) {
        collidedHorizontally = true;
        collisionProcessed = true;
      } else if (!collisionProcessed) {
        collidedVertically = true;
        collisionProcessed = true;
      }

      sound("tap.wav");
      if (brick[i].dataset.health > 1 && brick[i].dataset.health <= 3) {
        brick[i].dataset.health--;
      } else if (brick[i].dataset.health >= 4) {
      } else {
        brick[i].remove();
        scoreCounter();
        generatePowerup(brickRect.left, brickRect.top);
      }
    }
  }

  if (collidedHorizontally) {
    ballDirectionX = -ballDirectionX;
  }
  if (collidedVertically) {
    ballDirectionY = -ballDirectionY;
  }

  // Update the ball's position
  ball.style.left = circle.x - circle.radius + "px";
  ball.style.top = circle.y - circle.radius + "px";

  // Ensure that the ball is not inside any brick after updating its position
  for (let i = 0; i < brick.length; i++) {
    let brickRect = brick[i].getBoundingClientRect();

    while (isRectanglesColliding(circle, brickRect)) {
      // Move the ball slightly away from the brick until it is no longer colliding
      const offsetX = Math.sign(ballDirectionX) * 0.5;
      const offsetY = Math.sign(ballDirectionY) * 0.5;
      circle.x += offsetX;
      circle.y += offsetY;
      ball.style.left = parseFloat(ball.style.left) + offsetX + "px";
      ball.style.top = parseFloat(ball.style.top) + offsetY + "px";
    }
  }
}

function isRectanglesColliding(circle, rect) {
  const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
  const closestY = clamp(circle.y, rect.y, rect.y + rect.height);

  const distanceX = circle.x - closestX;
  const distanceY = circle.y - closestY;

  const distanceSq = distanceX * distanceX + distanceY * distanceY;

  // Check if the ball is inside the brick
  const isInside =
    circle.x > rect.x &&
    circle.x < rect.x + rect.width &&
    circle.y > rect.y &&
    circle.y < rect.y + rect.height;

  // Handle corner collisions
  if (isInside) {
    const leftDist = Math.abs(circle.x - rect.x);
    const rightDist = Math.abs(circle.x - (rect.x + rect.width));
    const topDist = Math.abs(circle.y - rect.y);
    const bottomDist = Math.abs(circle.y - (rect.y + rect.height));

    const minDistX = Math.min(leftDist, rightDist);
    const minDistY = Math.min(topDist, bottomDist);

    // Move the ball outside the brick
    if (minDistX < minDistY) {
      circle.x += minDistX * (leftDist < rightDist ? -1 : 1);
    } else {
      circle.y += minDistY * (topDist < bottomDist ? -1 : 1);
    }

    return true;
  }

  return distanceSq <= circle.radius * circle.radius;
}

// Helper function to clamp a value between min and max
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function playSound(soundFile) {
  const audio = new Audio(soundFile);
  audio.play();
}

// Move the ball
function moveBall() {
  let ballX = ball.offsetLeft;
  let ballY = ball.offsetTop;

  if (ballReleased && !paused) {
    // check if ballReleased and paused is false
    requestAnimationFrame(function () {
      detectBallCollisions();
      // This makes the ball move
      ballX += ballDirectionX * ballSpeed;
      ballY += ballDirectionY * ballSpeed;
      ball.style.left = ballX + "px";
      ball.style.top = ballY + "px";

      moveBall();
    });
  } else if (paused) {
    // check if paused is true
    // do nothing, ball movement is paused
  } else {
    holdball();
  }
}

// -----------------------------------------------Game mechanics------------------------------------------------

function random() {
  // return true or false randomly (10% chance of true)
  return Math.random() < 0.1;
}

function randomNum() {
  // return a random number between 1 and 3 as a string
  return Math.floor(Math.random() * 3 + 1).toString();
}

// Powerups;
function generatePowerup(x, y) {
  if (random() && !powerupExists) {
    gameScreenRect = gameScreen.getBoundingClientRect();

    // console.log(x, y);

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

function doPowerup(powerup) {
  if (powerup.classList.contains("powerup1")) {
    //powerup #1 Add 1 more Life
    addOneLife();
  }
  if (powerup.classList.contains("powerup2")) {
    //powerup #2 Add 10 score
    addScore();
  }
  if (powerup.classList.contains("powerup3")) {
    //powerup #3 Add 25 seconds to timer
    addTimer(25);
  }
}

// add 10 score to the player
function addScore() {
  let currentScore = parseInt(score.innerHTML.split(" ")[1]);
  currentScore = currentScore + 10;
  score.innerHTML = "Score: " + currentScore;
}

//adds 10 seconds to timer
function addTimer(time) {
  timerInterval = clearInterval(timerInterval);
  let currentTimer = parseInt(timer.innerHTML.split(" ")[1]);
  currentTimer = currentTimer + +time;
  timer.innerHTML = "Time: " + currentTimer;
  startTimer();
  // console.log(currentTimer);
}

//adds 1 life to the player
function addOneLife() {
  let currentLives = parseInt(lives.innerHTML.split(" ")[1]);
  currentLives++;
  lives.innerHTML = "Lives: " + currentLives;
}

// Lives counter
function livesCounter() {
  // the lives counter is a string with a number in it "Lives: 3" so we need to split it and get the number
  let currentLives = parseInt(lives.innerHTML.split(" ")[1]);
  if (currentLives === 0) {
    // alert("Game over");
    moveBall();
    ballReleased = false;
    holdball();
    paused = true;
    document.getElementById("game-over-modal").style.display = "flex";
    // document.location.reload();
  }
  // timerInterval = clearInterval(timerInterval);
  currentLives--;
  lives.innerHTML = "Lives: " + currentLives;
}

function learnbrick() {
  if (
    document.getElementById("rude-h3").innerHTML ===
    "You failed to save the world!!!"
  ) {
    window.location.href = "https://www.youtube.com/watch?v=IuuvNtC9P1o";
  } else if (
    document.getElementById("rude-h3").innerHTML === "You ran out of time!"
  ) {
    window.location.href = "https://www.youtube.com/watch?v=RA3jmrh6RMg";
  } else {
    window.location.href = "https://youtu.be/NMThdHhrLoM";
  }
}

let brickdestroyed = 0;
// Score counter
function scoreCounter() {
  let currentScore = parseInt(score.innerHTML.split(" ")[1]);
  currentScore++;
  brickdestroyed++;
  score.innerHTML = "Score: " + currentScore;
  if (brickdestroyed === count) {
    sound("mlg.mp3");
    nextLevel();
  }
}

let initialTime;
let startTime;

// Timer function removes one second from timer
function timerCounter() {
  if (paused) {
    return;
  }
  const currentTime = Date.now();
  const elapsedTime = currentTime - startTime;
  const remainingTime = Math.max(
    0,
    Math.floor((initialTime * 1000 - elapsedTime) / 1000)
  );

  timer.innerHTML = "Time: " + remainingTime;

  if (remainingTime <= 0) {
    // change the content of the paragraph inside the modal
    document.getElementById("rude-h3").innerHTML = "You ran out of time!";
    document.getElementById("rude-text").innerHTML =
      "Come back when you arent a lazy noob";
    document.getElementById("nice").innerHTML = "Learn how to be a sigma";
    document.getElementById("game-over-modal").style.display = "flex";
  }
}

// Starts timer and runs timerCounter function every second
function startTimer() {
  initialTime = parseInt(timer.innerHTML.split(" ")[1]);
  startTime = Date.now();

  timerInterval = setInterval(timerCounter, 100);
  // console.log("timerInterval:", timerInterval);
}

// Sound effects and music
function sound(src) {
  let sound = new Audio("music/" + src);
  sound.play();
}

function showLevel(level) {
  const levelModal = document.getElementById("level-modal");
  const levelText = document.getElementById("level-text");

  levelText.textContent = `Level ${level}`;

  levelModal.classList.add("fade-in");
  levelModal.style.display = "block";

  setTimeout(() => {
    levelModal.classList.remove("fade-in");
    levelModal.classList.add("fade-out");
  }, 4000);

  setTimeout(() => {
    levelModal.style.display = "none";
    levelModal.classList.remove("fade-out");
  }, 4500);
}

function rickroll() {
  window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
}
