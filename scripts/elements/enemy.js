tm.define("cannon.Enemy", {
    superClass: "tm.display.Sprite",

    muteki: 0,
    entered: false,

    init: function(texture, size) {
        this.superInit(texture, size * 2, size * 2);
        this
            .setFrameIndex(0)
            .setBoundingType("circle")
            .setBlendMode("lighter");
        this.size = size;
        this.radius = size * 0.2;

        this.hp = 5;

        cannon.Enemy.ACTIVES.push(this);
        this.on("removed", function() {
            cannon.Enemy.ACTIVES.erase(this);
        });

        this.on("added", function() {
            this.entered = false;
        });
    },

    update: function(app) {
        this.muteki = Math.max(0, this.muteki - 1);
        this.setFrameIndex(this.muteki > 0 ? app.frame % 2 : 0);

        if (this.inScreen()) {
            this.entered = true;
        }

        if (!this.inScreen() && this.entered) {
            this.remove();
        }
    },

    inScreen: function() {
        return 0 <= this.x + this.size && this.x - this.size < cannon.SC_W && 0 <= this.y + this.size && this.size - this.size < cannon.SC_H;
    },

    damage: function(damageValue) {
        if (this.muteki <= 0) {
            this.hp -= damageValue;
            this.muteki = 10;
            if (this.hp <= 0) {
                switch (this.expType) {
                case 0:
                    cannon.Explode(this.x, this.y).addChildTo(this.parent);
                    break;
                case 1:
                    cannon.LargeExplode(this.x, this.y).addChildTo(this.parent);
                    break;
                }
                this.remove();
                return true;
            }
        }
        return false;
    }

});

cannon.Enemy.ACTIVES = [];

cannon.ENEMY_DATA.forEach(function(data, index) {
    tm.define("cannon.Enemy{0}".format(index), {
        superClass: "cannon.Enemy",

        init: function() {
            this.superInit("enemy{0}".format(index), data.size);
            this.hp = data.hp;
            this.expType = data.expType;
            this.rot = data.rotation;
        },

        onenterframe: function() {
            this.x -= 2;
            if (this.rot) {
                this.rotation += 8;
            }
        }
    });
});
