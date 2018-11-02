(function() {
    var requestAnimationFrame = window.requestAnimationFrame
                                || window.mozRequestAnimationFrame
                                || window.webkitRequestAnimationFrame
                                || window.msRequestAnimationFrame
                                || function(callback) {
                                        window.setTimeout(callback, 1000 / 60);
                                    };
    window.requestAnimationFrame = requestAnimationFrame;
})();


var atoms = [],
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    atomsCount = 25,
    mX = 100,
    mY = 100

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

var images = [...Array(14).keys()].slice(1);
var pointer_image = new Image();
var pointer_aspect;
pointer_image.src = "assets/images/cucumber.png";

function snow() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < atomsCount; i++) {
        var base_image = new Image();

        var atom = atoms[i],
            x = mX,
            y = mY,
            minDist = 150,
            x2 = atom.x,
            y2 = atom.y;

        var dist = Math.sqrt((x2 - x) * (x2 - x) + (y2 - y) * (y2 - y)),
            dx = x2 - x,
            dy = y2 - y;

        if (dist < minDist) {
            var force = minDist / (dist * dist),
                xcomp = (x - x2) / dist,
                ycomp = (y - y2) / dist,
                deltaV = force / 2;

            atom.velX -= deltaV * xcomp;
            atom.velY -= deltaV * ycomp;

        } else {
            atom.velX *= .98;
            if (atom.velY <= atom.speed) {
                atom.velY = atom.speed
            }
        }

        atom.y += atom.velY;
        atom.x += atom.velX;

        if (atom.y >= canvas.height || atom.y <= 0) {
            reset(atom);
        }

        if (atom.x >= canvas.width || atom.x <= 0) {
            reset(atom);
        }

        ctx.save();

        atom.angle += 3 * Math.random() * atom.direction;
        atom.angle = atom.angle % 360;

        ctx.translate(atom.x, atom.y);
        ctx.rotate(atom.angle * Math.PI / 180);
        base_image.src = "assets/images/cat-" + atom.image + ".png";
        ctx.drawImage(base_image, - atom.size / 2, - atom.size / 2, atom.size, atom.size);

        ctx.restore();
    }

    ctx.drawImage(pointer_image, mX, mY, 50, pointer_aspect * 50);

    requestAnimationFrame(snow);
};

function reset(atom) {
    atom.size = (Math.random() * canvas.width * 0.05) + canvas.width * 0.04;
    atom.x = Math.floor(Math.random() * canvas.width);
    atom.y = 0;
    atom.speed = (Math.random() * canvas.height * 0.002) + canvas.height * 0.0005;
    atom.velY = atom.speed;
    atom.velX = 0;
    atom.direction = Math.round(Math.random() * 2) - 1;
    atom.angle = atom.direction * Math.random() * 360;
    atom.image = Math.floor(Math.random() * images.length) + 1;
}

function init() {
    for (var i = 0; i < atomsCount; i++) {
        var x = Math.floor(Math.random() * canvas.width),
            y = Math.floor(Math.random() * canvas.height),
            size = (Math.random() * canvas.width * 0.05) + canvas.width * 0.04,
            speed = (Math.random() * canvas.height * 0.002) + canvas.height * 0.0005,
            direction = Math.round(Math.random() * 2) - 1;

        atoms.push({
            speed: speed,
            velY: speed,
            velX: 0,
            x: x,
            y: y,
            size: size,
            stepSize: (Math.random()) / 30,
            step: 0,
            direction: direction,
            angle: direction * Math.random() * 360,
            image: Math.floor(Math.random() * images.length) + 1
        });
    }

    snow();
};

window.addEventListener("mousemove", function(e) {
    mX = e.clientX,
    mY = e.clientY
});

window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

document.addEventListener("DOMContentLoaded", function() {
    var url = new URL(window.location.href);
    var header = url.searchParams.get("h");
    var text = url.searchParams.get("t");

    if ((header && header != "") || (text && text != "")) {
        document.getElementById("postcard").style.display = "block";
        document.getElementById("postcard-header").textContent = header;
        document.getElementById("postcard-text").textContent = text;
    }

    pointer_aspect = pointer_image.height / pointer_image.width;
    pointer_image.className = "pointer";

    init();
});
