tm.define("cannon.ScoreLabel", {
    superClass: "tm.display.Label",

    _score: 0,
    showing: 0,
    animation: true,

    init: function() {
        this.superInit("0", 35);
        this
            .setAlign("left")
            .setBaseline("top")
            .setFillStyle("white")
            .setFontFamily("ShareTechMono");
    },

    clearAnimation: function() {
        this.showing = this._score;
        this.tweener.clear();
    },

    update: function(app) {
        var s = "" + Math.floor(this.showing);
        for (var i = 0, len = 9 - s.length; i < len; i++) {
            s = "0" + s;
        }
        var t = "score:" + s;
        if (this.text !== t) this.text = t;

        this.alpha = 0.6 + Math.sin(app.frame * 0.1) * 0.4;
    }
});

cannon.ScoreLabel.prototype.accessor("score", {
    get: function(){ return this._score },
    set: function(v) {
        this._score = v;
        if (this.animation) {
            this.tweener.clear().to({
                showing: this._score
            }, 500);
        } else {
            this.showing = this._score;
        }
    }
});
