const gameboard_background = 'black'
const gameboard_border = 'black'
var gameboard_wall = 'rgb(255, 81, 0)'
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
var wallColorchange = 0


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
const touchUp = document.getElementById('touchControlUp')
const touchDown = document.getElementById('touchControlDown')
const touchLeft = document.getElementById('touchControlLeft')
const touchRight = document.getElementById('touchControlRight')
    //Event listenerit napeille kosketuslaitteita varten
touchUp.addEventListener('touchstart', function(event) {
    event.preventDefault()
    touchControls(1)
})
touchDown.addEventListener('touchstart', function(event) {
    event.preventDefault()
    touchControls(2)
})
touchLeft.addEventListener('touchstart', function(event) {
    event.preventDefault()
    touchControls(3)
})
touchRight.addEventListener('touchstart', function(event) {
    event.preventDefault()
    touchControls(4)
})



window.onload = function() {
    gameboard = document.getElementById('game_canvas')
    gameboard_ctx = gameboard.getContext("2d")
        //aloittaa gameloopin
    gameLoop = setInterval(step, 1000 / gamespeed)
        //luo pelaajan
    player = new Player(tilecount * 10, tilecount * 10)
        //luodaan ensimmäisen omenan koordinaatit
    createAppleCoordinates()

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
    changeWallColor()
    player.moveSnake();
    isGameOver();
    checkUnitCollisions();
    drawApple();
    player.drawplayer();
    drawEnemy();
    level_Selected()

}

function changeWallColor() {
    if (wallColorchange == 10) {
        gameboard_wall = 'red'
        wallColorchange = 0
    } else if (wallColorchange == 2) {
        gameboard_wall = 'rgb(221, 88, 0)'
    }
    wallColorchange++
}

function level_Selected() {
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
    gameboard_ctx.fillStyle = 'rgb(0, 245, 33)'
    gameboard_ctx.strokeStyle = 'white'
    gameboard_ctx.lineWidth = 2
    gameboard_ctx.fillRect(x, y, applewidth, appleheight)
    gameboard_ctx.strokeRect(x, y, applewidth, appleheight)

}

function checkUnitCollisions() {
    //tarkistetaan kaikkien pelin objektien collision, ei välttämättä paras tapa hoitaa tätä kaikkea täällä
    if (appleX === player.x && appleY === player.y) {
        createAppleCoordinates()
        drawApple()
        player.addpart()
        overallscore++
        gamespeed = gamespeed + 0.25
        clearInterval(gameLoop)
        gameLoop = setInterval(step, 1000 / gamespeed)
        document.getElementById('currentscore').innerHTML = overallscore
            //luodaan vihollinen aina kun pelaaja on syönyt X määrän omenoita ja tarkistetaan ettei vihollinen ole seinän, pelaajan tai omenan sisällä
            //Viholliset
            /////////////
        if (overallscore % 3 == 0) {

            addEnemy = new staticEnemy(createEnemyCoordinates()[0], createEnemyCoordinates()[1])
            while (true) {

                if (addEnemy.x === player.x && addEnemy.y === player.y) {
                    addEnemy.x = createEnemyCoordinates()[0]
                    addEnemy.y = createEnemyCoordinates()[1]
                }
                for (let i = 0; i < player.snake_parts.length; i++) {
                    if (addEnemy.x === player.snake_parts[i].x && addEnemy.y === player.snake_parts[i].y) {
                        addEnemy.x = createEnemyCoordinates()[0]
                        addEnemy.y = createEnemyCoordinates()[1]
                    }
                }
                if (levelSelected == 2) {
                    if (addEnemy.x === wallLeft[0] && addEnemy.y >= wallLeft[1] && addEnemy.y <= wallLeft[2] ||
                        addEnemy.x === wallRight[0] && addEnemy.y >= wallRight[1] && addEnemy.y <= wallRight[2] ||
                        addEnemy.y === wallDown[0] && addEnemy.x >= wallDown[1] && addEnemy.x <= wallDown[2] ||
                        addEnemy.y === wallUp[0] && addEnemy.x >= wallUp[1] && addEnemy.x <= wallUp[2]) {
                        addEnemy.x = createEnemyCoordinates()[0]
                        addEnemy.y = createEnemyCoordinates()[1]
                    }
                    if (levelSelected == 3) {
                        if (addEnemy.x === wallLeft[0] && addEnemy.y >= wallLeft[1] && addEnemy.y <= wallLeft[2] ||
                            addEnemy.x === wallRight[0] && addEnemy.y >= wallRight[1] && addEnemy.y <= wallRight[2] ||
                            addEnemy.x === wallDown[0] && addEnemy.y >= wallDown[1] && addEnemy.y <= wallDown[2] ||
                            addEnemy.x === wallUp[0] && addEnemy.y >= wallUp[1] && addEnemy.y <= wallUp[2]) {
                            addEnemy.x = createEnemyCoordinates()[0]
                            addEnemy.y = createEnemyCoordinates()[1]
                        }
                    }
                } else if (addEnemy.x === appleX && addEnemy.y === appleY) {
                    addEnemy.x = createEnemyCoordinates()[0]
                    addEnemy.y = createEnemyCoordinates()[1]
                }
                enemies.push(addEnemy)
                break;
            }
        }
        ////////////////////////
    }
    //////////////////////////////////////////////////////////////////////////////////////////
    //Omenat
    //tarkistetaan ettei uusi omena ole seinän sisällä, jos on niin luodaan uusi omena
    if (levelSelected == 2) {

        if (appleX === wallLeft[0] && appleY >= wallLeft[1] && appleY <= wallLeft[2] ||
            appleX === wallRight[0] && appleY >= wallRight[1] && appleY <= wallRight[2] ||
            appleY === wallDown[0] && appleX >= wallDown[1] && appleX <= wallDown[2] ||
            appleY === wallUp[0] && appleX >= wallUp[1] && appleX <= wallUp[2]) {
            createAppleCoordinates()
            drawApple()
        }
    }
    //tarkistetaan ettei uusi omena ole käärmeen tai seinän sisällä, jos on niin luodaan uusi omena
    if (levelSelected == 3) {
        if (appleX === wallLeft[0] && appleY >= wallLeft[1] && appleY <= wallLeft[2] ||
            appleX === wallRight[0] && appleY >= wallRight[1] && appleY <= wallRight[2] ||
            appleX === wallDown[0] && appleY >= wallDown[1] && appleY <= wallDown[2] ||
            appleX === wallUp[0] && appleY >= wallUp[1] && appleY <= wallUp[2]) {
            createAppleCoordinates()

        }
    }
    //tarkistetaan ettei omena ole pelaajan hännän sisällä
    for (let i = 0; i < player.snake_parts.length; i++) {
        if (appleX == player.snake_parts[i].x && appleY == player.snake_parts[i].y) {
            createAppleCoordinates()
        }
    }
    //tarkistetaan ettei omena ole vihollisen sisällä
    for (let i = 0; i < enemies.length; i++) {
        if (appleX === enemies[i].x && appleY === enemies[i].y) {
            createAppleCoordinates()
        }
    }
}

function isGameOver() {
    if (player.velocityX === 0 && player.velocityY === 0) {
        return false;
    }
    //onko pelaaja osunut canvaksen reunaan

    if (player.x < 0 ||
        player.x === gameboard.width ||
        player.y < 0 ||
        player.y === gameboard.height) {
        gameOver = true
    }


    //onko pelaaja osunut esteeseen tasossa cage
    if (levelSelected == 2) {
        if (player.x === wallLeft[0] && player.y >= wallLeft[1] && player.y <= wallLeft[2] ||
            player.x === wallRight[0] && player.y >= wallRight[1] && player.y <= wallRight[2] ||
            player.y === wallDown[0] && player.x >= wallDown[1] && player.x <= wallDown[2] ||
            player.y === wallUp[0] && player.x >= wallUp[1] && player.x <= wallUp[2]) {
            gameOver = true
        }
    }
    //onko pelaaja osunut esteeseen tasossa vertical
    if (levelSelected == 3) {
        if (
            player.x === wallLeft[0] && player.y >= wallLeft[1] && player.y <= wallLeft[2] ||
            player.x === wallRight[0] && player.y >= wallRight[1] && player.y <= wallRight[2] ||
            player.x === wallDown[0] && player.y >= wallDown[1] && player.y <= wallDown[2] ||
            player.x === wallUp[0] && player.y >= wallUp[1] && player.y <= wallUp[2]) {
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
        document.getElementById('game_canvas').addEventListener('touchstart', function(){
            location.reload()
        })
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


function createAppleCoordinates() {
    appleX = Math.floor(Math.random() * tilecount) * 20
    appleY = Math.floor(Math.random() * tilecount) * 20
    return [appleX, appleY]
}

function createEnemyCoordinates() {
    enemyX = Math.floor(Math.random() * tilecount) * 20
    enemyY = Math.floor(Math.random() * tilecount) * 20
    return [enemyX, enemyY]
}


function change_direction(event) {
        //estetään pelaajaa antamasta useampaa inputtia yhden gametickin aikana
    if (directionchanged == false) {
        // estää pelaajaa peruuttamasta
        //vasen
        if (event.which == 37 || event.which == 65) {
            if (player.velocityX == 20)
                return
            player.velocityX = -20;
            player.velocityY = 0;
            directionchanged = true


        }
        //oikea
        if (event.which == 39 || event.which == 68) {
            if (player.velocityX == -20)
                return
            player.velocityX = 20;
            player.velocityY = 0;
            directionchanged = true


        }
        //ylös
        if (event.which == 38 || event.which == 87) {
            if (player.velocityY == 20)
                return
            player.velocityX = 0;
            player.velocityY = -20;
            directionchanged = true

        }
        //alas
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
        document.getElementById('tutorial').style.display = "none"

    }
}

function touchControls(direction) {
    if (directionchanged == false) {
        // estää pelaajaa peruuttamasta
        //vasen
        if (direction === 3) {
            if (player.velocityX == 20)
                return
            player.velocityX = -20;
            player.velocityY = 0;
            directionchanged = true
        }
        //oikea
        if (direction === 4) {
            if (player.velocityX == -20)
                return
            player.velocityX = 20;
            player.velocityY = 0;
            directionchanged = true
        }
        //ylös
        if (direction === 1) {
            if (player.velocityY == 20)
                return
            player.velocityX = 0;
            player.velocityY = -20;
            directionchanged = true
        }
        //alas
        if (direction === 2) {
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
        document.getElementById('tutorial').style.display = "none"

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
const playercolor = "red"
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
    this.playerLength = 2;
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