tm.define("cannon.RankLabel", {
    superClass: "tm.display.Label",

    _rank: 0,
    showing: 0,

    init: function() {
        this.superInit("0", 60);
        this
            .setAlign("left")
            .setBaseline("top")
            .setFillStyle("white")
            .setFontFamily("UFL");
    },

    clearAnimation: function() {
        this.showing = this._rank;
        this.tweener.clear();
    },

    update: function(app) {
        var t = "rank:" + Math.floor(this.showing);
        if (this.text !== t) this.text = t;

        this.alpha = 0.6 + Math.sin(app.frame * 0.1) * 0.4;
    }
});

cannon.RankLabel.prototype.accessor("rank", {
    get: function(){ return this._rank },
    set: function(v) {
        this._rank = v;
        this.tweener.clear().to({
            showing: this._rank
        }, 500);
    }
});
