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

        setPosition: function(v) {
            this.x = v.x;
            this.y = v.y;
        },

        getPosition: function() {
            //console.log(this.x + "," + this.y + " :: " + (this.width/2 - this.x) + "," + (-this.height/2 + this.y));
            return new PhysicsManager.b2Vec2(this.width/2 - 30*this.x, this.height/2 - 30*this.y);
        }
    }

    function step(timestamp) {
        //canvasContext.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
        try {
            player.move();
            PhysicsManager.step(timestamp - start);
            player.updatePosition(Game);
            PhysicsManager.renderDebugData();
        }
        catch(err) {
            console.log(err.message);
        }
        start = timestamp;
        window.requestAnimationFrame(step);
    }

    PhysicsManager.init({context: Game.canvasContext, isDebug: true, canvas: Game.canvas, game: Game});

    player = new Player();

    keyManager = KeyManager.init(player);

    window.requestAnimationFrame(step);
}
