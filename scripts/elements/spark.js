tm.define("cannon.Spark", {
    superClass: "tm.display.Sprite",

    init: function(x, y) {
        this.superInit("spark", 64, 64);
        this
            .setFrameIndex(0)
            .setBlendMode("lighter")
            .setPosition(x, y);
        this.f = 0;
    },

    update: function(app) {
        this.f += 2;
        this.frameIndex += 2;
        if (this.f >= 64) {
            this.remove();
        }
    }
});
