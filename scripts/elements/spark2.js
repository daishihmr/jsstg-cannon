tm.define("cannon.Spark2", {
    superClass: "cannon.EffectSprite",

    init: function(x, y, frameIncr) {
        this.superInit("spark2", 128, 128, 25, frameIncr || 1.5);
        this.setOrigin(0.9, 0.5).setPosition(x, y);
    }
});
