tm.define("cannon.TitleScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        this.setInteractive(true);

        var age = 0;
        this.on("enterframe", function() { age += 1 });

        this.fromJSON({
            children: {
                bgColor: {
                    type: "tm.display.RectangleShape",
                    init: [cannon.SC_W, cannon.SC_H, {
                        fillStyle: "black",
                        strokeStyle: "transparent",
                    }],
                    originX: 0, originY: 0,
                },
                bg: {
                    type: "tm.display.Sprite",
                    init: ["title", cannon.SC_H, cannon.SC_H],
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * 0.5,
                    alpha: 0.2,
                    onenterframe: function(e){ this.alpha = 0.6 + Math.sin(Math.PI * -0.5 + age * 0.01) * 0.4 },
                },
                pre: {
                    type: "tm.display.Label",
                    init: ["JavaScript STG Festival 2014", 36],
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * 0.25 - 80,
                    shadowColor: "white",
                    shadowBlur: 15,
                    blendMode: "lighter",
                },
                title: {
                    type: "tm.display.Label",
                    init: ["Deep Striker", 96],
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * 0.25,
                    fillStyle: tm.graphics.LinearGradient(-cannon.SC_W * 0.5, -250, cannon.SC_W * 0.5, 250)
                        .addColorStopList([
                            { offset: 0.3, color: "hsl(200, 90%, 50%)"},
                            { offset: 0.5, color: "hsl(200, 80%,100%)"},
                            { offset: 0.7, color: "hsl(200, 90%, 50%)"},
                        ]).toStyle(),
                    shadowColor: "white",
                    shadowBlur: 15,
                    blendMode: "lighter",
                },
                credit: {
                    type: "tm.display.Label",
                    init: ["Copyright © 2014 daishi_hmr", 24],
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * 0.9,
                },
                prompt: {
                    type: "tm.display.Label",
                    init: ["press [Z] key", 36],
                    fillStyle: "hsl(200, 90%, 70%)",
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * 0.8,
                    shadowColor: "white",
                    shadowBlur: 5,
                    blendMode: "lighter",
                    onenterframe: function(e){ this.alpha = 0.6 + Math.sin(age * 0.2) * 0.4 },
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

    beforeSelected: 0,
    openMenu: function() {
        var scene = this;
        cannon.app.pushScene(
            cannon.MenuDialog("MENU", ["game start", "option"], ["ゲームスタート","設定"], scene.beforeSelected).on("closed", function(e) {
                scene.beforeSelected = e.index === -1 ? 0 : e.index;
                switch (e.value) {
                case "game start":
                    scene.startGame();
                    break;
                case "option":
                    var optionScene = cannon.OptionScene();
                    cannon.app.pushScene(optionScene);
                    optionScene.openRootMenu();
                    optionScene.onexit = function() {
                        scene.openMenu();
                    };
                    break;
                }
            })
        );
    },

    startGame: function() {
        cannon.app.replaceScene(cannon.GameScene.createLoadingScene(0));
    },

});
