tm.define("cannon.Fighter", {
    superClass: "tm.display.CanvasElement",

    scene: null,
    controllable: false,
    muteki: false,

    direction: 1,

    init: function() {
        this.superInit();
        this.fromJSON({
            children: {
                backfire2: {
                    type: "tm.display.Sprite",
                    init: "backfire",
                    originX: 1.0,
                    blendMode: "lighter",
                },
                backfire: {
                    type: "tm.display.Sprite",
                    init: ["aura", 80, 120],
                    frameIndex: 0,
                    x: -50,
                    y: 0,
                    blendMode: "lighter",
                },
                body: {
                    type: "tm.display.Sprite",
                    init: ["fighter", 128, 64],
                    frameIndex: 2,
                    scaleX: 0.75, scaleY: 0.75,
                },
            },
        });

        this.setBoundingType("circle");
        this.radius = cannon.FIGHTER_RADIUS;

        this.beforeX = this.x = cannon.SC_W * -0.5;
        this.beforeY = this.y = cannon.SC_H * 0.5;

        this.roll = 0;
        this.heat = 0;

        this.gunPosition = 0;

        this.backfire.update = function(app) {
            if (this.visible) {
                this.setFrameIndex(app.frame % 4);
                this.scaleX = [0.8, 1.0, 1.2, 1.0][app.frame % 4];
            }
        };
        this.backfire2.update = function(app) {
            if (this.visible) {
                this.scaleX = [0.8, 1.0, 1.2, 1.0][app.frame % 4];
            }
        };
    },

    update: function(app) {
        this.scaleX = this.direction;

        this.alpha = this.muteki ? ((app.frame % 4) * 0.25 + 0.25) : 1.0;

        if (this.controllable) {
            var kb = app.keyboard;
            var keyDirection = kb.getKeyDirection();

            this.position.add(keyDirection.mul(cannon.FIGHTER_SPEED));
            this.x = Math.clamp(this.x, 32, cannon.SC_W - 32);
            this.y = Math.clamp(this.y, 16, cannon.SC_H - 16);

            if (keyDirection.y < 0) {
                this.roll -= 0.1;
            } else if (0 < keyDirection.y) {
                this.roll += 0.1;
            } else {
                this.roll *= 0.9;
                if (-0.01 < this.roll && this.roll < 0.01) {
                    this.roll = 0.0;
                }
            }

            var pushZ = kb.getKeyDown("z");
            var pushX = kb.getKeyDown("x");

            if (pushZ || pushX) {
                this.direction = pushX ? 1 : -1;
                if (this.heat <= 0) {
                    cannon.Shot(this.direction)
                        .setPosition(this.x + 60 * this.direction, this.y + 7)
                        .addChildTo(this.parent);
                    this.heat = cannon.HEAT_BY_SHOT;
                    this.gunPosition = 2;
                }

                if (this.scaleX !== this.direction) {
                    cannon.Boost(this.x, this.y)
                        .setPosition(-100, 0)
                        .setScale(2, 2)
                        .addChildTo(this);
                }
            }

            if (this.heat > 0) {
                this.heat -= 1;
                this.gunPosition = Math.max(this.gunPosition - 0.2, 0);
                if (this.heat <= 0) cannon.playSe("reload");
            }
        } else {
            this.roll *= 0.9;
            if (-0.01 < this.roll && this.roll < 0.01) {
                this.roll = 0.0;
            }
        }

        this.roll = Math.clamp(this.roll, -2.0, 2.0);
        this.body.setFrameIndex(~~(2 + this.roll + 0.5) * 3 + ~~(this.gunPosition + 0.5));
    },

    boostOn: function() {
        this.backfire.alpha = this.backfire2.alpha = 1.0;
        this.backfire.visible = this.backfire2.visible = true;
    },

    boostOff: function() {
        this.backfire.tweener.clear().fadeOut(300);
        this.backfire2.tweener.clear().fadeOut(300).call(function() {
            this.backfire.visible = this.backfire2.visible = false;
        }.bind(this));
    },

    damage: function() {
        if (this.controllable && !this.muteki) {
            cannon.PlayerExplode(this.x, this.y).addChildTo(this.parent);
            this.remove();
            this.flare("killed");
        }
    },
});
