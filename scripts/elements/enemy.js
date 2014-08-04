tm.define("cannon.Enemy", {
    superClass: "tm.display.Sprite",

    init: function(texture) {
        this.superInit(texture);
        this
            .setBoundingType("circle")
            .setBlendMode("lighter");
        this.radius = this.width * 0.1;

        this.hp = 5;

        cannon.Enemy.ACTIVES.push(this);
    },

    damage: function() {
        this.hp -= 2;
        if (this.hp <= 0) {
            this.remove();
            cannon.Enemy.ACTIVES.erase(this);
            return true;
        }
        return false;
    }

});

cannon.Enemy.ACTIVES = [];

Array.range(0, 14 + 1).forEach(function(index) {

    tm.define("cannon.Enemy{0}".format(index), {
        superClass: "cannon.Enemy",

        init: function() {
            this.superInit("enemy{0}".format(index));
        },

        update: function() {
            this.x -= 2;
        }
    });

});
