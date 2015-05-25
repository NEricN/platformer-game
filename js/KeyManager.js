var KeyManager = {
    init: function(player) {
        this.player = player;

        this.listener = new window.keypress.Listener();

        this.loadGameControls();
    }

  , loadGameControls: function() {
        this.listener.reset();

        this.listener.register_many([
            {
                "keys"          : "w",
                "is_exclusive"  : false,
                "prevent_repeat": true,
                "on_keydown"    : function() {
                    //console.log("Jumping");
                    this.player.jump();
                },
                "on_keyup"      : function(e) {
                    // console.log("And now you've released w");
                },
                "this"          : this
            },
            {
                "keys"          : "d",
                "is_exclusive"  : false,
                "prevent_repeat": false,
                 "on_keydown"    : function() {
                    //console.log("Movin' right");
                    this.player.moveRight();
                },
                "on_keyup"      : function(e) {
                    // console.log("And now you've released w");
                    this.player.stopMovement();
                },
                "this"          : this
            },
            {
                "keys"          : "a",
                "is_exclusive"  : false,
                "prevent_repeat": false,
                 "on_keydown"    : function() {
                    //console.log("Moving left");
                    this.player.moveLeft();
                },
                "on_keyup"      : function(e) {
                    // console.log("And now you've released w");
                    this.player.stopMovement();
                },
                "this"          : this
            }
        ]);
    }
}