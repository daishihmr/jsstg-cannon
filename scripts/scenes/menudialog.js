tm.define("cannon.MenuDialog", {
    superClass: "tm.ui.MenuDialog",

    init: function(title, menu, descriptions, defaultIndex, showExit) {
        this.superInit({
            title: title,
            menu: menu,
            menuDesctiptions: descriptions,
            defaultIndex: defaultIndex,
            showExit: true,
            screenWidth: cannon.SC_W,
            screenHeight: cannon.SC_H,
        });

        this.on("preselected", function() {
            cannon.playSe("sounds/extend");
        });

        this.on("canceled", function() {
            // TODO
            cannon.playSe("sounds/extend");
        });
    }

});
