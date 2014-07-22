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

    onfinish: function() {
        tm.asset.Manager.get("sounds/extend").clone().play();
    }

});
