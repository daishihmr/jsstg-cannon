tm.define("cannon.Spark2", {
    superClass: "tm.display.Sprite",

    init: function(x, y) {
        this.superInit("spark2", 128, 128);
        this
            .setFrameIndex(0)
            .setBlendMode("lighter")
            .setOrigin(0.9, 0.5)
            .setPosition(x, y);
        this.f = 0;
    },

    update: function(app) {
        this.f += 1.5;
        this.frameIndex = ~~this.f;
        if (this.f >= 25) {
            this.remove();
        }
    }
});
