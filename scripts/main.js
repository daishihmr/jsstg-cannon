tm.main(function() {
    cannon.app = cannon.Application("#main");
    cannon.app.fps = 60;
    cannon.app
        .resize(cannon.SC_W, cannon.SC_H)
        .fitWindow()
        .replaceScene(tm.ui.LoadingScene({
            width: cannon.SC_W,
            height: cannon.SC_H,
            assets: cannon.ASSETS,
            // nextScene: cannon.TitleScene,
            nextScene: cannon.GameScene,
        }));

    var tester = document.createElement("span");
    tester.style.fontFamily = "'OFL', 'monospace'";
    tester.innerHTML = "QW@HhsXJ";
    document.body.appendChild(tester);

    var before = tester.offsetWidth;
    var timeout = 20;

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
            if (37 <= e.keyCode && e.keyCode <= 40) e.preventDefault();
        }, false);
    }
});
