/**
 * @namespace
 */
var cannon = {};

(function() {

var SC_W = 960;
var SC_H = 640;

cannon.app = null;

cannon.SC_W = SC_W;
cannon.SC_H = SC_H;

cannon.FIGHTER_RADIUS = SC_W / 96;
cannon.FIGHTER_SPEED = SC_W / 120;
cannon.SHOT_SPEED = SC_W / 32;
cannon.HEAT_BY_SHOT = 25;
cannon.SHOT_POWER = 3;
cannon.SHOT_RADIUS = SC_W / 96;

cannon.currentStage = 0;

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
    "boost": "images/boost.png",
    "stage1": "genasset/stage1_half.png",

    "sounds/extend": "sounds/extend.mp3",
    "sounds/reload": "sounds/sen_ge_gun_otosu03.mp3",
    "sounds/shot": "sounds/gun2.mp3",
    "sounds/explode0": "sounds/sen_ge_taihou03.mp3",
    "sounds/explode1": "sounds/sen_ge_bom14.mp3",
};
Array.range(0, 14 + 1).forEach(function(i) {
    cannon.ASSETS["enemy{0}".format(i)] = "images/enemy{0}.png".format(i);
});

Math.PHI = 1.61803399;

})();
