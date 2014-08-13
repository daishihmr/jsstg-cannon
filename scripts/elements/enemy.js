tm.define("cannon.Enemy", {
    superClass: "tm.display.CanvasElement",

    /** 素点 */
    score: 0,
    /** 耐久力 */
    hp: 0,
    /** 無敵フラグ */
    muteki: 0,
    /** 出現後画面内に入ったか */
    entered: false,
    /** 出現後経過フレーム */
    age: 0,

    init: function() {
        this.superInit();

        this.on("added", function() {
            cannon.Enemy.ACTIVES.push(this);
            this.entered = false;
            this.age = 0;
        });
        this.on("removed", function() {
            cannon.Enemy.ACTIVES.erase(this);
        });
    },

    update: function(app) {
        if (this.inScreen()) {
            this.entered = true;
        }

        if (!this.inScreen() && this.entered) {
            this.remove();
        }

        this.muteki = Math.max(0, this.muteki - 1);

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
                this.flare("destroy");
                this.destroy();
                return true;
            } else if (this.hp <= cannon.SHOT_POWER) {
                this.flare("dying");
            }
        }
        return false;
    },

    destroy: function() {},

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

cannon.Enemy.eraseAll = function() {
};
