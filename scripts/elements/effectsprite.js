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

tm.define("cannon.Explode", {
    superClass: "cannon.EffectSprite",

    init: function(x, y) {
        this.superInit("explode0", 128, 128, 64, 1);
        this.setRotation(Math.rand(0, 360)).setScale(2.0).setPosition(x, y);
    },

    onadded: function() {
        cannon.playSe("explode0");
    }
});

tm.define("cannon.LargeExplode", {
    superClass: "cannon.EffectSprite",

    init: function(x, y) {
        this.superInit("explode1", 128, 128, 64, 1);
        this.setRotation(Math.rand(0, 360)).setScale(3.5).setPosition(x, y);
    },

    onadded: function() {
        cannon.playSe("explode1");
    }
});

tm.define("cannon.PlayerExplode", {
    superClass: "cannon.EffectSprite",

    init: function(x, y) {
        this.superInit("explodeBlue", 64, 64, 64, 1);
        this.setRotation(Math.rand(0, 360)).setScale(2.5).setPosition(x, y);
    },

    onadded: function() {
        cannon.playSe("explode1");
    }
});

tm.define("cannon.ShockWave", {
    superClass: "cannon.EffectSprite",

    init: function(x, y) {
        this.superInit("shockwave", 64, 64, 64, 2);
        this.setPosition(x, y);
    }
});

tm.define("cannon.Spark", {
    superClass: "cannon.EffectSprite",

    init: function(x, y) {
        this.superInit("spark", 64, 64, 64, 2);
        this.setPosition(x, y);
    }
});

tm.define("cannon.Spark2", {
    superClass: "cannon.EffectSprite",

    init: function(x, y, frameIncr) {
        this.superInit("spark2", 128, 128, 25, frameIncr || 1.5);
        this.setOrigin(0.9, 0.5).setPosition(x, y);
    }
});

tm.define("cannon.Boost", {
    superClass: "cannon.EffectSprite",

    init: function(x, y) {
        this.superInit("boost", 128, 128, 25, 1);
        this.setPosition(x, y);
    }
});
