tm.define("cannon.TitleScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        this.setInteractive(true);
    },

    onpointingend: function() {
        cannon.app.pushScene(
            cannon.MenuDialog("MENU", [
                "game start",
                "option",
            ],
            [
                "ゲームスタート",
                "設定",
            ]).on("selected", function(e) {
                console.log(e);
            })
        );
    }

});
