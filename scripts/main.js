tm.main(function() {
    cannon.app = cannon.Application("#main");
    cannon.app
        .resize(cannon.SC_W, cannon.SC_H)
        .fitWindow()
        .replaceScene(tm.ui.LoadingScene({
            width: cannon.SC_W,
            height: cannon.SC_H,
            assets: {
                "sounds/extend": "sounds/extend.mp3",
                // "sounds/extend": "sounds/se_maoudamashii_onepoint29.ogg",
                // "sounds/extend": "sounds/se_maoudamashii_onepoint29.wav",
            },
            nextScene: cannon.TitleScene,
        }))
        .run();
});

tm.define("cannon.Application", {
    superClass: "tm.display.CanvasApp",

    init: function(canvasId) {
        this.superInit(canvasId);
        this.keyboard.element.addEventListener("keydown", function(e){
            switch (e.keyCode) {
            case 38:
            case 37:
            case 39:
            case 40:
                e.preventDefault();
            }
        }, false);
    }
});
