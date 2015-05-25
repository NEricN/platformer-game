var PhysicsManager = {
    world: null
  , isDebugDraw: true

  , b2Vec2: Box2D.Common.Math.b2Vec2
  , b2BodyDef: Box2D.Dynamics.b2BodyDef
  , b2Body: Box2D.Dynamics.b2Body
  , b2FixtureDef: Box2D.Dynamics.b2FixtureDef
  , b2Fixture: Box2D.Dynamics.b2Fixture
  , b2World: Box2D.Dynamics.b2World
  , b2MassData: Box2D.Collision.Shapes.b2MassData
  , b2PolygonShape: Box2D.Collision.Shapes.b2PolygonShape
  , b2CircleShape: Box2D.Collision.Shapes.b2CircleShape
  , b2DebugDraw: Box2D.Dynamics.b2DebugDraw

  , gravity: new Box2D.Common.Math.b2Vec2(0, 10)

  , applyImpulseOnObject: function(obj, imp) {
        obj.m_body.ApplyImpulse(imp, obj.m_body.GetPosition())
    }

  , setObjectVelocity: function(obj, vel) {
        obj.m_body.SetLinearVelocity(vel);
    }

  , step: function(dt) {
        this.world.Step(
           1 / 60   //frame-rate
        ,  10       //velocity iterations
        ,  10       //position iterations
        );
        if(this.isDebugDraw)
            this.renderDebugData();
        this.world.ClearForces();
    }

  , renderDebugData: function() {
        this.canvasContext.save();
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.translate(100, 0);
        this.world.DrawDebugData();
        this.canvasContext.restore();
    }

  , setDebugDraw: function(canvasContext) {
        this.isDebugDraw = true;
        this.canvasContext = canvasContext;
        debugDraw = new this.b2DebugDraw();
        debugDraw.SetSprite(canvasContext);
        debugDraw.SetDrawScale(30.0);
        debugDraw.SetFillAlpha(0.3);
        debugDraw.SetLineThickness(1.0);
        debugDraw.SetFlags(this.b2DebugDraw.e_shapeBit | this.b2DebugDraw.e_jointBit);
        this.world.SetDebugDraw(debugDraw);

        this.debugDraw = debugDraw;
    }

  , createBox: function(x, y, width, height, properties) {
        var bodyDef = new this.b2BodyDef;
        var fixDef = new this.b2FixtureDef;

        properties = properties||{};

        bodyDef.type = properties.isStatic ? this.b2Body.b2_staticBody : this.b2Body.b2_dynamicBody;

        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        //specific
        fixDef.shape = new this.b2PolygonShape();
        fixDef.shape.SetAsBox(
            width/2 //half width
          , height/2 //half height
        );

        bodyDef.position.x = x;
        bodyDef.position.y = y;

        return this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    }

  , createCircle: function(x, y, r, properties) {
        var bodyDef = new Box2D.Dynamics.b2BodyDef;
        var fixDef = new Box2D.Dynamics.b2FixtureDef;

        properties = properties||{};

        bodyDef.type = properties.isStatic ? this.b2Body.b2_staticBody : this.b2Body.b2_dynamicBody;

        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;

        //specific
        fixDef.shape = new this.b2CircleShape(r);

        bodyDef.position.x = x;
        bodyDef.position.y = y;
        return this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    }

  , init: function(properties) {
        this.world = new this.b2World(this.gravity);

        this.canvas = properties.canvas;

        if(properties.isDebug) {
            this.isDebugDraw = true;
            this.setDebugDraw(properties.context);
            this.initTestMap();
        }
    }

  , initTestMap: function() {
        this.createBox(25, 20, 50, 1, {isStatic: true});
        this.createBox(1, 10, 1, 20, {isStatic: true});
        this.createBox(25, 10, 1, 20, {isStatic: true});
        for(var i = 0; i < 20; ++i) {
            if(Math.random() > 0.5) {
                this.createBox(Math.random()*10 + 2, Math.random()*10 + 2, Math.random()+0.1, Math.random() + 0.1);
            } else {
                this.createCircle(Math.random()*10 + 2, Math.random()*10 + 2, Math.random()+0.1);
            }
        }
    }
};

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
                    console.log("Jumping");
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
                    console.log("Movin' right");
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
                    console.log("Moving left");
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

var Player = function() {
    this.physicsObject = PhysicsManager.createBox(10, 10, 1, 1);
    this.physicsObject.m_body.SetFixedRotation(true);
    this.canJump = false;
    this.recentlyJumped = false;
}

Player.prototype.move = function() {
    var vel = this.physicsObject.m_body.GetLinearVelocity().y;
    PhysicsManager.setObjectVelocity(this.physicsObject, new PhysicsManager.b2Vec2(this.xSpeed, vel));
}

Player.prototype.moveLeft = function() {
    this.xSpeed = -5;
}

Player.prototype.moveRight = function() {
    this.xSpeed = 5;
}

Player.prototype.stopMovement = function() {
    this.xSpeed = 0;
}

Player.prototype.downwardRaycast = function() {
    var self = this;

    //var worldPoint = this.physicsObject.m_body.GetWorldPoint(new PhysicsManager.b2Vec2(0,1));

    //make the ray at least as long as the target distance
    var startOfRay = this.physicsObject.m_body.GetPosition();//new PhysicsManager.b2Vec2(this.physicsObject.m_body.GetPosition());
    var worldPoint = startOfRay.Copy();
        worldPoint.Add(new PhysicsManager.b2Vec2(0,1));
    var endOfRay = worldPoint; //new PhysicsManager.b2Vec2(worldPoint);

    // console.log(startOfRay);
    // console.log(endOfRay);

    var callb = function(fixture, point, normal, fraction) {
// you can, for instance, check if fixture belongs to the ground
// or something else, then handle things accordingly
        console.log(fraction);
        if(fraction < 1) {
            self.canJump = true;
            self.jumpBypass();
        }
    }

    PhysicsManager.world.RayCast(callb, startOfRay, endOfRay);
}

Player.prototype.jump = function() {
    var self = this;
    this.downwardRaycast();
}

Player.prototype.jumpBypass = function() {
    // console.log("Attempt!");
    if(this.canJump && !this.recentlyJumped) {
        PhysicsManager.applyImpulseOnObject(this.physicsObject, new PhysicsManager.b2Vec2(0, -10));
        this.canJump = false;
        this.recentlyJumped = true;

        var self = this;
        setTimeout(function() {
            self.recentlyJumped = false;
        }, 200);
    }
}

var init = function() {
    var start = null;
    var canvas = document.getElementById("canvas");
    var canvasContext = canvas.getContext("2d");

    function step(timestamp) {
        canvasContext.clearRect(0, 0, canvas.width, canvas.height);
        try {
            player.move();
            PhysicsManager.step(timestamp - start);
        }
        catch(err) {
            console.log(err.message);
        }
        start = timestamp;
        window.requestAnimationFrame(step);
    }

    PhysicsManager.init({context: canvasContext, isDebug: true, canvas: canvas});

    player = new Player();

    keyManager = KeyManager.init(player);

    window.requestAnimationFrame(step);
}
