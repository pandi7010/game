const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 400;

let player = { x: 50, y: canvas.height - 60, width: 50, height: 50, color: "#33cc33" };
let obstacles = [];
let score = 0;
let gameSpeed = 3;
let gameOver = false;
const colors = ["#ff0066", "#33cc33", "#3399ff", "#ffcc00", "#cc66ff", "#ff66b2", "#66ff66", "#66ccff", "#ffccff"];
const initialSpeed = 3;
const speedIncrement = 0.5; // Increase speed every 50 points after 200 points
const difficultyThreshold = 200; // Score threshold for increased difficulty

document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowUp" && player.y > 0) {
        player.y -= 50;
    } else if (event.key === "ArrowDown" && player.y < canvas.height - player.height) {
        player.y += 50;
    } else if (event.key === " ") { // Space key
        restartGame();
    }
});

document.getElementById("restartButton").addEventListener("click", restartGame);

function movePlayer(event) {
    if (event.key === "ArrowUp" && player.y > 0) {
        player.y -= 50;
    } else if (event.key === "ArrowDown" && player.y < canvas.height - player.height) {
        player.y += 50;
    } else if (event.key === " ") { // Space key
        restartGame();
    }
}

function gameLoop() {
    if (!gameOver) {
        clearCanvas();
        drawPlayer();
        handleObstacles();
        updateScore();
        checkGameOver();
        requestAnimationFrame(gameLoop);
    }
}

function clearCanvas() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function handleObstacles() {
    // Add new obstacle with changing color every 50 points
    if (Math.random() < 0.02) {
        let colorIndex = Math.floor(score / 50) % colors.length;
        obstacles.push({ x: canvas.width, y: Math.random() * (canvas.height - 50), width: 50, height: 50, color: colors[colorIndex] });
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        obstacle.x -= gameSpeed;

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(i, 1);
            score++;
            // Increase game speed and difficulty after 200 points
            if (score > 200 && (score - 200) % 50 === 0) {
                gameSpeed += speedIncrement;
            }
        }

        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        if (isColliding(player, obstacle)) {
            gameOver = true;
            displayGameOver();
        }
    }
}

function isColliding(player, obstacle) {
    return !(player.x + player.width < obstacle.x || 
             player.x > obstacle.x + obstacle.width || 
             player.y + player.height < obstacle.y || 
             player.y > obstacle.y + obstacle.height);
}

function updateScore() {
    document.getElementById("score").textContent = "Score: " + score;
}

function checkGameOver() {
    if (player.y < 0 || player.y + player.height > canvas.height) {
        gameOver = true;
        displayGameOver();
    }
}

function displayGameOver() {
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOver").classList.remove("hidden");
    document.getElementById("restartButton").classList.remove("hidden");
}

function restartGame() {
    player.y = canvas.height - player.height;
    obstacles = [];
    score = 0;
    gameSpeed = initialSpeed;
    gameOver = false;
    document.getElementById("gameOver").classList.add("hidden");
    document.getElementById("restartButton").classList.add("hidden");
    gameLoop();
}

function setIntroWidth() {
    const introName = document.getElementById('introName');
    const loadingBarContainer = document.querySelector('.loading-bar-container');

    const nameWidth = introName.offsetWidth;
    loadingBarContainer.style.width = `${nameWidth}px`;
}

document.addEventListener("DOMContentLoaded", function() {
    setIntroWidth();
    setTimeout(() => {
        document.getElementById('intro').classList.add('hidden');
        document.querySelector('.game-container').classList.remove('hidden');
        gameLoop();
    }, 12000); // 12 seconds delay to match 2 seconds after loading
});
