tm.define("cannon.OptionScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        this.on("exit", function() {
            localStorage.setItem("cannon.setting", JSON.stringify(cannon.optionSettings));
        });
    },

    beforeSelected: 0,
    openRootMenu: function() {
        var scene = this;
        cannon.app.pushScene(
            cannon.MenuDialog("OPTION", ["BGM volume", "SE volume", "WebGL"], ["BGM音量を設定します","SE音量を設定します", "WebGLエフェクトのON/OFFを切り替えます"], scene.beforeSelected)
                .on("closed", function(e) {
                    scene.beforeSelected = e.index === -1 ? 0 : e.index;
                    switch (e.value) {
                    case "BGM volume":
                    case "SE volume":
                        scene.openVolumeMenu(e.value);
                        break;
                    case "WebGL":
                        scene.openOnOffMenu(e.value);
                        break;
                    default:
                        cannon.app.popScene();
                        break;
                    }
                })
        );
    },

    openVolumeMenu: function(title) {
        var scene = this;
        var values = Array.range(0, 8).map(function(_){ return _ + "" });
        var current = 0;
        if (title === "BGM volume") {
            current = cannon.optionSettings.bgmVolume;
        } else if (title === "SE volume") {
            current = cannon.optionSettings.seVolume;
        }
        var menu = cannon.MenuDialog(title, values, values, current, false);
        menu.on("closed", function(e) {
            scene.openRootMenu();
        });
        menu.on("preselected", function(e) {
            if (title === "BGM volume") {
                cannon.optionSettings.bgmVolume = e.index;
                if (cannon.bgm) cannon.bgm.setVolume(cannon.optionSettings.bgmVolume / (8 - 1));
            } else if (title === "SE volume") {
                cannon.optionSettings.seVolume = e.index;
            }
        });
        cannon.app.pushScene(menu);
    },

    openOnOffMenu: function(title) {
        var scene = this;
        var current = 0;
        if (title === "WebGL") {
            current = cannon.optionSettings.webgl ? 0 : 1;
        }
        var menu = cannon.MenuDialog(title, ["on", "off"], ["on", "off"], current, false);
        menu.on("closed", function(e) {
            scene.openRootMenu();
        });
        menu.on("preselected", function(e) {
            if (title === "WebGL") {
                cannon.optionSettings.webgl = e.index === 0;
                cannon.app.webgl.setEnable(cannon.optionSettings.webgl);
            }
        });
        cannon.app.pushScene(menu);
    },

});
