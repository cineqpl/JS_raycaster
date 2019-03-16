window.onload = function() {

    const FULL_CIRCLE = Math.PI * 2;

    class Controls {
        constructor() {
            this.codes = { 37: 'left', 39: 'right', 38: 'forward', 40: 'backward' };
            this.states = { 'left': false, 'right': false, 'forward': false, 'backward': false };
            document.addEventListener('keydown', this.onKey.bind(this, true), false);
            document.addEventListener('keyup', this.onKey.bind(this, false), false);
        }
    }

    Controls.prototype.onKey = function (val, e) {
        var state = this.codes[e.keyCode];
        if (typeof state === 'undefined') return;
        this.states[state] = val;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
    }

    class Player {
        constructor(x, y, direction) {
            this.x = x;
            this.y = y;
            this.direction = direction;
            this.walkSpeed = 0.05;
            this.rotateSpeed = 0.05;
        }
    }

    Player.prototype.walk = function (distance, map) {
        var dx = Math.cos(this.direction) * distance;
        var dy = Math.sin(this.direction) * distance;
        if (map.get(this.x + dx, this.y) <= 0) this.x += dx;
        if (map.get(this.x, this.y + dy) <= 0) this.y += dy;
    }

    Player.prototype.rotate = function(angle) {
        this.direction = (this.direction + angle + FULL_CIRCLE) % FULL_CIRCLE;
    }

    Player.prototype.update = function(controls, map, seconds) {
        if(controls.left) this.rotate(-Math.PI * seconds);
        if(controls.right) this.rotate(Math.PI * seconds);
        if(controls.forward) this.walk(3 * seconds, map);
        if(controls.backward) this.walk(-3 * seconds, map);
    }

    class Map {
        constructor(size) {
            this.size = size;
            this.wallGrid = new Array(size * size);
        }
    }

    Map.prototype.get = function(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if(x < 0 || x > this.size - 1 || y < 0 || y > this.size - 1) return -1;
        return wallGrid[y * this.size + x];
    }

    Map.prototype.init = function() {

    }

    class Camera {
        constructor(screen, resolution, fov) {
            this.screen = screen;
            this.resolution = resolution;
            this.fov = Math.min(fov, 0.8);
        }
    };
    
    Camera.prototype.render = function(player, map) {
        this.drawColumns(player, map);
    }

    Camera.prototype.drawColumns = function(player, map) {

    }

    function ray(origin) {
        var stepX = step()
    }

    var gameScreen = document.getElementById("gameScreen");
    var player = new Player(1, 1, Math.PI * 0.5);
    var map = new Map(64);
    var controls = new Controls();
    var camera = new Camera(gameScreen, 480, 0.6);

    function mainLoop(timestamp) {
        player.update(controls, map, seconds);
        camera.render(player, map);
        requestAnimationFrame(mainLoop);
    }

    requestAnimationFrame(mainLoop);
}