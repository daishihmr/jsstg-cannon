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

        this.on("removed", function() {
            this.parts.forEach(function(part){ part.parent && part.remove() });
        });
    },

    setCore: function(core) {
        var that = this;
        this.core = core;
        this.core.on("destroy", function() {
            that.flare("destroy");
            this.damage = function(){};
        });
        this.core.destroy = function(){};
    },
});

cannon.Boss.prototype.accessor("muteki", {
    get: function(){ return this._muteki },
    set: function(v) {
        this.parts.forEach(function(part){ part.muteki = (v ? 9999 : 0) });
        this._muteki = v;
    }
});

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

    destroy: function(byDamage) {
        switch (this.expType) {
        case 0:
            cannon.Explode(this.x, this.y).addChildTo(this.parent);
            break;
        case 1:
            cannon.LargeExplode(this.x, this.y).addChildTo(this.parent);
            break;
        }
        this.remove();

        if (byDamage) {
            var ev = tm.event.Event("destroyPart");
            ev.part = this;
            this.parentPart.fire(ev);
        }
    },
});

tm.define("cannon.Boss1", {
    superClass: "cannon.Boss",

    init: function() {
        this.superInit();
        this.fromJSON({
            x: cannon.SC_W * 1.2,
            y: cannon.SC_H * 0.5,
            rotation: -180,
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
            this.motion5,
            this.motion6,
        ];
        this.currentPhase = this.phase1;

        this.motions = [
            this.motion0,
        ];

        this.next();

        var that = this;
        this.setCore(this.parts[4]);

        this.on("destroyPart", function(ev) {
            this.motionDamage(ev.part);
        });

        this.on("destroy", function() {
            this.fireOff();
            this.tweener.clear();
            var core = this.core;
            this.parts.forEach(function(part) {
                if (part !== core && part.parent) part.destroy(false);
            });
        });
    },

    next: function() {
        if (this.motions.length === 0) {
            Array.prototype.push.apply(this.motions, this.currentPhase);
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
                    speed: 2.5,
                }).addChildTo(scene.bulletLayer);
                cannon.AimBullet({
                    color: 2,
                    target: scene.player,
                    x: gunPos.x,
                    y: gunPos.y,
                    direction: -10,
                    speed: 2.5,
                }).addChildTo(scene.bulletLayer);
                cannon.AimBullet({
                    color: 2,
                    target: scene.player,
                    x: gunPos.x,
                    y: gunPos.y,
                    direction: +10,
                    speed: 2.5,
                }).addChildTo(scene.bulletLayer);
            }
        });
    },

    attack2: function() {
        var that = this;
        var scene = this.getRoot();
        for (var i = 0; i < 360; i += 10) {
            cannon.AimBullet({
                color: 2,
                target: scene.player,
                x: this.x,
                y: this.y,
                direction: i,
                speed: 2.5,
            }).addChildTo(scene.bulletLayer);
        }
    },

    fireOn: function() {
        var scene = this.getRoot();
        this.autoFire = this.autoFire || function(e) {
            if (e.app.frame % 5 === 0) {
                cannon.DirectionalBullet({
                    x: this.x,
                    y: this.y,
                    direction: this.rotation - 5,
                    speed: 2,
                }).addChildTo(scene.bulletLayer);
                cannon.DirectionalBullet({
                    x: this.x,
                    y: this.y,
                    direction: this.rotation,
                    speed: 2,
                }).addChildTo(scene.bulletLayer);
                cannon.DirectionalBullet({
                    x: this.x,
                    y: this.y,
                    direction: this.rotation + 5,
                    speed: 2,
                }).addChildTo(scene.bulletLayer);
            }
        };
        this.on("enterframe", this.autoFire);
    },
    fireOff: function() {
        this.off("enterframe", this.autoFire);
    },

    motionDamage: function(part) {
        if (this.parts[0].parent == null && this.parts[2].parent == null) {
            this.motions.eraseAll(this.motion1);
            this.motions.eraseAll(this.motion3);
            this.phase1.eraseAll(this.motion1);
            this.phase1.eraseAll(this.motion3);
        }
        if (this.parts[1].parent == null && this.parts[3].parent == null) {
            this.motions.eraseAll(this.motion2);
            this.phase1.eraseAll(this.motion2);
        }

        if (this.core.parent == null) {
            return;
        } else if (this.parts[0].parent == null && this.parts[1].parent == null && this.parts[2].parent == null && this.parts[3].parent == null) {
            this.currentPhase = this.phase2;
            this.motions.push(this.motion0);
        }

        var rot = this.rotation + (part.offsetY < 0 ? -30 : 30);
        this.tweener.clear()
            .to({
                x: Math.clamp(this.x + 100, cannon.SC_W * 0.05, cannon.SC_W * 0.95),
                rotation: rot
            }, 500, "easeOutQuad")
            .call(function(){ this.muteki = true }.bind(this))
            .wait(500)
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
                rotation: 180,
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
        this.fireOn();
        this.tweener.clear()
            .by({
                rotation: 720,
            }, 3000, "easeInOutBack")
            .call(function(){ this.fireOff() }.bind(this))
            .call(function(){ this.next() }.bind(this));
    },

    motion5: function() {
        this.tweener.clear()
            .wait(30)
            .call(function(){ this.attack2() }.bind(this))
            .wait(30)
            .call(function(){ this.attack2() }.bind(this))
            .wait(30)
            .call(function(){ this.attack2() }.bind(this))
            .call(function(){ this.next() }.bind(this));
    },

    motion6: function() {
        this.fireOn();
        this.tweener.clear()
            .by({
                rotation: -720,
            }, 3000, "easeInOutBack")
            .call(function(){ this.fireOff() }.bind(this))
            .call(function(){ this.next() }.bind(this));
    },
});
