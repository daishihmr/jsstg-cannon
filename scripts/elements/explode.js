tm.define("cannon.Explode", {
    superClass: "tm.display.Sprite",

    init: function(x, y) {
        this.superInit("explode0", 128, 128);
        this.setPosition(x, y).setBlendMode("lighter").setFrameIndex(0);
    },

    update: function(app) {
        if (app.frame % 2 === 0) {
            this.frameIndex += 1;
            if (this.frameIndex === 0) {
                this.remove();
            }
        }
    },
});

tm.define("cannon.LargeExplode", {
    superClass: "tm.display.Sprite",

    init: function(x, y) {
        this.superInit("explode1", 128, 128);
        this.setScale(3).setPosition(x, y).setBlendMode("lighter").setFrameIndex(0);
    },

    update: function(app) {
        if (app.frame % 2 === 0) {
            this.frameIndex += 1;
            if (this.frameIndex === 0) {
                this.remove();
            }
        }
    },
});
