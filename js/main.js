var Game;

var init = function() {
    var start = null;

    Game = {
        x: 0,
        y: 0,
        width: 1000,
        height: 600,
        renderScale: 30.0,
        canvas: document.getElementById("canvas"),
        canvasContext: document.getElementById("canvas").getContext("2d"),
        canvasChanged: false,

        setPosition: function(v) {
            this.x = v.x;
            this.y = v.y;
        },

        getPosition: function() {
            //console.log(this.x + "," + this.y + " :: " + (this.width/2 - this.x) + "," + (-this.height/2 + this.y));
            return new PhysicsManager.b2Vec2(this.width/2 - 30*this.x, this.height/2 - 30*this.y);
        },

        initResize: function() {
            var self = this;
            var resizeCanvas = function() {
                self.canvasChanged = true;
                self.canvas.width = window.innerWidth;
                self.canvas.height = window.innerHeight;

                self.width = window.innerWidth;
                self.height = window.innerHeight;

                self.canvasContext = self.canvas.getContext("2d");
            }
            window.addEventListener('resize', resizeCanvas, false);

            resizeCanvas();
        },

        step: function(timestamp) {
            try {
                this.player.move();
                PhysicsManager.step(timestamp - start);
                this.player.updatePosition(this);
                PhysicsManager.renderDebugData();
            }
            catch(err) {
                console.log(this);
                console.log(err.message);
            }
            start = timestamp;
            window.requestAnimationFrame(this.step.bind(this));
        },

        initPlayer: function() {
            this.player = new Player();
        },

        initPhysics: function() {
            PhysicsManager.init({context: Game.canvasContext, isDebug: true, canvas: Game.canvas, game: this});
        },

        init: function() {
            this.initResize();
            this.initPhysics();
            this.initPlayer();
            this.initKeyManager();

            window.requestAnimationFrame(this.step.bind(this));
        },

        initKeyManager: function() {
            this.keyManager = KeyManager.init(this.player);
        }
    }

    Game.init();
}
