(function() {

cannon.playSe = function(soundName) {
    tm.asset.Manager.get("sounds/" + soundName).clone()
        .setVolume(cannon.optionSettings.seVolume / (8 - 1))
        .play();
};

cannon.bgm = null;
cannon.playBgm = function(bgm, loopRange) {
    if (cannon.bgm) cannon.bgm.stop();
    cannon.bgm = tm.asset.Manager.get(bgm).clone();
    cannon.bgm
        .setVolume(cannon.optionSettings.bgmVolume / (8 - 1))
        .setLoop(true)
        .play();
    if (loopRange) {
        cannon.bgm.source.loopStart = loopRange[0];
        cannon.bgm.source.loopEnd = loopRange[1];
    }
};

cannon.stopBgm = function() {
    if (cannon.bgm) cannon.bgm.stop();
};

})();
