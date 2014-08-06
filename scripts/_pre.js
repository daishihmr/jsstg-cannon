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
    SHOT_POWER: 3,

    currentStage: 0,
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
    "boost": "images/boost.png",

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

