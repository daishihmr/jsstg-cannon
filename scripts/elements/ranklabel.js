tm.define("cannon.RankLabel", {
    superClass: "tm.display.Label",

    rank: 0,
    showing: 0,

    init: function() {
        this.superInit("0", 60);
        this
            .setAlign("left")
            .setBaseline("top")
            .setFillStyle("white")
            .setFontFamily("UFL");
    },

    add: function(delta) {
        this.rank = Math.clamp(this.rank + delta, 0, cannon.RANK_MAX);
        this.tweener.clear().to({
            showing: this.rank
        }, 500);
    },

    set: function(rank) {
        this.rank = rank;
        this.showing = rank;
    },

    update: function(app) {
        var t = "rank:" + Math.floor(this.showing);
        if (this.text !== t) this.text = t;

        this.alpha = 0.6 + Math.sin(app.frame * 0.1) * 0.4;
    }
});
