const gameboard_background = 'black'
const gameboard_border = 'black'

var gameboard;
var gameboard_ctx;
var applewidth = 20;
var appleheight = 20;
var appleX;
var appleY;
var tilecount = 30
var gamespeed = 10
var overallscore = 0;
var highscore = localStorage.getItem('savedHighScore');
if (highscore == null || highscore == NaN) {
    highscore = 0
}
var directionchanged;
var gameOver = false
document.body.addEventListener('keydown', change_direction);

window.onload = function() {
    gameboard = document.getElementById('game_canvas')
    gameboard_ctx = gameboard.getContext("2d")

    //aloittaa gameloopin
    gameLoop = setInterval(step, 1000 / gamespeed)
        //luo pelaajan
    player = new Player(tilecount * 10, tilecount * 10)
        //luodaan ensimmäisen omenan koordinaatit
    appleX = Math.floor(Math.random() * tilecount) * 20
    appleY = Math.floor(Math.random() * tilecount) * 20
    console.log(appleX, appleY)

}

document.getElementById('highScore').innerHTML = highscore


//Piirtää canvakselle reunan ja asettaa taustan valkoiseksi
function clearCanvas() {
    //tausta
    gameboard_ctx.fillStyle = gameboard_background;
    gameboard_ctx.fillRect(0, 0, gameboard.width, gameboard.height);
}




function step() {
    directionchanged = false
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
        //tarkistetaan ettei omena ole pelaajan sisällä
    if (x == player.x && y == player.y) {
        x = appleX
        y = appleY
    }
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
        newApplex = appleX
        newAppley = appleY
            //tarkistetaan ettei uusi omena ole käärmeen sisällä, jos on niin luodaan uusi omena
        for (let i = 0; i < player.snake_parts.length; i++) {
            if (newApplex == player.snake_parts[i].x && newAppley == player.snake_parts[i].y) {
                appleX = Math.floor(Math.random() * tilecount) * 20
                appleY = Math.floor(Math.random() * tilecount) * 20
            }
        }
        player.addpart()
        overallscore++
        gamespeed = gamespeed + 0.25
        clearInterval(gameLoop)
        gameLoop = setInterval(step, 1000 / gamespeed)
        console.log(gamespeed)
        document.getElementById('currentscore').innerHTML = overallscore


    }

}

function isGameOver() {

    if (player.velocityX === 0 && player.velocityY === 0) {
        return false;
    }

    //onko pelaaja osunut seinään
    if (player.x < 0) {
        gameOver = true
    } else if (player.x === gameboard.width) {
        gameOver = true
    } else if (player.y < 0) {
        gameOver = true
    } else if (player.y === gameboard.height) {
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
        document.getElementById('gameOver').style.display = "block";

        if (overallscore >= highscore) {
            highscore = overallscore
            document.getElementById('highScore').innerHTML = highscore
            var savedHighscore = highscore
            localStorage.setItem('savedHighScore', savedHighscore)
        }

        document.body.addEventListener('keydown', reload);

    }


}




function change_direction(event) {
    console.log(event.which)
        //estetään pelaajaa antamasta useampaa inputtia yhden gametickin aikana
    if (directionchanged == false) {
        // estää pelaajaa peruuttamasta


        if (event.which == 37 || event.which == 65) {
            if (player.velocityX == 20)
                return
            player.velocityX = -20;
            player.velocityY = 0;
            directionchanged = true

        }
        if (event.which == 39 || event.which == 68) {
            if (player.velocityX == -20)
                return
            player.velocityX = 20;
            player.velocityY = 0;
            directionchanged = true

        }
        if (event.which == 38 || event.which == 87) {
            if (player.velocityY == 20)
                return
            player.velocityX = 0;
            player.velocityY = -20;
            directionchanged = true

        }

        if (event.which == 40 || event.which == 83) {
            if (player.velocityY == -20)
                return
            player.velocityX = 0;
            player.velocityY = 20;
            directionchanged = true

        }
    } else {
        return
    }
}

function reload(event) {

    if (event.which == 32) {
        location.reload()

    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tästä alkaa pelaaja luokka, oli erillisessä tiedostossa mutta ei koulun palvelimella toiminut jostain syystä
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const playercolor = "green"
const playerbordercolor = ""

function Player(x, y) {
    class PlayerParts {
        constructor(x, y) {
            this.x = x
            this.y = y
        }
    }

    this.x = x
    this.y = y
    this.width = 20
    this.height = 20
    this.playercolor = playercolor
    this.playerbordercolor = playerbordercolor
    this.snake_parts = []
    this.playerLength = 3;
    this.velocityX = 0;
    this.velocityY = 0;
    this.score = 0;



    this.drawplayer = function() {

        gameboard_ctx.fillStyle = 'blue'
        gameboard_ctx.strokeStyle = 'white'
        gameboard_ctx.strokeWidth = 1
        for (let i = 0; i < this.snake_parts.length; i++) {
            let part = this.snake_parts[i]
            gameboard_ctx.fillRect(part.x, part.y, 20, 20)
            gameboard_ctx.strokeRect(part.x, part.y, 20, 20)

        }
        //lisää uuden osan
        this.snake_parts.push(new PlayerParts(this.x, this.y))
        if (this.snake_parts.length > this.playerLength) {
            //poistaa vanhimman osan
            this.snake_parts.shift();
        }
        //pelaajan väri
        gameboard_ctx.fillStyle = this.playercolor
        gameboard_ctx.fillRect(this.x, this.y, this.width, this.height)
        gameboard_ctx.strokeRect(this.x, this.y, 20, 20)
    }
    this.addpart = function() {
        this.playerLength++
    }

    this.drawPlayer = function() {

        this.drawplayer()

    }
    this.moveSnake = function() {
        this.x = this.x + this.velocityX
        this.y = this.y + this.velocityY
    }
}