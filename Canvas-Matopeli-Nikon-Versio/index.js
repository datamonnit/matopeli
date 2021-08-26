const gameboard_background = 'black'
const gameboard_border = 'black'
const gameboard_wall = 'rgba(251, 255, 0, 0.9)'
const gameboard_wall_border = 'white'

var gameboard;
var gameboard_ctx;
var applewidth = 20;
var appleheight = 20;
var appleX;
var appleY;
var tilecount = 30
var gamespeed = 10
var overallscore = 0;
var enemyCount = 0;
var enemies = []
///////////////////////////////////////////////
//Tasojen pisteet
var level1Highscore = localStorage.getItem('savedHighScore1');
var level2Highscore = localStorage.getItem('savedHighScore2');
var level3Highscore = localStorage.getItem('savedHighScore3');
///////////////////////////////////////////////
var levelSelected = 1;
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

//Piirtää canvakselle reunan ja asettaa taustan valkoiseksi
function clearCanvas() {
    //tausta
    gameboard_ctx.fillStyle = gameboard_background;
    gameboard_ctx.fillRect(0, 0, gameboard.width, gameboard.height);
}

function levelClassic() {
    if (level1Highscore == null || level1Highscore == undefined) {
        level1Highscore = 0
    }
    document.getElementById('highScore').innerHTML = level1Highscore
    document.getElementById('levelcount').innerHTML = 'Classic'
}

function levelCage() {
    if (level2Highscore == null || level2Highscore == undefined) {
        level2Highscore = 0
    }
    document.getElementById('highScore').innerHTML = level2Highscore
    document.getElementById('levelcount').innerHTML = 'Cage'
    gameboard_ctx.fillStyle = gameboard_wall
    gameboard_ctx.lineWidth = 3

    //Seinien koordinaatit collisionia varten

    wallLeft = [80, 160, 440]
    wallRight = [500, 160, 440]
    wallUp = [100, 160, 420]
    wallDown = [500, 160, 420]
        //piirretään seinät
        //vasen
    gameboard_ctx.fillRect(80, 160, 20, 300),
        gameboard_ctx.strokeRect(80, 160, 20, 300)

    //oikea
    gameboard_ctx.fillRect(500, 160, 20, 300),
        gameboard_ctx.strokeRect(500, 160, 20, 300)

    //ylä
    gameboard_ctx.fillRect(160, 100, 280, 20),
        gameboard_ctx.strokeRect(160, 100, 280, 20)

    //ala
    gameboard_ctx.fillRect(160, 500, 280, 20),
        gameboard_ctx.strokeRect(160, 500, 280, 20)




}

function levelVertical() {
    if (level3Highscore == null || level3Highscore == undefined) {
        level3Highscore = 0
    }
    document.getElementById('highScore').innerHTML = level3Highscore

    document.getElementById('levelcount').innerHTML = 'Vertical'
    gameboard_ctx.fillStyle = gameboard_wall
    gameboard_ctx.lineWidth = 3

    //Seinien koordinaatit collisionia varten, järjestys X, Y, pituus

    wallLeft = [80, 100, 480]
    wallRight = [500, 100, 480]
    wallUp = [380, 100, 480]
    wallDown = [200, 100, 480]
        //piirretään seinät
        //vasen
    gameboard_ctx.fillRect(80, 100, 20, 400),
        gameboard_ctx.strokeRect(80, 100, 20, 400)

    //oikea
    gameboard_ctx.fillRect(500, 100, 20, 400),
        gameboard_ctx.strokeRect(500, 100, 20, 400)

    //ylä
    gameboard_ctx.fillRect(380, 100, 20, 400),
        gameboard_ctx.strokeRect(380, 100, 20, 400)

    //ala
    gameboard_ctx.fillRect(200, 100, 20, 400),
        gameboard_ctx.strokeRect(200, 100, 20, 400)

}


function step() {
    directionchanged = false
    clearCanvas();
    player.moveSnake();
    isGameOver();
    checkUnitCollisions();
    drawApple();
    player.drawplayer();
    drawEnemy();
    console.log(player.x, player.y)
    switch (levelSelected) {
        case 1:
            levelClassic();
            return
        case 2:
            levelCage();
            return
        case 3:
            levelVertical();
            return
        default:
            levelClassic();
    }
}

function drawApple() {
    x = appleX
    y = appleY
    gameboard_ctx.fillStyle = 'lightgreen'
    gameboard_ctx.strokeStyle = 'white'
    gameboard_ctx.lineWidth = 2
    gameboard_ctx.fillRect(x, y, applewidth, appleheight)
    gameboard_ctx.strokeRect(x, y, applewidth, appleheight)

}

function checkUnitCollisions() {
    //tarkistetaan kaikkien pelin objektien collision, erittäin huono tapa 
    if (appleX === player.x && appleY === player.y) {
        appleX = Math.floor(Math.random() * tilecount) * 20
        appleY = Math.floor(Math.random() * tilecount) * 20
        drawApple()
        player.addpart()
        overallscore++
        gamespeed = gamespeed + 0.25
        clearInterval(gameLoop)
        gameLoop = setInterval(step, 1000 / gamespeed)
        console.log(gamespeed)
        document.getElementById('currentscore').innerHTML = overallscore
            //luodaan vihollinen aina kun pelaaja on syönyt 5 omenaa ja tarkistetaan ettei vihollinen ole seinän, pelaajan tai omenan sisällä
        if (overallscore % 3 == 0) {

            addEnemy = new staticEnemy(Math.floor(Math.random() * tilecount) * 20, Math.floor(Math.random() * tilecount) * 20)
            while (true) {

                if (addEnemy.x === player.x && addEnemy.y === player.y) {
                    addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                    addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                }
                for (let i = 0; i < player.snake_parts.length; i++) {
                    if (addEnemy.x === player.snake_parts[i].x && addEnemy.y === player.snake_parts[i].y) {
                        addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                        addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                    }
                }
                if (levelSelected == 2) {
                    if (addEnemy.x === wallLeft[0] && addEnemy.y >= wallLeft[1] && addEnemy.y <= wallLeft[2]) {
                        addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                        addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                    } else if (addEnemy.x === wallRight[0] && addEnemy.y >= wallRight[1] && addEnemy.y <= wallRight[2]) {
                        addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                        addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                    } else if (addEnemy.y === wallDown[0] && addEnemy.x >= wallDown[1] && addEnemy.x <= wallDown[2]) {
                        addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                        addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                    } else if (addEnemy.y === wallUp[0] && addEnemy.x >= wallUp[1] && addEnemy.x <= wallUp[2]) {
                        addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                        addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                    }
                    if (levelSelected == 3) {
                        if (addEnemy.x === wallLeft[0] && addEnemy.y >= wallLeft[1] && addEnemy.y <= wallLeft[2]) {
                            addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                            addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                            
                        } else if (addEnemy.x === wallRight[0] && addEnemy.y >= wallRight[1] && addEnemy.y <= wallRight[2]) {
                            addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                            addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                        } else if (addEnemy.x === wallDown[0] && addEnemy.y >= wallDown[1] && addEnemy.y <= wallDown[2]) {
                            addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                            addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                        } else if (addEnemy.x === wallUp[0] && addEnemy.y >= wallUp[1] && addEnemy.y <= wallUp[2]) {
                            addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                            addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                        }
                    }
                } else if (addEnemy.x === appleX && addEnemy.y === appleY) {
                    addEnemy.x = Math.floor(Math.random() * tilecount) * 20
                    addEnemy.y = Math.floor(Math.random() * tilecount) * 20
                }
                enemies.push(addEnemy)
                break;
            }

        }
    }
    if (levelSelected == 2) {
        //tarkistetaan ettei uusi omena ole seinän sisällä, jos on niin luodaan uusi omena
        if (appleX === wallLeft[0] && appleY >= wallLeft[1] && appleY <= wallLeft[2]) {
            appleX = Math.floor(Math.random() * tilecount) * 20
            appleY = Math.floor(Math.random() * tilecount) * 20
            drawApple()
        } else if (appleX === wallRight[0] && appleY >= wallRight[1] && appleY <= wallRight[2]) {
            appleX = Math.floor(Math.random() * tilecount) * 20
            appleY = Math.floor(Math.random() * tilecount) * 20
            drawApple()
        } else if (appleY === wallDown[0] && appleX >= wallDown[1] && appleX <= wallDown[2]) {
            appleX = Math.floor(Math.random() * tilecount) * 20
            appleY = Math.floor(Math.random() * tilecount) * 20
            drawApple()
        } else if (appleY === wallUp[0] && appleX >= wallUp[1] && appleX <= wallUp[2]) {
            appleX = Math.floor(Math.random() * tilecount) * 20
            appleY = Math.floor(Math.random() * tilecount) * 20
            drawApple()
        }
    }
    if (levelSelected == 3) {
        //tarkistetaan ettei uusi omena ole käärmeen tai seinän sisällä, jos on niin luodaan uusi omena
        if (appleX === wallLeft[0] && appleY >= wallLeft[1] && appleY <= wallLeft[2]) {
            appleX = Math.floor(Math.random() * tilecount) * 20
            appleY = Math.floor(Math.random() * tilecount) * 20
            drawApple()
        } else if (appleX === wallRight[0] && appleY >= wallRight[1] && appleY <= wallRight[2]) {
            appleX = Math.floor(Math.random() * tilecount) * 20
            appleY = Math.floor(Math.random() * tilecount) * 20
            drawApple()
        } else if (appleX === wallDown[0] && appleY >= wallDown[1] && appleY <= wallDown[2]) {
            appleX = Math.floor(Math.random() * tilecount) * 20
            appleY = Math.floor(Math.random() * tilecount) * 20
            drawApple()
        } else if (appleX === wallUp[0] && appleY >= wallUp[1] && appleY <= wallUp[2]) {
            appleX = Math.floor(Math.random() * tilecount) * 20
            appleY = Math.floor(Math.random() * tilecount) * 20
            drawApple()
        }
    }
    //tarkistetaan ettei omena ole pelaajan hännän sisällä
    for (let i = 0; i < player.snake_parts.length; i++) {
        if (appleX == player.snake_parts[i].x && appleY == player.snake_parts[i].y) {
            appleX = Math.floor(Math.random() * tilecount) * 20
            appleY = Math.floor(Math.random() * tilecount) * 20
        }
    }
    //tarkistetaan ettei omena ole vihollisen sisällä
    for (let i = 0; i < enemies.length; i++) {
        if (appleX === enemies[i].x && appleY === enemies[i].y) {
            appleX = Math.floor(Math.random() * tilecount) * 20
            appleY = Math.floor(Math.random() * tilecount) * 20
        }
    }
}

function isGameOver() {

    if (player.velocityX === 0 && player.velocityY === 0) {
        return false;
    }

    //onko pelaaja osunut seinään tasossa classic
    if (levelSelected == 1) {
        if (player.x < 0) {
            gameOver = true
        } else if (player.x === gameboard.width) {
            gameOver = true
        } else if (player.y < 0) {
            gameOver = true
        } else if (player.y === gameboard.height) {
            gameOver = true
        }

    }
    //onko pelaaja osunut seinään tasossa cage
    if (levelSelected == 2) {
        if (player.x < 0) {
            gameOver = true
        } else if (player.x === gameboard.width) {
            gameOver = true
        } else if (player.y < 0) {
            gameOver = true
        } else if (player.y === gameboard.height) {
            gameOver = true
        } else if (player.x === wallLeft[0] && player.y >= wallLeft[1] && player.y <= wallLeft[2]) {
            gameOver = true
        } else if (player.x === wallRight[0] && player.y >= wallRight[1] && player.y <= wallRight[2]) {
            gameOver = true
        } else if (player.y === wallDown[0] && player.x >= wallDown[1] && player.x <= wallDown[2]) {
            gameOver = true
        } else if (player.y === wallUp[0] && player.x >= wallUp[1] && player.x <= wallUp[2]) {
            gameOver = true
        }
    }
    //onko pelaaja osunut seinään tasossa vertical
    if (levelSelected == 3) {
        if (player.x < 0) {
            gameOver = true
        } else if (player.x === gameboard.width) {
            gameOver = true
        } else if (player.y < 0) {
            gameOver = true
        } else if (player.y === gameboard.height) {
            gameOver = true
        } else if (player.x === wallLeft[0] && player.y >= wallLeft[1] && player.y <= wallLeft[2]) {
            gameOver = true
        } else if (player.x === wallRight[0] && player.y >= wallRight[1] && player.y <= wallRight[2]) {
            gameOver = true
        } else if (player.x === wallDown[0] && player.y >= wallDown[1] && player.y <= wallDown[2]) {
            gameOver = true
        } else if (player.x === wallUp[0] && player.y >= wallUp[1] && player.y <= wallUp[2]) {
            gameOver = true
        }


    }
    for (let i = 0; i < player.snake_parts.length; i++) {
        let part = player.snake_parts[i]
        if (part.x === player.x && part.y === player.y) {
            gameOver = true

        }
    }
    for (let i = 0; i < enemies.length; i++) {
        if (player.x === enemies[i].x && player.y === enemies[i].y) {
            gameOver = true
        }
    }

    if (gameOver == true) {
        clearInterval(gameLoop)
        document.getElementById('gameOver').style.display = "block";
        document.body.addEventListener('keydown', reload);
        switch (levelSelected) {
            case 1:
                if (overallscore >= level1Highscore) {
                    level1Highscore = overallscore
                    document.getElementById('highScore').innerHTML = level1Highscore
                    var savedHighScore1 = level1Highscore
                    localStorage.setItem('savedHighScore1', savedHighScore1)
                }
                return
            case 2:
                if (overallscore >= level2Highscore) {
                    level2Highscore = overallscore
                    document.getElementById('highScore').innerHTML = level2Highscore
                    var savedHighScore2 = level2Highscore
                    localStorage.setItem('savedHighScore2', savedHighScore2)
                }
                return
            case 3:
                if (overallscore >= level3Highscore) {
                    level3Highscore = overallscore
                    document.getElementById('highScore').innerHTML = level3Highscore
                    var savedHighScore3 = level3Highscore
                    localStorage.setItem('savedHighScore3', savedHighScore3)
                }
                return
            default:
                return
        }



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
    if (player.velocityX != 0 || player.velocityY != 0) {
        document.getElementById('levelCounter').style.display = "none"
        document.getElementById('gameControls').style.display = "none"
        document.getElementById('levelSelect').style.display = "none"

    }
}

function reload(event) {

    if (event.which == 32) {
        location.reload()

    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Tästä alkaa pelaaja objekti, oli erillisessä tiedostossa mutta ei koulun palvelimella toiminut jostain syystä
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
const playercolor = "rgb(160, 104, 0)"
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
        gameboard_ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
    this.addpart = function() {
        this.playerLength++
    }

    this.moveSnake = function() {
        this.x = this.x + this.velocityX
        this.y = this.y + this.velocityY
    }
}
//////////////////////
// Vihollisen luonti
//////////////////////
function staticEnemy(x, y) {
    this.x = x
    this.y = y
    this.height = 20
    this.width = 20

}

function drawEnemy() {
    for (let i = 0; i < enemies.length; i++) {
        gameboard_ctx.fillStyle = "purple"
        gameboard_ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height)
        gameboard_ctx.strokeRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height)
    }

}