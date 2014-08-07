tm.define("cannon.Enemy", {
    superClass: "tm.display.Sprite",

    muteki: 0,
    entered: false,

    init: function(data) {
        this.superInit(data.texture, data.size * 2, data.size * 2);
        this
            .setFrameIndex(0)
            .setBoundingType("circle")
            .setBlendMode("lighter");
        this.size = data.size;
        this.radius = data.size * 0.5;

        this.hp = data.hp;
        this.expType = data.expType;
        this.age = 0;

        if (data.rotation === "rotate") {
            this.on("enterframe", function() {
                this.rotation += 6;
            });
        } else if (data.rotation === "direction") {
            var bx = 0;
            var by = 0;
            this.on("enterframe", function() {
                this.rotation = Math.atan2(this.y - by, this.x - bx) * Math.RAD_TO_DEG;
                bx = this.x;
                by = this.y;
            });
        } else {
            this.rotation = 0;
            this.scaleX = -1;
        }

        cannon.Enemy.ACTIVES.push(this);
        this.on("removed", function() {
            cannon.Enemy.ACTIVES.erase(this);
            console.log("enemy removed");
        });

        this.on("added", function() {
            this.entered = false;
            this.age = 0;
        });
    },

    setRoute: function(route) {
        this.setPosition(route[0].x, route[0].y);
        var tweener = this.tweener.clear();
        for (var i = 0, len = route.length; i < len; i++) {
            tweener.to(route[i], 100);
        }
        return this;
    },

    setSineWaveMotion: function(data) {
        this.setPosition(data.x, data.y);
        var a = data.ia;
        this.on("enterframe", function() {
            a += data.va;
            this.x += data.vx;
            this.y = data.y + Math.sin(a) * data.r;
        });
    },

    setHorizontalMotion: function(data) {
        this.setPosition(data.x, data.y);
        this.on("enterframe", function() {
            this.x += data.vx;
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

        this.age += 1;
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
