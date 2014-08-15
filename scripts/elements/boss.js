tm.define("cannon.Boss", {
    superClass: "tm.display.CanvasElement",

    init: function() {
        this.superInit();

        this.parts = [];

        this.on("added", function() {
            var that = this;
            this.parts.forEach(function(part) {
                part.parentPart = that;
                part.addChildTo(that.parent);
            });
        });

        this.muteki = false;
    },

    setCore: function(core) {
        this.core = core;
        this.core.on("destroy", function() {
        });
    },
});

cannon.Boss.prototype.accessor("muteki", {
    get: function(){ return this._muteki },
    set: function(v) {
        this.parts.forEach(function(part){ part.muteki = (v ? 9999 : 0) });
        this._muteki = v;
    }
})

tm.define("cannon.BossPart", {
    superClass: "cannon.Enemy",

    init: function(data) {
        this.superInit();

        this.fromJSON({
            boundingType: "circle",
            radius: data.radius,
            score: data.score,
            hp: data.hp,
            expType: data.expType,
            offsetX: data.x,
            offsetY: data.y,
            scaleX: data.scaleX,
            scaleY: data.scaleY,
            delay: data.delay,
            parentHistory: [],
            basicFrameIndex: 0,
            children: {
                body: {
                    type: "tm.display.Sprite",
                    init: [data.texture, data.size * 2, data.size * 2],
                    frameIndex: 0,
                }
            }
        });

        var that = this;

        this.body.on("enterframe", function(e) {
            this.setFrameIndex(that.muteki > 0 ? e.app.frame % 2 : that.basicFrameIndex);
        });

        this.on("dying", function() {
            this.basicFrameIndex = 2;
            this.body.setFrameIndex(this.basicFrameIndex);
        });

        this.on("added", function() {
            this.setPosition(this.parentPart.x + this.offsetX, this.parentPart.y + this.offsetY);
            for (var i = 0; i < this.delay; i++) {
                this.parentHistory.push(this.parentPart.getFinalMatrix());
            }
        });

        this.on("enterframe", function() {
            this.parentHistory.push(this.parentPart.getFinalMatrix());
            var m = this.parentHistory.shift();
            var p = m.multiplyVector2({x:this.offsetX, y:this.offsetY});
            this.x = p.x;
            this.y = p.y;
            this.rotation = Math.atan2(m.m10, m.m00) * Math.RAD_TO_DEG;
        });
    },

    destroy: function() {
        switch (this.expType) {
        case 0:
            cannon.Explode(this.x, this.y).addChildTo(this.parent);
            break;
        case 1:
            cannon.LargeExplode(this.x, this.y).addChildTo(this.parent);
            break;
        }
        this.remove();
        var ev = tm.event.Event("destroyPart");
        ev.part = this;
        this.parentPart.fire(ev);
    },
});

tm.define("cannon.Boss1", {
    superClass: "cannon.Boss",

    init: function() {
        this.superInit();
        this.fromJSON({
            x: cannon.SC_W * 1.2,
            y: cannon.SC_H * 0.5,
            rotation: 180,
            parts: cannon.BOSS1_DATA.parts.map(function(part){ return cannon.BossPart(part) }),
        });

        this.phase1 = [
            this.motion1,
            this.motion2,
            this.motion2,
            this.motion3,
        ];
        this.phase2 = [
            this.motion4,
        ];

        this.motions = [
            this.motion0,
        ];

        this.next();

        var that = this;
        this.parts[4].on("destroy", function() {
            that.flare("destroy");
        });
        this.on("destroyPart", function(ev) {
            this.motionDamage(ev.part);
        });
    },

    next: function() {
        if (this.motions.length === 0) {
            if (this.parts[0].parent == null && this.parts[2].parent == null) {
                this.phase1.eraseAll(this.motion1);
                this.phase1.eraseAll(this.motion3);
            }
            if (this.parts[1].parent == null && this.parts[3].parent == null) {
                this.phase1.eraseAll(this.motion2);
            }

            if (this.phase1.length === 0) {
                this.phase1 = this.phase2;
            }
            Array.prototype.push.apply(this.motions, this.phase1);
        }
        this.motions.shift().call(this);
    },

    attack0: function() {
        var that = this;
        var scene = this.getRoot();
        [0, 2].forEach(function(i) {
            var part = that.parts[i];
            if (part.hp > 0) {
                [{x:20,y:-20,d:0}, {x:20,y:10,d:10}, {x:20,y:40,d:20}].forEach(function(gun) {
                    var gunPos = part.localToGlobal(gun);
                    cannon.DirectionalBullet({
                        x: gunPos.x,
                        y: gunPos.y,
                        direction: part.rotation + gun.d * (part.scaleY > 0 ? 1 : -1),
                        speed: 2,
                    }).addChildTo(scene.bulletLayer);
                });
            }
        });
    },

    attack1: function() {
        var that = this;
        var scene = this.getRoot();
        [1, 3].forEach(function(i) {
            var part = that.parts[i];
            if (part.hp > 0) {
                var gunPos = part.localToGlobal({x:0,y:0});
                cannon.AimBullet({
                    color: 2,
                    target: scene.player,
                    x: gunPos.x,
                    y: gunPos.y,
                    direction: 0,
                    speed: 2,
                }).addChildTo(scene.bulletLayer);
                cannon.AimBullet({
                    color: 2,
                    target: scene.player,
                    x: gunPos.x,
                    y: gunPos.y,
                    direction: -30,
                    speed: 2,
                }).addChildTo(scene.bulletLayer);
                cannon.AimBullet({
                    color: 2,
                    target: scene.player,
                    x: gunPos.x,
                    y: gunPos.y,
                    direction: +30,
                    speed: 2,
                }).addChildTo(scene.bulletLayer);
            }
        });
    },

    motionDamage: function(part) {
        this.muteki = true;

        if (this.parts[0].parent == null && this.parts[2].parent == null) {
            this.motions.eraseAll(this.motion1);
            this.motions.eraseAll(this.motion3);
        }
        if (this.parts[1].parent == null && this.parts[3].parent == null) {
            this.motions.eraseAll(this.motion2);
        }

        var rot = this.rotation + (part.offsetY < 0 ? -30 : 30);
        this.tweener.clear()
            .to({
                x: Math.clamp(this.x + 100, cannon.SC_W * 0.05, cannon.SC_W * 0.95),
                rotation: rot
            }, 800, "easeOutBack")
            .call(function() {
                this.muteki = false;
                this.next();
            }.bind(this));
    },

    motion0: function() {
        this.muteki = true;
        this.tweener.clear()
            .to({
                x: cannon.SC_W * 0.75,
                y: cannon.SC_H * 0.5,
            }, 2500, "easeInOutBack")
            .call(function() {
                this.muteki = false;
                this.next();
            }.bind(this));
    },

    motion1: function() {
        this.tweener.clear()
            .to({
                x: cannon.SC_W * 0.70,
                y: cannon.SC_H * 0.3,
                rotation: 180 + -20,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .to({
                x: cannon.SC_W * 0.70,
                y: cannon.SC_H * 0.7,
                rotation: 180 + +20,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)

            .to({
                x: cannon.SC_W * 0.75,
                y: cannon.SC_H * 0.35,
                rotation: 180 + -10,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .to({
                x: cannon.SC_W * 0.75,
                y: cannon.SC_H * 0.65,
                rotation: 180 + +10,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)

            .call(function(){ this.next() }.bind(this));
    },

    motion2: function() {
        this.tweener.clear()
            .to({
                x: cannon.SC_W * 0.90,
                y: cannon.SC_H * 0.5,
                rotation: 180,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack1() }.bind(this)).wait(100)
            .call(function(){ this.attack1() }.bind(this)).wait(100)
            .call(function(){ this.attack1() }.bind(this)).wait(100)

            .to({
                x: cannon.SC_W * 0.80,
                y: cannon.SC_H * 0.25,
                rotation: 180 + -30,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack1() }.bind(this)).wait(100)
            .call(function(){ this.attack1() }.bind(this)).wait(100)
            .call(function(){ this.attack1() }.bind(this)).wait(100)

            .to({
                x: cannon.SC_W * 0.80,
                y: cannon.SC_H * 0.75,
                rotation: 180 + +30,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack1() }.bind(this)).wait(100)
            .call(function(){ this.attack1() }.bind(this)).wait(100)
            .call(function(){ this.attack1() }.bind(this)).wait(100)

            .call(function(){ this.next() }.bind(this));
    },

    motion3: function() {
        this.tweener.clear()
            .to({
                x: cannon.SC_W * 0.65,
                y: cannon.SC_H * 0.2,
                rotation: 180 + -30,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .to({
                x: cannon.SC_W * 0.65,
                y: cannon.SC_H * 0.8,
                rotation: 180 + +30,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)

            .to({
                x: cannon.SC_W * 0.80,
                y: cannon.SC_H * 0.4,
                rotation: 180 + -5,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .to({
                x: cannon.SC_W * 0.80,
                y: cannon.SC_H * 0.6,
                rotation: 180 + +5,
            }, 1600, "easeInOutBack")
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)
            .call(function(){ this.attack0() }.bind(this)).wait(300)

            .call(function(){ this.next() }.bind(this));
    },

    motion4: function() {
        this.tweener.clear()
            .by({
                rotation: 360,
            }, 1600, "easeInOutBack")

            .call(function(){ this.next() }.bind(this));
    },
});
