import { ball, ballDirectionX, ballDirectionY } from "./ball.js";

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
