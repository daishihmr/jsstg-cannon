(function() {

cannon.playSe = function(soundName) {
    tm.asset.Manager.get("sounds/" + soundName).clone()
        .setVolume(cannon.optionSettings.seVolume)
        .play();
};

cannon.bgm = null;
cannon.playBgm = function(soundName, loopRange) {
    if (cannon.bgm) cannon.bgm.stop();
    cannon.bgm = tm.asset.Manager.get("sounds/" + soundName).clone();
    cannon.bgm
        .setVolume(cannon.optionSettings.bgmVolume)
        .setLoop(true)
        .play();
    if (loopRange) {
        cannon.bgm.source.loopStart = loopRange[0];
        cannon.bgm.source.loopEnd = loopRange[1];
    }
};

})();
