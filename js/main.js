const gameboard_background = 'white'
const gameboard_border = 'black'

var gameboard;
var gameboard_ctx;
window.onload = function() {
    gameboard = document.getElementById('game_canvas')
    gameboard_ctx = gameboard.getContext("2d")

    //aloittaa gameloopin
    gameLoop = setInterval(step, 1000 / 30)

}

//Piirtää canvakselle reunan ja asettaa taustan valkoiseksi
function clearCanvas() {
    //tausta
    gameboard_ctx.fillStyle = gameboard_background;
    gameboard_ctx.fillRect(0, 0, gameboard.width, gameboard.height);
    //reuna
    gameboard_ctx.strokeStyle = gameboard_border;
    gameboard_ctx.lineWidth = 5;
    gameboard_ctx.strokeRect(0, 0, gameboard.width, gameboard.height);
}
player = new Player(500, 250)

function step() {
    draw();
}

function draw() {

    clearCanvas();
    player.drawPlayer(2);
}