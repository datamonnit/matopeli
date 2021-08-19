const playercolor = "lightgreen"
const playerbordercolor = ""

function Player(x, y) {

    this.x = x
    this.y = y
    this.width = 20
    this.height = 20
    this.playercolor = playercolor
    this.playerbordercolor = playerbordercolor
    this.player_length = 1



    this.change_direction = function(event) {
        const LEFT_KEY = 37 || "a";
        const RIGHT_KEY = 39 || "d";
        const UP_KEY = 38 || "w";
        const DOWN_KEY = 40 || "s";

        // estää pelaajaa peruuttamasta

        if (changing_direction) return;
        changing_direction = true;
        const keyPressed = event.keyCode;
        const goingUp = dy === -10;
        const goingDown = dy === 10;
        const goingRight = dx === 10;
        const goingLeft = dx === -10;
        if (keyPressed === LEFT_KEY && !goingRight) {
            dx = -20;
            dy = 0;
        }
        if (keyPressed === UP_KEY && !goingDown) {
            dx = 0;
            dy = -20;
        }
        if (keyPressed === RIGHT_KEY && !goingLeft) {
            dx = 20;
            dy = 0;
        }
        if (keyPressed === DOWN_KEY && !goingUp) {
            dx = 0;
            dy = 20;
        }
    }

    this.drawplayerPart = function(part) {
        //pelaajan väri
        gameboard_ctx.fillStyle = this.playercolor
            //pelaajan reunuksen väri
        gameboard_ctx.lineWidth = 2
        gameboard_ctx.strokestyle = this.playerbordercolor
        gameboard_ctx.fillRect(this.x, this.y, this.width, this.height)
        gameboard_ctx.strokeRect(this.x, this.y, this.width, this.height)
    }
    this.drawPlayer = function() {
        for (i = 0; i <= this.player_length; i++) {
            this.drawplayerPart(i)
        }
    }

}