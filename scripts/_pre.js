/**
 * @namespace
 */
var cannon = {};

(function() {

var SC_W = 960;
var SC_H = 640;

cannon.app = null;
cannon.head = null;
cannon.foot = null;
cannon.gameScene = null;

cannon.SC_W = SC_W;
cannon.SC_H = SC_H;

cannon.STAGE_COUNT = 1;

cannon.FIGHTER_RADIUS = SC_W / 96;
cannon.FIGHTER_SPEED = SC_W / 100;
cannon.SHOT_SPEED = SC_W / 32;
cannon.HEAT_BY_SHOT = 18;
cannon.SHOT_POWER = 3;
cannon.SHOT_RADIUS = SC_W / 32;
cannon.ZANKI_MAX = 10;
cannon.RANK_MAX = 1000;
cannon.RANK_DOWN_AT_KILLED = -30;

cannon.optionSettings = {
    seVolume: 0.1,
    bgmVolume: 0.5,
};

tm.display.Label.default.fontFamily = "Orbitron";

cannon.ASSETS = {
    "title": "images/title.png",
    "fighter": "images/fighter.png",
    "aura": "images/aura.png",
    "shot": "images/shot.png",
    "backfire": "images/backfire.png",
    "explodeSmall": "images/exp.png",
    "explode0": "images/exp_s.png",
    "explode1": "images/exp_l.png",
    "explodeBlue": "images/exp_blue.png",
    "shockwave": "images/shockwave.png",
    "spark": "images/spark.png",
    "spark2": "images/spark2.png",
    "boost": "images/boost.png",
    "bullet": "images/bullet.png",
    "scorerate": "images/scorerate.png",

    "boss1_1": "images/boss1_1.png",
    "boss1_2": "images/boss1_2.png",
    "boss1_3": "images/boss1_3.png",

    "sounds/extend": "sounds/extend.mp3",
    "sounds/reload": "sounds/sen_ge_gun_otosu03.mp3",
    "sounds/shot": "sounds/gun2.mp3",
    "sounds/explode0": "sounds/sen_ge_taihou03.mp3",
    "sounds/explode1": "sounds/sen_ge_bom14.mp3",
    "sounds/pi": "sounds/se_maoudamashii_system26.mp3",
};
Array.range(0, 14 + 1).forEach(function(i) {
    cannon.ASSETS["enemy{0}".format(i)] = "images/enemy{0}.png".format(i);
});

Math.PHI = 1.61803399;

})();
