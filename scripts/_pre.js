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
    seVolume: 0.5,
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
    "sounds/shot": "sounds/nc30638.mp3",

};

Math.PHI = 1.61803399;
