tm.define("cannon.Bullet", {
    superClass: "tm.display.Sprite",

    init: function(runner, spec) {
        this.superInit("bullet", 16, 16);
        this.setScale(2.0, 0.5);
        this.setFrameIndex(spec.color || 0);

        this.setBoundingType("circle");
        this.radius = 8;

        this.runner = runner;

        this.setPosition(this.runner.x, this.runner.y);
        this.runner.onVanish = function() {
            if (this.parent) this.remove();
        }.bind(this);

        var bx = 0;
        var by = 0;
        this.on("enterframe", function() {
            this.rotation = Math.atan2(this.y - by, this.x - bx) * Math.RAD_TO_DEG;
            bx = this.x;
            by = this.y;
        });

        this.on("added", function() {
            cannon.Bullet.ACTIVES.push(this);
        });
        this.on("removed", function() {
            cannon.Bullet.ACTIVES.erase(this);
        });
    },

    update: function() {
        this.runner.update();
        this.setPosition(this.runner.x, this.runner.y);
        if (this.x + this.radius < 0 || cannon.SC_W <= this.x - this.radius || this.y + this.radius < 0 || cannon.SC_H <= this.y - this.radius) {
            this.remove();
        }
    },

    damage: function() {
        this.remove();
    }

});

cannon.Bullet.ACTIVES = [];

cannon.Bullet.eraseAll = function() {
};
