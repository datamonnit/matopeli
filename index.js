const gameboard_background = 'black'
const gameboard_border = 'black'

var gameboard;
var gameboard_ctx;
var applewidth = 20;
var appleheight = 20;
var appleX;
var appleY;
var tilecount = 40
var gamespeed = 5
var overallscore = 0;
window.onload = function() {
    gameboard = document.getElementById('game_canvas')
    gameboard_ctx = gameboard.getContext("2d")

    //aloittaa gameloopin
    gameLoop = setInterval(step, 1000 / gamespeed)
        //luo pelaajan
    player = new Player(400, 400)
        //luodaan ensimmäisen omenan koordinaatit
    appleX = Math.floor(Math.random() * tilecount) * 20
    appleY = Math.floor(Math.random() * tilecount) * 20
    console.log(appleX, appleY)

}


//Piirtää canvakselle reunan ja asettaa taustan valkoiseksi
function clearCanvas() {
    //tausta
    gameboard_ctx.fillStyle = gameboard_background;
    gameboard_ctx.fillRect(0, 0, gameboard.width, gameboard.height);
}




function step() {
    clearCanvas();
    player.moveSnake();
    isGameOver();
    checkAppleCollision();
    drawApple();
    player.drawPlayer();


}

function drawApple() {
    x = appleX
    y = appleY
    gameboard_ctx.fillStyle = 'red'
    gameboard_ctx.strokeStyle = 'lightgreen'
    gameboard_ctx.lineWidth = 2
    gameboard_ctx.fillRect(x, y, applewidth, appleheight)
    gameboard_ctx.strokeRect(x, y, applewidth, appleheight)

}

function checkAppleCollision() {
    if (appleX == player.x && appleY == player.y) {
        appleX = Math.floor(Math.random() * tilecount) * 20
        appleY = Math.floor(Math.random() * tilecount) * 20
        player.addpart()
        overallscore++
        player.score++
            if (player.score === 1) {
                clearInterval(gameLoop)
                gameLoop = setInterval(step, 1000 / gamespeed)
                gamespeed = gamespeed + 0.5
                player.score = 0
            }
        console.log(gamespeed)

    }

}

function isGameOver() {
    let gameOver = false
    if (player.velocityX === 0 && player.velocityY === 0) {
        return false;
    }

    //onko pelaaja osunut seinään
    if (player.x < 0) {
        gameOver = true
    } else if (player.x === 800) {
        gameOver = true
    } else if (player.y < 0) {
        gameOver = true
    } else if (player.y === 800) {
        gameOver = true
    }
    for (let i = 0; i < player.snake_parts.length; i++) {
        let part = player.snake_parts[i]
        if (part.x === player.x && part.y === player.y) {
            gameOver = true
            break;
        }
    }

    if (gameOver == true) {
        clearInterval(gameLoop)
        return;
    }

}


document.body.addEventListener('keydown', change_direction);

function change_direction(event) {
    // estää pelaajaa peruuttamasta


    if (event.which == 37 || event.which == 65) {
        if (player.velocityX == 20)
            return
        player.velocityX = -20;
        player.velocityY = 0;

    }
    if (event.which == 39 || event.which == 68) {
        if (player.velocityX == -20)
            return
        player.velocityX = 20;
        player.velocityY = 0;

    }
    if (event.which == 38 || event.which == 87) {
        if (player.velocityY == 20)
            return
        player.velocityX = 0;
        player.velocityY = -20;

    }

    if (event.which == 40 || event.which == 83) {
        if (player.velocityY == -20)
            return
        player.velocityX = 0;
        player.velocityY = 20;

    }
}
