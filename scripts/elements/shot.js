tm.define("cannon.Shot", {
    superClass: "tm.display.Sprite",

    direction: 1,
    killCount: 0,

    init: function(direction) {
        this.superInit("shot");
        this.direction = direction;
        this.setScale(5.0 * this.direction, 5.0);

        this.boundingType = "circle";
        this.radius = cannon.SHOT_RADIUS;
        this.vsTerrainRadius = cannon.SHOT_RADIUS * 0.25;

        var that = this;

        this.on("added", function() {
            cannon.playSe("shot");
            cannon.ShockWave(this.x, this.y)
                .setScale(1 * this.direction, 4)
                .on("enterframe", function(){ this.x += 2 * -that.direction })
                .addChildTo(this.parent);
            cannon.Spark(this.x, this.y)
                .setRotation(Math.rand(0, 360))
                .setScale(2 * this.direction, 2)
                .addChildTo(this.parent);
            cannon.Spark2(this.x, this.y, 3)
                .setScale(2 * this.direction, 1)
                .addChildTo(this.parent);
        });

        this.on("added", function() {
            cannon.Shot.ACTIVES.push(this);
        });
        this.on("removed", function() {
            cannon.Shot.ACTIVES.erase(this);
        });
    },

    update: function(app) {
        this.scaleY = 5.0 + app.frame % 2;
        this.x += cannon.SHOT_SPEED * this.direction;

        if (this.x < 0 - this.radius || cannon.SC_W + this.radius < this.x) {
            this.remove();
        }
    },

    killEnemy: function(enemy, addTarget) {
        if (this.killCount > 0) {
            cannon.ScoreRate(Math.min(this.killCount - 1, 4), enemy.x, enemy.y).addChildTo(addTarget);
        }
        this.killCount += 1;
    },

    damage: function() {
        cannon.ShockWave(this.x, this.y)
            .setScale(1 * this.direction, 4)
            .addChildTo(this.parent);
        cannon.ShockWave(this.x, this.y)
            .setScale(0.75 * this.direction, 3)
            .addChildTo(this.parent);
        cannon.Spark2(this.x, this.y)
            .setScale(3 * this.direction, 3)
            .addChildTo(this.parent);
        this.remove();
    },
});

cannon.Shot.ACTIVES = [];
