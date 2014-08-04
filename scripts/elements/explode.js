tm.define("cannon.Explode", {
    superClass: "cannon.EffectSprite",

    init: function(x, y) {
        this.superInit("explode0", 128, 128, 64, 1);
        this.setPosition(x, y);
    }
});

tm.define("cannon.LargeExplode", {
    superClass: "cannon.EffectSprite",

    init: function(x, y) {
        this.superInit("explode1", 128, 128, 64, 1);
        this.setScale(3).setPosition(x, y);
    }
});
