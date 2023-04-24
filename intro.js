const starElement1 = document.getElementById("star");
const starElement2 = document.getElementById("wars");

const all = document.getElementById("scroll-container");
const scroll = document.getElementById("scroll-text");
const startbtn = document.getElementById("start-game-btn");
const welcome = document.getElementById("welcome");

const skip = document.getElementById("skipintro");

skip.style.visibility = "hidden";

const start = document.getElementById("start");

start.style.visibility = "hidden";

all.style.visibility = "hidden";

// Create an <audio> element and add it to the HTML
const audio = document.createElement("audio");
audio.src = "music/starwars.mp3";

startbtn.addEventListener("click", () => {
  scroll.classList.add("scroll-animation");
  starElement1.classList.add("star");
  starElement2.classList.add("wars");
  all.style.visibility = "visible";
  welcome.style.visibility = "hidden";
  skip.style.visibility = "visible";

  // Play the audio file
  audio.play();

  // setTimeout(() => {
  //   start.style.visibility = "visible";
  // }, 70000);
});

starElement1.addEventListener("animationend", () => {
  starElement1.style.display = "none";
  starElement2.style.display = "none";
});

scroll.addEventListener("animationend", () => {
  start.style.visibility = "visible";
  skip.style.visibility = "hidden";
});

const game = document.getElementById("game-container");
const intro = document.getElementById("containercover");
//game.addEventListener('')

let alldone = false;
document.addEventListener("keydown", function (event) {
  if (event.code === "Enter" && alldone === false) {
    // Stop the audio file
    audio.pause();
    audio.currentTime = 0;
    // Start the background music
    audio.src = "music/back.mp3";
    audio.loop = true;
    audio.play();

    skip.style.visibility = "hidden";
    welcome.style.visibility = "hidden";
    start.style.display = "none";
    all.style.visibility = "hidden";
    game.style.visibility = "visible";

    alldone = true;
    // intro.style.visibility = "hidden";
  }
});
