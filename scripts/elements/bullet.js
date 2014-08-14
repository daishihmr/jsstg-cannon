tm.define("cannon.Bullet", {
    superClass: "tm.display.Sprite",

    init: function(color) {
        this.superInit("bullet", 16, 16);
        this.fromJSON({
            scaleX: 2.0,
            scaleY: 0.5,
            frameIndex: color || 0,
            boundingType: "circle",
            radius: 8,
        });

        this.on("added", function() {
            cannon.Bullet.ACTIVES.push(this);
        });
        this.on("removed", function() {
            cannon.Bullet.ACTIVES.erase(this);
        });
    },

    update: function() {
        if (this.x + this.radius < 0 || cannon.SC_W <= this.x - this.radius || this.y + this.radius < 0 || cannon.SC_H <= this.y - this.radius) {
            this.remove();
        }
    },

    damage: function() {
        this.remove();
    }
});

tm.define("cannon.AimBullet", {
    superClass: "cannon.Bullet",

    init: function(spec) {
        this.superInit(spec.color);
        this.fromJSON({
            x: spec.x,
            y: spec.y,
        });

        var rank = bulletml.Walker.globalScope["$rank"];
        var speed = spec.speed * 3 * (1 + Math.sqrt(rank) * 2);
        var velocity = tm.geom.Vector2.sub(spec.target, spec)
        velocity.setAngle(velocity.toAngle() * Math.RAD_TO_DEG + (spec.direction || 0));
        velocity.normalize().mul(speed);
        this.on("enterframe", function() {
            this.position.add(velocity);
        });

        this.rotation = velocity.toAngle() * Math.RAD_TO_DEG;
    }
});

tm.define("cannon.DirectionalBullet", {
    superClass: "cannon.Bullet",

    init: function(spec) {
        this.superInit(spec.color);
        this.fromJSON({
            x: spec.x,
            y: spec.y,
            rotation: spec.direction,
        });

        var rank = bulletml.Walker.globalScope["$rank"];
        var speed = spec.speed * 3 * (1 + Math.sqrt(rank) * 2);
        var velocity = tm.geom.Vector2().setAngle(spec.direction).mul(speed);
        this.on("enterframe", function() {
            this.position.add(velocity);
        });
    }
});

tm.define("cannon.BulletMLBullet", {
    superClass: "cannon.Bullet",

    init: function(runner, spec) {
        this.superInit(spec.color);
        this.fromJSON({
            x: runner.x,
            y: runner.y,
        });

        runner.onVanish = function() {
            if (this.parent) this.remove();
        }.bind(this);

        var bx = 0;
        var by = 0;
        this.on("enterframe", function() {
            runner.update();
            this.setPosition(runner.x, runner.y);

            this.rotation = Math.atan2(this.y - by, this.x - bx) * Math.RAD_TO_DEG;
            bx = this.x;
            by = this.y;
        });
    }
});

cannon.Bullet.ACTIVES = [];

cannon.Bullet.eraseAll = function() {
    var bullets = cannon.Bullet.ACTIVES.clone();
    for (var i = 0, len = bullets.length; i < len; i++) {
        bullets[i].remove();
    }
};
