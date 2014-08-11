tm.define("cannon.Application", {
    superClass: "tm.display.CanvasApp",

    init: function(canvasId) {
        this.superInit(canvasId);
        this.keyboard.element.addEventListener("keydown", function(e){
            if (37 <= e.keyCode && e.keyCode <= 40 || e.keyCode === 32) e.preventDefault();
        }, false);

        this.canvas.imageSmoothingEnabled = false;
    }
});

tm.define("cannon.GameData", {

    score: 0,
    zanki: 0,
    rank: 0,

    init: function() {
        this.zanki = 3;
        this.addScore(0);
        this.addRank(0);
    },

    addScore: function(v) {
        this.score += v;
    },

    addRank: function(v) {
        this.rank = Math.clamp(this.rank + v, 0, cannon.RANK_MAX);
        bulletml.Walker.globalScope["$rank"] = this.rank * 0.001;
    },
});
