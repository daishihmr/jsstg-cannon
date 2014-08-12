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
});

tm.define("cannon.BossPart", {
    superClass: "cannon.Enemy",

    init: function(data) {
        this.superInit();

        this.fromJSON({
            boundingType: "circle",
            radius: data.size * 0.2,
            score: data.score,
            hp: data.hp,
            expType: data.expType,
            offsetX: data.x,
            offsetY: data.y,
            delay: data.delay,
            parentHistory: [],
            scaleX: data.scaleX,
            scaleY: data.scaleY,
            children: [{
                type: "tm.display.Sprite",
                init: [data.texture, data.size * 2, data.size * 2],
                frameIndex: 0,
            }]
        });

        this.on("added", function() {
            this.setPosition(this.parentPart.x + this.offsetX, this.parentPart.y + this.offsetY);
            for (var i = 0; i < this.delay; i++) {
                this.parentHistory.push({
                    x: this.parentPart.x,
                    y: this.parentPart.y,
                });
            }
        });

        this.on("enterframe", function() {
            this.parentHistory.push({
                x: this.parentPart.x,
                y: this.parentPart.y
            });
            var p = this.parentHistory.shift();
            if (p) {
                this.x = this.offsetX + p.x;
                this.y = this.offsetY + p.y;
            }
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
            y: 150
        }, 2000, "easeInOutQuad").to({
            y: 450
        }, 2000, "easeInOutQuad").setLoop(true);
    }
});
