const GAME_FPS = 60;

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

// canvas globals
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var cvWidth = canvas.width;
var cvHeight = canvas.height;

var rect = {
    width: 50,
    height: 50,
    posX: 10,
    posY: 10,
    spdX: 0,
    spdY: 0,
    accX: 0,
    accY: 0,
    speed: 2,

    move() {
        if (upKey) {
            if (this.posY <= 0) {
                this.posY = 0;
            } else {
                this.posY -= this.speed;
            }
        } else if (downKey) {
            if (this.posY + this.height >= cvHeight) {
                this.posY = cvHeight - this.height;
            } else {
                this.posY += this.speed;
            }
        }

        if (leftKey) {
            if (this.posX <= 0) {
                this.posX = 0;
            } else {
                this.posX -= this.speed;
            }
        } else if (rightKey) {
            if (this.posX + this.width >= cvWidth) {
                this.posX = cvWidth - this.width;
            } else {
                this.posX += this.speed;
            }
        }
    },

    draw() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
    }
}

// arrow key flags
var upKey = downKey = leftKey = rightKey = false;

document.onkeydown = function (e) {
    e = e || window.event;

    if (e.keyCode == KEY_UP)
        upKey = true;
    else if (e.keyCode == KEY_DOWN)
        downKey = true;

    if (e.keyCode == KEY_LEFT)
        leftKey = true;
    else if (e.keyCode == KEY_RIGHT)
        rightKey = true;
};

document.onkeyup = function (e) {
    e = e || window.event;

    if (e.keyCode == KEY_UP)
        upKey = false;
    else if (e.keyCode == KEY_DOWN)
        downKey = false;

    if (e.keyCode == KEY_LEFT)
        leftKey = false;
    else if (e.keyCode == KEY_RIGHT)
        rightKey = false;
}

function animate() {
    rect.move();
}

function draw() {
    ctx.clearRect(0, 0, cvWidth, cvHeight);

    rect.draw();

    requestAnimationFrame(draw);
}

var ws = new WebSocket("ws://localhost:8000/ws");

function sync() {
    var msg = {
        id: 1,
        px: rect.posX,
        py: rect.posY
    }

    ws.send(JSON.stringify(msg));
}

// animate every frame
var x = setInterval(animate, 1000 / GAME_FPS);

// send data to server in every other frame
var y = setInterval(sync, 1000 / (GAME_FPS / 2));

draw();
