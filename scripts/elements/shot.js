tm.define("cannon.Shot", {
    superClass: "tm.display.Sprite",

    init: function() {
        this.superInit("shot");
        this.setScale(5.0);

        this.boundingType = "circle";
        this.radius = 30;

        this.on("added", function() {
            cannon.playSe("shot");
            cannon.ShockWave(this.x, this.y)
                .setScale(1, 4)
                .on("enterframe", function(){ this.x -= 2 })
                .addChildTo(this.parent);
            cannon.Spark(this.x, this.y)
                .setRotation(Math.rand(0, 360))
                .setScale(2, 2)
                .addChildTo(this.parent);
            cannon.Spark2(this.x, this.y, 3)
                .setScale(2, 1)
                .addChildTo(this.parent);
        });

        cannon.Shot.ACTIVES.push(this);
        this.on("removed", function() {
            cannon.Shot.ACTIVES.erase(this);
        });
    },

    update: function(app) {
        this.scaleY = 5.0 + app.frame % 2;
        this.x += cannon.SHOT_SPEED;

        if (cannon.SC_W + this.radius < this.x) {
            this.remove();
        }
    },

    damage: function() {
        cannon.ShockWave(this.x, this.y)
            .setScale(1, 4)
            .addChildTo(this.parent);
        cannon.Spark2(this.x, this.y)
            .setScale(3, 3)
            .addChildTo(this.parent);
        this.remove();
    },
});

cannon.Shot.ACTIVES = [];
