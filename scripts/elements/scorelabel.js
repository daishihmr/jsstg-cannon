tm.define("cannon.ScoreLabel", {
    superClass: "tm.display.Label",

    score: 0,
    showing: 0,

    init: function() {
        this.superInit("0", 60);
        this
            .setAlign("right")
            .setBaseline("top")
            .setFillStyle("white")
            .setFontFamily("UFL");
    },

    add: function(delta) {
        this.score += delta;
        this.tweener.clear().to({
            showing: this.score
        }, 500);
    },

    set: function(score) {
        this.score = score;
        this.showing = score;
    },

    update: function(app) {
        var t = "score:" + Math.floor(this.showing);
        if (this.text !== t) this.text = t;

        this.alpha = 0.6 + Math.sin(app.frame * 0.1) * 0.4;
    }
});