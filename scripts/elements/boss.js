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
    },

    setCore: function(core) {
        this.core = core;
        this.core.on("destroy", function() {
        });
    },
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
            delay: data.delay,
            parentHistory: [],
            scaleX: data.scaleX,
            scaleY: data.scaleY,
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
    },
});

tm.define("cannon.Boss1", {
    superClass: "cannon.Boss",

    init: function() {
        this.superInit();
        this.parts = cannon.BOSS1_DATA.parts.map(function(part){ return cannon.BossPart(part) });

        this.tweener.to({
            y: 150,
            rotation: -30,
        }, 2000, "easeInOutQuad").to({
            y: 450,
            rotation: 30,
        }, 2000, "easeInOutQuad").setLoop(true);
    }
});
