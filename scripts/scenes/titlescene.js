tm.define("cannon.TitleScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        this.setInteractive(true);

        this.fromJSON({
            children: {
                title: {
                    type: "tm.display.Label",
                    init: ["Deep Striker", 72],
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * (1 - 1 / Math.PHI),
                }
            }
        })
    },

    onpointingend: function() {
        var that = this;
        cannon.app.pushScene(
            cannon.MenuDialog("MENU", ["game start", "option"], ["ゲームスタート","設定"]).on("selected", function(e) {
                switch (e.value) {
                case "game start":
                    that.startGame();
                    break;
                }
            })
        );
    },

    startGame: function() {
        cannon.app.replaceScene(cannon.GameScene());
    },

});
