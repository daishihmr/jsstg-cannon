tm.define("cannon.TitleScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        this.setInteractive(true);

        this.fromJSON({
            children: {
                pre: {
                    type: "tm.display.Label",
                    init: ["jsstg 2014", 36],
                    x: cannon.SC_W * 0.25,
                    y: cannon.SC_H * (1 - 1 / Math.PHI) - 80,
                    shadowColor: "white",
                    shadowBlur: 10,
                },
                title: {
                    type: "tm.display.Label",
                    init: ["Deep Striker", 96],
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * (1 - 1 / Math.PHI),
                    fillStyle: tm.graphics.LinearGradient(-cannon.SC_W * 0.5, -100, cannon.SC_W * 0.5, 100)
                        .addColorStopList([
                            { offset: 0.3, color: "hsl(220, 50%, 50%)"},
                            { offset: 0.5, color: "hsl(220, 80%,100%)"},
                            { offset: 0.7, color: "hsl(220, 50%, 50%)"},
                        ]).toStyle(),
                    shadowColor: "white",
                    shadowBlur: 10,
                },
                credit: {
                    type: "tm.display.Label",
                    init: ["Copyright (c) 2014 daishi_hmr", 24],
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * 0.9,
                },
            }
        });

        this.on("pointingend", function() {
            this.openMenu();
        });
    },

    update: function(app) {
        if (app.keyboard.getKeyUp("z") || app.keyboard.getKeyUp("x") || app.keyboard.getKeyUp("space")) {
            this.openMenu();
        }
    },

    openMenu: function() {
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
        cannon.app.replaceScene(cannon.GameScene.createLoadingScene(0));
    },

});
