// Move the ball based on the current direction and detect collisions
export function updateBall() {
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
    detectBrickCollisions(ballX, ballY);
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
        // scoreCounter();
        // generatePowerup(brickRect.left, brickRect.top);
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
