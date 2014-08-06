cannon.onAssetsLoaded = function(nextScene) {
    return function() {

        // enemy
        Array.range(0, 14 + 1).forEach(function(i) {
            var name = "enemy{0}".format(i);
            var tex = tm.asset.Manager.get(name);

            var glow = tm.graphics.Canvas().resize(tex.width * 2, tex.height * 2);
            glow.drawTexture(tex, tex.width * 0.5, tex.height * 0.5, tex.width, tex.height);
            glow.stackBlur(50);

            var doted = tm.graphics.Canvas().resize(tex.width, tex.height);
            doted.drawTexture(tex, 0, 0);
            doted.strokeStyle = "transparent";
            for (var y = 0; y < doted.height; y += 3) {
                doted.clear(0, y, doted.width, 1);
            }

            var canvas = tm.graphics.Canvas().resize(tex.width * 2 * 2, tex.height * 2);

            // frameIndex: 0
            canvas.globalCompositeOperation = "lighter";
            canvas.globalAlpha = 0.12;
            for (var i = 0; i < 10; i++) {
                canvas.drawImage(glow.canvas, 0, 0);
            }

            canvas.globalCompositeOperation = "source-over";
            canvas.globalAlpha = 1.0;
            canvas.drawImage(doted.canvas, tex.width * 0.5, tex.height * 0.5, tex.width, tex.height);

            // frameIndex: 1
            canvas.globalCompositeOperation = "lighter";
            canvas.globalAlpha = 0.12;
            for (var i = 0; i < 15; i++) {
                canvas.drawImage(glow.canvas, tex.width * 2, 0);
            }

            canvas.globalCompositeOperation = "lighter";
            canvas.globalAlpha = 1.0;
            for (var i = 0; i < 3; i++) {
                canvas.drawImage(doted.canvas, tex.width * 2.5, tex.height * 0.5, tex.width, tex.height);
            }

            tm.asset.Manager.set(name, canvas);
        });

        return nextScene();
    };
};
