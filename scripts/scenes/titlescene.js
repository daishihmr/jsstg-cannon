tm.define("cannon.TitleScene", {
    superClass: "tm.scene.TitleScene",

    init: function() {
        this.superInit({
            // title: "キャノンさん",
            width: cannon.SC_W,
            height: cannon.SC_H,
            autopop: false,
        });
    },

    update: function(app) {
        var kb = app.keyboard;
        if (kb.getKey("up")) console.log("up");
        if (kb.getKey("down")) console.log("down");
        if (kb.getKey("left")) console.log("left");
        if (kb.getKey("right")) console.log("right");
    },

    onfinish: function() {
        tm.asset.Manager.get("sounds/extend").clone().play();
    }

});
