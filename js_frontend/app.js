const R_WIDTH = 50;
const R_HEIGHT = 50;
const R_SPEED = 2;

const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;

// canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var cvWidth = canvas.width;
var cvHeight = canvas.height;

// rectangle coords
var r_x = 10, r_y = 10;

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
    if (upKey) {
        if (r_y <= 0) {
            r_y = 0;
        } else {
            r_y -= R_SPEED;
        }
    } else if (downKey) {
        if (r_y + R_HEIGHT >= cvHeight) {
            r_y = cvHeight - R_HEIGHT;
        } else {
            r_y += R_SPEED;
        }
    }

    if (leftKey) {
        if (r_x <= 0) {
            r_x = 0;
        } else {
            r_x -= R_SPEED;
        }
    } else if (rightKey) {
        if (r_x + R_WIDTH >= cvWidth) {
            r_x = cvWidth - R_WIDTH;
        } else {
            r_x += R_SPEED;
        }
    }
}

function draw() {
    animate();

    ctx.clearRect(0, 0, cvWidth, cvHeight);

    ctx.fillStyle = "#FF0000";
    ctx.fillRect(r_x, r_y, R_WIDTH, R_HEIGHT);

    requestAnimationFrame(draw);
}

draw();
