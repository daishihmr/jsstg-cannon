tm.define("cannon.ShockWave", {
    superClass: "cannon.EffectSprite",

    init: function(x, y) {
        this.superInit("shockwave", 64, 64, 64, 2);
        this.setPosition(x, y);
    }
});
