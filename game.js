document.addEventListener("keydown", function (event) {
  if (event.code === "Enter" && introdone === false) {
    introdone = true;
    paused = false;
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
  movePowerup(document.querySelector(".powerup"));
  startTimer();
}

function restart() {
  modal.style.display = "none";
  // Code to restart the game
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
    }
  }
}
// -----------------------------------------------Levels------------------------------------------------

// Level 1

const level1 = [
  [0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0],
];
const levelData = [
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
  [0, 1, 0, 1, 1, 1, 0, 1, 0],
  [1, 0, 1, 0, 1, 0, 1, 0, 1],
];

createBricks(levelData);

// -----------------------------------------------Paddle Movement------------------------------------------------

const paddleWidth = paddle.offsetWidth;
// width of the gamescreen - 3px (border kind of)
const gameScreenWidth = gameScreen.offsetWidth - 3;
const gameScreenHeight = gameScreen.offsetHeight;

const minPaddleX = 5;
const maxPaddleX = gameScreenWidth - paddleWidth - 10;

let animationId;
let currentDirection = null;

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
}
// Running the function here makes the ball always start in the middle of the paddle
holdball();

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
  let ballX = ball.offsetLeft + 10;
  let ballY = ball.offsetTop - 10;

  // Ball hits the top
  if (ballY < 0) {
    ballDirectionY = 1;
    sound("wallhit.mp3");
  }
  // Ball hits the bottom
  if (ballY > gameScreen.offsetHeight - 35) {
    sound("yoda.mp3");
    livesCounter();
    ballDirectionX = 1;
    ballDirectionY = -1;
    ballReleased = false;
  }
  // Ball hits the left
  if (ballX < 10) {
    ballDirectionX = 1;
    sound("wallhit.mp3");
  }
  // Ball hits the right
  if (ballX > gameScreenWidth - 10) {
    ballDirectionX = -1;

    sound("wallhit.mp3");
  }
  // Ball hits the paddle
  if (ballY + 30 > paddle.offsetTop && ballY + 30 < paddle.offsetTop + 10) {
    if (
      ballX + 20 > paddle.offsetLeft &&
      ballX < paddle.offsetLeft + paddleWidth &&
      ballY + 30 > paddle.offsetTop
    ) {
      ballDirectionY = -1;

      // Calculate the distance from the center of the paddle
      let distanceFromCenter = ballX - (paddle.offsetLeft + paddleWidth / 2);

      // Scale the distance to a reasonable value for ballDirectionX
      let scaleFactor = 10;
      ballDirectionX = distanceFromCenter / scaleFactor;
    }
    sound("blaster.mp3");
  }

  // Ball hits the brick
  detectBrickCollisions(ballX, ballY);
}

// Brick collision detection
function detectBrickCollisions(ballX, ballY) {
  console.log(brick.length);
  for (let i = 0; i < brick.length; i++) {
    let brickRect = brick[i].getBoundingClientRect();
    let ballRect = ball.getBoundingClientRect();
    if (
      ballRect.right > brickRect.left &&
      ballRect.left < brickRect.right &&
      ballRect.bottom > brickRect.top &&
      ballRect.top < brickRect.bottom
    ) {
      sound("tap.wav");
      ballDirectionY = -ballDirectionY;
      // brick[i].style.display = "none";
      generatePowerup(brickRect.left, brickRect.top);
      brick[i].remove();

      // console.log(
      //   brickRect.left,
      //   brickRect.right,
      //   brickRect.top,
      //   brickRect.bottom
      // );
      scoreCounter();
    }
  }
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
  // brickRect = Brick.getBoundingClientRect();

  if (random() && !powerupExists) {
    gameScreenRect = gameScreen.getBoundingClientRect();

    console.log(x, y);

    let powerup = document.createElement("div");
    powerup.classList.add("powerup" + randomNum());
    powerup.style.left =
      x - gameScreenRect.left - powerup.offsetWidth / 2 + ballRadius + "px";
    powerup.style.top =
      y - gameScreenRect.top - powerup.offsetHeight / 2 + "px";

    gameScreen.appendChild(powerup);

    powerupExists = true;

    movePowerup(powerup);
  }
}

// function generatePowerup(x, y) {
//   // brickRect = Brick.getBoundingClientRect();

//   if (!powerupExists) {
//     gameScreenRect = gameScreen.getBoundingClientRect();

//     console.log(x, y);

//     let powerup = document.createElement("div");
//     powerup.classList.add("powerup" + randomNum());
//     powerup.style.left =
//       x - gameScreenRect.left - powerup.offsetWidth / 2 + ballRadius + "px";
//     powerup.style.top =
//       y - gameScreenRect.top - powerup.offsetHeight / 2 + "px";

//     gameScreen.appendChild(powerup);

//     powerupExists = true;

//     movePowerup(powerup);
//   }
// }

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
      sound("hit");
    }
  }
}

function doPowerup(powerup) {
  // let nb = Math.random();
  if (powerup.classList.contains("powerup1")) {
    //powerup #1 Add 1 more Life
    console.log("low");
    addOneLife();
  }
  if (powerup.classList.contains("powerup2")) {
    //powerup #2 Add 10 score
    console.log("mid");
    addScore();
  }
  if (powerup.classList.contains("powerup3")) {
    //powerup #3 Add 10 seconds to timer
    console.log("high");
    addTimer();
  }
}

// add 10 score to the player
function addScore() {
  let currentScore = parseInt(score.innerHTML.split(" ")[1]);
  currentScore = currentScore + 10;
  score.innerHTML = "Score: " + currentScore;
}

//adds 10 seconds to timer
function addTimer() {
  let currentTimer = parseInt(timer.innerHTML.split(" ")[1]);
  currentTimer = currentTimer + 10;
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

// Score counter
function scoreCounter() {
  let currentScore = parseInt(score.innerHTML.split(" ")[1]);
  currentScore++;
  score.innerHTML = "Score: " + currentScore;
  if (currentScore === count) {
    alert("Nice Job, Press ENTER for next level");
    document.location.reload();
  }
}

let timerInterval;

//Timer function removes one second from timer
function timerCounter() {
  let currentTimer = parseInt(timer.innerHTML.split(" ")[1]);
  currentTimer = currentTimer - 1;
  timer.innerHTML = "Time: " + currentTimer;
  if (currentTimer === -1) {
    alert("Game over, ran out of time");
    document.location.reload();
  }
}

//Starts timer and runs timerCounter function every second
function startTimer() {
  timerInterval = setInterval(timerCounter, 1000);
}

// Sound effects and music
function sound(src) {
  let sound = new Audio("music/" + src);
  sound.play();
}

// make sure that the sound effects and music are loaded before the game starts
window.addEventListener("load", function () {
  sound("tap");
  sound("hit");
});
