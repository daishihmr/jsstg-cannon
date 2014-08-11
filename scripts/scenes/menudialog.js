tm.define("cannon.MenuDialog", {
    superClass: "tm.ui.MenuDialog",

    init: function(title, menu, descriptions, defaultIndex, showExit) {
        this.superInit({
            title: title,
            menu: menu,
            menuDesctiptions: descriptions,
            defaultIndex: defaultIndex || 0,
            showExit: true,
            screenWidth: cannon.SC_W,
            screenHeight: cannon.SC_H,
            backgroundColor: "hsla(200, 80%, 5%, 0.9)",
            boxColor: "hsla(200, 80%, 10%, 0.9)",
            cursorColor: "hsla(200, 80%, 30%, 0.9)",
            okKey: "z",
            cancelKey: "x",
        });

        this.on("enter", function() {
            cannon.playSe("extend");
        });

        this.on("preselected", function() {
            cannon.playSe("extend");
        });

        this.on("selected", function() {
            cannon.playSe("shot");
        });

        this.on("canceled", function() {
            cannon.playSe("extend");
        });
    }

});
