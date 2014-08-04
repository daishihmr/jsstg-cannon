tm.define("cannon.Spark", {
    superClass: "cannon.EffectSprite",

    init: function(x, y) {
        this.superInit("spark", 64, 64, 64, 2);
        this.setPosition(x, y);
    }
});
