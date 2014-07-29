/**
 * @namespace
 */
var cannon = {
    app: null,

    SC_W: 960,
    SC_H: 640,

    FIGHTER_RADIUS: 20,

    FIGHTER_SPEED: 12.0,
    SHOT_SPEED: 40,
    HEAT_BY_SHOT: 15,

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

    "sounds/extend": "sounds/extend.mp3",
};

Math.PHI = 1.61803399;
