/**
 * @namespace
 */
var cannon = {
    app: null,

    SC_W: 900,
    SC_H: 600,

    SHOT_SPEED: 30,
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

    "sounds/extend": "sounds/extend.mp3",
};

Math.PHI = 1.61803399;
