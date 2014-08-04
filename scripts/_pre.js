/**
 * @namespace
 */
var cannon = {
    app: null,

    SC_W: 960,
    SC_H: 640,

    FIGHTER_RADIUS: 20,

    FIGHTER_SPEED: 12.0,
    SHOT_SPEED: 30,
    HEAT_BY_SHOT: 25,

};

cannon.optionSettings = {
    seVolume: 0.1,
    bgmVolume: 0.5,
};

tm.display.Label.default.fontFamily = "OFL";

cannon.ASSETS = {
    "fighter": "images/fighter.png",
    "aura": "images/aura.png",
    "shot": "images/shot.png",
    "backfire": "images/backfire.png",
    "explode0": "images/exp_s.png",
    "explode1": "images/exp_l.png",
    "shockwave": "images/shockwave.png",
    "spark": "images/spark.png",
    "spark2": "images/spark2.png",

    "sounds/extend": "sounds/extend.mp3",
    "sounds/reload": "sounds/sen_ge_gun_otosu03.mp3",
    "sounds/shot": "sounds/gun2.mp3",
};
Array.range(0, 14 + 1).forEach(function(i) {
    cannon.ASSETS["enemy{0}".format(i)] = "images/enemy{0}.png".format(i);
});

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
            // for (var x = 0; x < doted.width; x += 3) {
            //     doted.clear(x, 0, 1, doted.height);
            // }
            for (var y = 0; y < doted.height; y += 3) {
                doted.clear(0, y, doted.width, 1);
            }

            var canvas = tm.graphics.Canvas().resize(tex.width * 2, tex.height * 2);
            canvas.globalCompositeOperation = "lighter";
            canvas.globalAlpha = 0.12;
            for (var i = 0; i < 10; i++) {
                canvas.drawImage(glow.canvas, 0, 0);
            }
            canvas.globalCompositeOperation = "source-over";
            canvas.globalAlpha = 1.0;
            canvas.drawImage(doted.canvas, tex.width * 0.5, tex.height * 0.5, tex.width, tex.height);

            tm.asset.Manager.set(name, canvas);
        });

        return nextScene();
    };
};

Math.PHI = 1.61803399;

