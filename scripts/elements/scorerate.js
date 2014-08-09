tm.define("cannon.ScoreRate", {
    superClass: "tm.display.Sprite",

    init: function(v, x, y) {
        this.superInit("scorerate", 64, 64);
        this.setScale(2).setPosition(x, y).setFrameIndex(v);
        this.tweener.to({
            y: y - 120,
            alpha: 0,
        }, 1000).call(function() {
            this.remove();
        }.bind(this))
    }
});
