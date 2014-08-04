tm.define("cannon.EffectSprite", {
    superClass: "tm.display.Sprite",

    init: function(texture, width, height, finalIndex, frameIncr) {
        this.superInit(texture, width, height);
        this
            .setFrameIndex(0)
            .setBlendMode("lighter");
        this.f = 0;
        this.finalIndex = finalIndex;
        this.frameIncr = frameIncr;
    },

    update: function(app) {
        this.f += this.frameIncr;
        this.frameIndex = ~~this.f;
        if (this.f >= this.finalIndex) {
            this.remove();
        }
    }
});
