var Player = function() {
    this.physicsObject = PhysicsManager.createBox(10, 10, 1, 1, {friction: 0});
    this.physicsObject.m_body.SetFixedRotation(true);
    this.canJump = false;
    this.recentlyJumped = false;
}

Player.prototype.updatePosition = function(g) {
    g.setPosition(this.physicsObject.m_body.GetWorldCenter());
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

    var startOfRay = this.physicsObject.m_body.GetPosition();
    var worldPoint = startOfRay.Copy();
        worldPoint.Add(new PhysicsManager.b2Vec2(0,1));
    var endOfRay = worldPoint;

    var callb = function(fixture, point, normal, fraction) {
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