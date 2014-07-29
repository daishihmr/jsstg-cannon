tm.define("cannon.Shot", {
    superClass: "tm.display.Sprite",

    init: function() {
        this.superInit("shot");
        this.setScale(3.0);

        this.on("added", function() {
            cannon.playSe("shot");
            cannon.ShockWave(this.x, this.y)
                .setScale(2, 4)
                .on("enterframe", function(){ this.x -= 2 })
                .addChildTo(this.parent);
            cannon.Spark(this.x, this.y)
                .setRotation(Math.rand(0, 360))
                .setScale(2, 2)
                .addChildTo(this.parent);
        });
    },

    update: function() {
        this.x += cannon.SHOT_SPEED;
    }
});
