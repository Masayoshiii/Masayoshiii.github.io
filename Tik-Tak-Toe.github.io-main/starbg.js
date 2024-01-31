import Stars from "./stars.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

// Load stars data from sessionStorage
const savedStars = sessionStorage.getItem("stars");
if (savedStars) {
    stars = JSON.parse(savedStars).map(starData => new Stars(starData.x, starData.y, starData.size, starData.speed));
}

function saveStarsToSessionStorage() {
    sessionStorage.setItem("stars", JSON.stringify(stars));
}

function starLoop(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height, 0, canvas.width / 2, canvas.height, canvas.width / 2);
    gradient.addColorStop(0, "#1b2735");
    gradient.addColorStop(1, "#090a0f");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
        if (isOffScreen(star)){
            const index = stars.indexOf(star);
            stars.splice(index, 1);
            saveStarsToSessionStorage();
        }
        star.draw(ctx);
    });
}

function spawnStars(){
    stars.push(new Stars(Math.floor(Math.random() * window.innerWidth) + 1, window.innerHeight, Math.floor(Math.random() * 3) + 0.1, Math.floor(Math.random() * 3) + 1));
    saveStarsToSessionStorage();
}

function isOffScreen(star){
    return star.y <= -star.size;
}

setInterval(spawnStars, 25);
setInterval(starLoop, 1000 / 60);

// Add event listener to save stars when navigating away from the page
window.addEventListener('beforeunload', saveStarsToSessionStorage);