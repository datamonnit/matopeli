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
        for (let i = 0; i < this.snake_parts.length; i++) { //lisää uuden osan
            let part = this.snake_parts[i]
            gameboard_ctx.fillRect(part.x, part.y, 20, 20)
            gameboard_ctx.strokeRect(part.x, part.y, 20, 20)
           
        }
        this.snake_parts.push(new PlayerParts(this.x, this.y))
        if (this.snake_parts.length > this.playerLength) {
            this.snake_parts.shift(); //poistaa vanhimman osan
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
