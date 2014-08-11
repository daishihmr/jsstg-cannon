tm.define("cannon.Enemy", {
    superClass: "tm.display.Sprite",

    /** 素点 */
    score: 0,
    /** 耐久力 */
    hp: 0,
    /** 無敵フラグ */
    muteki: 0,
    /** 出現後画面内に入ったか */
    entered: false,
    /** 爆発タイプ */
    expType: 0,
    /** 出現後経過フレーム */
    age: 0,
    /** 地形と衝突あり */
    hasTerrainCollider: false,
    /** 地形のスクロールと位置が同期する */
    isGround: false,

    init: function(data) {
        this.superInit(data.texture, data.size * 2, data.size * 2);
        this.fromJSON({
            frameIndex: 0,
            boundingType: "circle",
            blendMode: "lighter",
            radius: data.size * 0.5,
            score: data.score,
            hp: data.hp,
            expType: data.expType,
            hasTerrainCollider: data.hasTerrainCollider,
            isGround: data.isGround,
            size: data.size,
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
        }

        this.on("added", function() {
            cannon.Enemy.ACTIVES.push(this);
            this.entered = false;
            this.age = 0;
        });
        this.on("removed", function() {
            cannon.Enemy.ACTIVES.erase(this);
        });

        // this.on("hitterrain", function() {
        //     this.damage(100);
        // });
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
    },

    startAttack: function(root, config) {
        config = (config || {}).$safe(bulletml.runner.DEFAULT_CONFIG);

        var runner = root.createRunner(config);
        runner.x = this.x;
        runner.y = this.y;
        var enterframeListener = function() {
            runner.x = this.x;
            runner.y = this.y;
            runner.update();
            this.setPosition(runner.x, runner.y);
        };
        enterframeListener.isDanmaku = true;
        this.on("enterframe", enterframeListener);
    },
    stopAttack: function() {
        if (this.hasEventListener("enterframe")) {
            var copied = this._listeners["enterframe"].clone();
            for (var i = 0; i < copied.length; i++) {
                if (copied[i].isDanmaku) {
                    this.off("enterframe", copied[i]);
                }
            }
        }
    }

});

cannon.Enemy.ACTIVES = [];
