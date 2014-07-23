/**
 * @namespace
 */
var cannon = {
    app: null,
    SC_W: 900,
    SC_H: 600,
};

cannon.playSe = function(soundName) {
    tm.asset.Manager.get(soundName).clone().setVolume(0.5).play();
};

tm.display.Label.default.fontFamily = "OFL";
