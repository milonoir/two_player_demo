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
    x: 10,
    y: 10,
    speed: 2,

    move() {
        if (upKey) {
            if (this.y <= 0) {
                this.y = 0;
            } else {
                this.y -= this.speed;
            }
        } else if (downKey) {
            if (this.y + this.height >= cvHeight) {
                this.y = cvHeight - this.height;
            } else {
                this.y += this.speed;
            }
        }

        if (leftKey) {
            if (this.x <= 0) {
                this.x = 0;
            } else {
                this.x -= this.speed;
            }
        } else if (rightKey) {
            if (this.x + this.width >= cvWidth) {
                this.x = cvWidth - this.width;
            } else {
                this.x += this.speed;
            }
        }
    },

    draw() {
        ctx.fillStyle = "#FF0000";
        ctx.fillRect(this.x, this.y, this.width, this.height);
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
        px: rect.x,
        py: rect.y
    }

    ws.send(JSON.stringify(msg));
}

// animate every frame
var x = setInterval(animate, 1000 / GAME_FPS);

// send data to server in every other frame
var y = setInterval(sync, 1000 / (GAME_FPS / 2));

draw();
