tm.define("cannon.Application", {
    superClass: "tm.display.CanvasApp",

    init: function(canvasId) {
        this.superInit(canvasId);
        this.fps = 60;
        this
            .resize(cannon.SC_W, cannon.SC_H)
            .fitWindow()
            .replaceScene(cannon.LoadingScene({
                width: cannon.SC_W,
                height: cannon.SC_H,
                assets: cannon.ASSETS,
                // nextScene: cannon.onAssetsLoaded(cannon.TitleScene),
                nextScene: cannon.ResultScene,
            }));

        this.keyboard.element.addEventListener("keydown", function(e){
            if (37 <= e.keyCode && e.keyCode <= 40 || e.keyCode === 32) e.preventDefault();
        }, false);

        this.canvas.imageSmoothingEnabled = false;
    }
});

tm.define("cannon.GameData", {
    superClass: "tm.event.EventDispatcher",

    _score: 0,
    _zanki: 0,
    _rank: 0,

    init: function() {
        this.superInit();
    },

    initializeValues: function() {
        this.score = 0;
        this.zanki = 3;
        this.rank = 0;
    }
});

cannon.GameData.prototype.accessor("score", {
    get: function(){ return this._score },
    set: function(v) {
        this._score = v;
        this.flare("updatescore");
    },
});

cannon.GameData.prototype.accessor("zanki", {
    get: function(){ return this._zanki },
    set: function(v) {
        this._zanki = v;
        this.flare("updatezanki");
    },
});

cannon.GameData.prototype.accessor("rank", {
    get: function(){ return this._rank },
    set: function(v) {
        this._rank = Math.clamp(v, 0, cannon.RANK_MAX);
        bulletml.Walker.globalScope["$rank"] = this._rank * 0.001;
        this.flare("updaterank");
    },
});
