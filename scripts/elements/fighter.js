tm.define("cannon.Fighter", {
    superClass: "tm.display.CanvasElement",

    scene: null,

    init: function() {
        this.superInit();
        this.fromJSON({
            children: {
                aura: {
                    type: "tm.display.Sprite",
                    init: ["aura", 80, 120],
                    frameIndex: 0,
                    x: -50,
                    y: 5,
                    scaleY: 0.75,
                },
                body: {
                    type: "tm.display.Sprite",
                    init: ["fighter", 128, 64],
                    frameIndex: 2,
                },
            },
        });

        this.setBoundingType("circle");
        this.radius = cannon.FIGHTER_RADIUS;

        this.beforeX = this.x = cannon.SC_W * 0.5;
        this.beforeY = this.y = cannon.SC_H * 0.5;

        this.roll = 0;
        this.heat = 0;

        this.aura.update = function(app) {
            this.setFrameIndex(app.frame % 4);
            this.scaleX = [0.8, 1.0, 1.2, 1.0][app.frame % 4];
        };
    },

    update: function(app) {
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
        this.roll = Math.clamp(this.roll, -2.0, 2.0);

        this.body.setFrameIndex(~~(2 + this.roll + 0.5));

        if (kb.getKeyDown("z") && this.heat <= 0) {
            cannon.Shot()
                .setPosition(this.x + 50, this.y + 10)
                .addChildTo(this.parent);
            this.heat = cannon.HEAT_BY_SHOT;
        } else if (this.heat > 0) {
            this.heat -= 1;
        }
    },

    damage: function() {
        console.log("damage!");
    },
});
