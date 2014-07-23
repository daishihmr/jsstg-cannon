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
        }));

    var tester = document.createElement("span");
    tester.style.fontFamily = "'uni', 'monospace'";
    tester.innerHTML = "QW@HhsXJ";
    document.body.appendChild(tester);

    var before = tester.offsetWidth;
    var timeout = 10;

    var checkLoadFont = function() {
        timeout -= 1;
        if (tester.offsetWidth !== before || timeout < 0) {
            document.body.removeChild(tester);
            cannon.app.run();
        } else {
            setTimeout(checkLoadFont, 100);
        }
    };
    checkLoadFont();
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
