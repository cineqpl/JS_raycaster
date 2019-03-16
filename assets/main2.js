window.onload = function() {
    const TWO_PI = 2 * Math.PI;

    class Map {
        constructor(width, height, wallGrid, scale) {
            this.width = width;
            this.height = height;
            this.wallGrid = wallGrid;
            this.scale = scale;
        }
    }

    Map.prototype.get = function(x, y) {
        x = Math.floor(x);
        y = Math.floor(y);
        if(x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) return -1;
        return this.wallGrid[x][y];
    }

    Map.prototype.drawMiniMap = function(canv, player) {
        canv.width = this.width * this.scale;
        canv.height = this.height * this.scale;

        canv.style.width  = (this.width  * this.scale) + 'px';
        canv.style.height = (this.height * this.scale) + 'px';

        var ctx = canv.getContext('2d');

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canv.width, canv.height);

        for(let x = 0; x < this.width; x++) {
            for(let y = 0; y < this.height; y++) {
                let wall = this.get(x, y);

                if(wall > 0) {
                    ctx.fillStyle = 'rgb(200, 200, 200)';
                    ctx.fillRect(
                        x * this.scale,
                        y * this.scale,
                        this.scale, this.scale
                    )
                }
            }
        }

        let playerSize = 6;

        // Dot at player position
        ctx.fillStyle = 'black';
        ctx.fillRect(
            player.x * this.scale - playerSize / 2,
            player.y * this.scale - playerSize / 2,
            playerSize, playerSize
        );

        // Line segment from player position at player angle

        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.moveTo(
            player.x * this.scale,
            player.y * this.scale
        );
        ctx.lineTo(
            player.x * this.scale + playerSize * Math.cos(player.direction) * 5,
            player.y * this.scale + playerSize * Math.sin(player.direction) * 5,
        );
        ctx.closePath();
        ctx.stroke();
    }

    class Player {
        constructor(initX, initY, initDir) {
            this.x = initX;
            this.y = initY;
            this.direction = initDir;
            this.moveSpeed = 3;
            this.rotationSpeed = 63 * Math.PI / 180;
        }
    }

    Player.prototype.walk = function(distance, map) {
        var dx = Math.cos(this.direction) * distance;
        var dy = Math.sin(this.direction) * distance;
        if (map.get(this.x + dx, this.y) <= 0) this.x += dx;
        if (map.get(this.x, this.y + dy) <= 0) this.y += dy;
    }

    Player.prototype.rotate = function(angle) {
        this.direction = (this.direction + angle + TWO_PI) % TWO_PI;
    }

    Player.prototype.move = function(states, map) {
        if(states.right) this.rotate( Math.PI * this.rotationSpeed / 60);
        if(states.left)  this.rotate(-Math.PI * this.rotationSpeed / 60);
        if(states.forward)  this.walk( this.moveSpeed / 60, map);
        if(states.backward) this.walk(-this.moveSpeed / 60, map);
    }

    class Controls {
        constructor() {
            this.codes = {
                65: 'left',
                68: 'right',
                87: 'forward',
                83: 'backward',
                67: 'crouch'
            };
            this.states = {
                'left': false,
                'right': false,
                'forward': false,
                'backward': false,
                'crouch': false
            };
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

    var grid = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 3, 0, 3, 0, 0, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 3, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1],
        [1, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 3, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [1, 0, 0, 3, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 4, 0, 0, 4, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 4, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 4, 3, 3, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    var canv  = document.getElementById('minimap');
    var stats = document.getElementById('stats');

    var map = new Map(24, 32, grid, 10);
    var controls = new Controls();
    var player = new Player(1, 1, Math.PI * 0.5);


    function mainLoop() {
        player.move(controls.states, map);
        map.drawMiniMap(canv, player);
        stats.innerText = `X: ${player.x.toFixed(3)} Y: ${player.y.toFixed(3)}
                          Direction: ${(player.direction * 180 / Math.PI).toFixed(3)}
                          Crouching: ${controls.states.crouch}`;
        requestAnimationFrame(mainLoop);
    }
    requestAnimationFrame(mainLoop);
}