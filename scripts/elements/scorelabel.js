tm.define("cannon.ScoreLabel", {
    superClass: "tm.display.Label",

    _score: 0,
    showing: 0,

    init: function() {
        this.superInit("0", 60);
        this
            .setAlign("right")
            .setBaseline("top")
            .setFillStyle("white")
            .setFontFamily("UFL");
    },

    clearAnimation: function() {
        this.showing = this._score;
        this.tweener.clear();
    },

    update: function(app) {
        var t = "score:" + Math.floor(this.showing);
        if (this.text !== t) this.text = t;

        this.alpha = 0.6 + Math.sin(app.frame * 0.1) * 0.4;
    }
});

cannon.ScoreLabel.prototype.accessor("score", {
    get: function(){ return this._score },
    set: function(v) {
        this._score = v;
        this.tweener.clear().to({
            showing: this._score
        }, 500);
    }
});
