tm.main(function() {
    cannon.app = tm.display.CanvasApp("#main");
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
