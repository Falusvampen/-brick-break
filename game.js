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

let levelcount = 1;
let paused = true;
let introdone = false;

const modal = document.getElementById("pauseModal");
const howmodal = document.getElementById("howto");

function showModal() {
  modal.style.display = "flex";
  paused = true;
  clearInterval(timerInterval);
}
function resume() {
  modal.style.display = "none";
  paused = false;
  moveBall();
  if (powerupExists) {
    movePowerup(document.getElementById("powerup"));
  }
  startTimer();
}

function nextLevel() {
  if (levelcount === levels.length) {
    alert("You saved the world");
    rickroll();
  } else {
    // add 100 seconds to the timer element
    addTimer(100);
    clearInterval(timerInterval);
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

    brickdestroyed = 0;
    count = 0;

    elprimo.style.display = "block";
    video.play();

    pause.addEventListener("click", rickroll);

    video.addEventListener("ended", function () {
      elprimo.style.display = "none";
      createBricks(levels[levelcount]);
      showLevel(levelcount + 1);
      levelcount++;
      pause.removeEventListener("click", rickroll);
    });
  }
}

var elprimo = document.getElementById("elprimo");
var video = document.getElementById("myVideo");

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

// -----------------------------------------------Paddle Movement------------------------------------------------

const paddleWidth = paddle.offsetWidth;
// width of the gamescreen - 3px (border kind of)
const gameScreenWidth = gameScreen.offsetWidth - 3;
const gameScreenHeight = gameScreen.offsetHeight;

const minPaddleX = 5;
const maxPaddleX = gameScreenWidth - paddleWidth - 10;

let animationId;
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

let ballReleased = false;

// Initial position of the ball
function holdball() {
  ball.style.left = paddle.offsetLeft + paddleWidth / 2 - 10 + "px";
  ball.style.top = paddle.offsetTop - 35 + "px";
  ballDirectionX = 0;
}
// Running the function here makes the ball always start in the middle of the paddle
// holdball();

// Start the game with spacebar
document.addEventListener("keydown", function (event) {
  if (!paused) {
    if (event.code === "Space") {
      if (!ballReleased) {
        ballReleased = true;
        moveBall();
        startTimer();
      }
    }
  }
});
let ballDirectionX = 0;
let ballDirectionY = 1;
let ballSpeed = 5;
let ballRadius = 10;

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

// Brick collision detection
function detectBrickCollisions(ballX, ballY) {
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
        scoreCounter();
        generatePowerup(brickRect.left, brickRect.top);
      }
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

let powerupExists = false;

// Powerups;
function generatePowerup(x, y) {
  if (random() && !powerupExists) {
    gameScreenRect = gameScreen.getBoundingClientRect();

    console.log(x, y);

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
  let currentTimer = parseInt(timer.innerHTML.split(" ")[1]);
  currentTimer = currentTimer + time;
  timer.innerHTML = "Timer: " + currentTimer;
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
  currentLives--;
  lives.innerHTML = "Lives: " + currentLives;
  if (currentLives === 0) {
    alert("Game over");
    document.location.reload();
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

let timerInterval;
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

// Sound effects and music
function sound(src) {
  let sound = new Audio("music/" + src);
  sound.play();
}

// make sure that the sound effects and music are loaded before the game starts
// window.addEventListener("load", function () {
//   sound("tap");
//   sound("hit");
// });

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
