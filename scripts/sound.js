cannon.playSe = function(soundName) {
    tm.asset.Manager.get(soundName).clone().setVolume(cannon.optionSettings.seVolume).play();
};

cannon.playBgm = function(soundName) {
    tm.asset.Manager.get(soundName).clone().setVolume(cannon.optionSettings.bgmVolume).play();
};
