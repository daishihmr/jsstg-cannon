tm.define("cannon.Zako", {
    superClass: "cannon.Enemy",

    /** 爆発タイプ */
    expType: 0,
    /** 地形と衝突あり */
    hasTerrainCollider: false,
    /** 地形のスクロールと位置が同期する */
    isGround: false,

    init: function(data) {
        this.superInit();
        this.fromJSON({
            boundingType: "circle",
            radius: data.size * 0.2,
            score: data.score,
            hp: data.hp,
            expType: data.expType,
            size: data.size,
            basicFrameIndex: 0,
            children: {
                body: {
                    type: "tm.display.Sprite",
                    init: [data.texture, data.size * 2, data.size * 2],
                    frameIndex: 0,
                }
            },
        });

        var that = this;
        this.body.on("enterframe", function(e) {
            this.setFrameIndex(that.muteki > 0 ? e.app.frame % 2 : that.basicFrameIndex);
        });

        if (data.rotation === "rot") {
            this.on("enterframe", function() {
                this.rotation += 6;
            });
        } else if (data.rotation === "dir") {
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
            this.originY = 0.33;
        }

        this.on("dying", function() {
            this.basicFrameIndex = 2;
            this.body.setFrameIndex(this.basicFrameIndex);
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
    },

    setRoute: function(data) {
        this.setPosition(data[0].x, data[0].y);
        var tweener = this.tweener.clear();
        for (var i = 0, len = data.length; i < len; i++) {
            tweener.to(data[i], 100);
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
        if (data.vx < 0) {
            this.scaleX = -1;
        } else {
            this.scaleX = 1;
        }
        this.on("enterframe", function() {
            this.x += data.vx;
        });
    },

    setHomingMotion: function(data, player) {
        this.setPosition(data.x, data.y);
        this.velocity = tm.geom.Vector2().setAngle(data.initialDirection, 1);
        this.on("enterframe", function() {
            if (this.age < 500 && this.age % 100 < 20 && this.age % 2 === 0) {
                this.velocity
                    .add(tm.geom.Vector2(player.x - this.x, player.y - this.y).mul(data.homing))
                    .normalize();
            }
            this.position.add(tm.geom.Vector2.mul(this.velocity, data.speed));
        });
    },

    setRunMotion: function(data) {
        this.setPosition(data.x, data.y);
        if (data.vx < 0) {
            this.scaleX = -1;
        } else {
            this.scaleX = 1;
        }
        this.hasTerrainCollider = true;
        this.isGround = true;
        this.on("hitterrain", function(e) {
            var c = {
                x: this.x + e.terrain.scroll,
                y: this.y,
                radius: this.radius,
            };
            var line = e.line;
            while (cannon.CollisionHelper.isHitCircleLine(c, line)) {
                c.y -= data.g * 0.1;
                this.y -= data.g * 0.1;
            }
        });
        this.on("enterframe", function() {
            this.x += data.vx;
            this.y += data.g;
        });
    },

    setJumpMotion: function(data) {
        this.setPosition(data.x, data.y);
        if (data.vx < 0) {
            this.scaleX = -1;
        } else {
            this.scaleX = 1;
        }
        this.hasTerrainCollider = true;
        this.isGround = true;
        this.on("hitterrain", function(e) {
            var c = {
                x: this.x + e.terrain.scroll,
                y: this.y,
                radius: this.radius,
            };
            var line = e.line;
            while (cannon.CollisionHelper.isHitCircleLine(c, line)) {
                c.y -= data.g * 0.1;
                this.y -= data.g * 0.1;
                vy = data.vy;
            }
        });

        var vy = data.g;
        this.on("enterframe", function() {
            this.x += data.vx;
            this.y += vy;
            vy += data.g;
        });
    },
});
