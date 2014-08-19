tm.define("cannon.ResultScene", {
    superClass: "tm.app.Scene",

    init: function(clearData) {
        this.superInit();

        clearData = {
            gameData: cannon.GameData(),
            comboCount: [0, 0, 0, 0, 0, 0],
            bossBattleTime: 60 * 1000,
            perfectBonus: 10000,
            noMissBonus: 10000,
        };

        this.bossBattleTime = clearData.bossBattleTime;
        this.perfectBonus = clearData.perfectBonus;
        this.noMissBonus = clearData.noMissBonus;
        this.score = clearData.gameData.score;

        var scene = this;
        this.fromJSON({
            children: {
                bg: {
                    type: "tm.display.RectangleShape",
                    init: [cannon.SC_W, cannon.SC_H, {
                        fillStyle: "rgba(0, 0, 0, 0.5)",
                        strokeStyle: "transparent",
                    }],
                    originX: 0, originY: 0,
                },
                labels: {
                    type: "tm.display.CanvasElement",
                    children: {
                        title: {
                            type: "tm.display.Label",
                            init: ["result", 40],
                            align: "center",
                            baseline: "middle",
                            x: cannon.SC_W * 0.5,
                            y: cannon.SC_H * 0.1,
                        },
                        combo1: {
                            type: "tm.display.Label",
                            init: ["combo x1", 20],
                            align: "left",
                            baseline: "middle",
                            x: cannon.SC_W * 0.3,
                            y: cannon.SC_H * 0.2,
                        },
                        combo2: {
                            type: "tm.display.Label",
                            init: ["combo x2", 20],
                            align: "left",
                            baseline: "middle",
                            x: cannon.SC_W * 0.3,
                            y: cannon.SC_H * 0.25,
                        },
                        combo3: {
                            type: "tm.display.Label",
                            init: ["combo x4", 20],
                            align: "left",
                            baseline: "middle",
                            x: cannon.SC_W * 0.3,
                            y: cannon.SC_H * 0.3,
                        },
                        combo4: {
                            type: "tm.display.Label",
                            init: ["combo x8", 20],
                            align: "left",
                            baseline: "middle",
                            x: cannon.SC_W * 0.3,
                            y: cannon.SC_H * 0.35,
                        },
                        combo5: {
                            type: "tm.display.Label",
                            init: ["combo x16", 20],
                            align: "left",
                            baseline: "middle",
                            x: cannon.SC_W * 0.3,
                            y: cannon.SC_H * 0.4,
                        },
                        combo6: {
                            type: "tm.display.Label",
                            init: ["combo x32", 20],
                            align: "left",
                            baseline: "middle",
                            x: cannon.SC_W * 0.3,
                            y: cannon.SC_H * 0.45,
                        },
                        bonus: {
                            type: "tm.display.Label",
                            init: ["bonus", 30],
                            align: "center",
                            baseline: "middle",
                            x: cannon.SC_W * 0.5,
                            y: cannon.SC_H * 0.55,
                        },
                        bossBattleTime: {
                            type: "tm.display.Label",
                            init: ["boss battle time", 20],
                            align: "left",
                            baseline: "middle",
                            x: cannon.SC_W * 0.3,
                            y: cannon.SC_H * 0.65,
                        },
                        perfect: {
                            type: "tm.display.Label",
                            init: ["100% destroy", 20],
                            align: "left",
                            baseline: "middle",
                            x: cannon.SC_W * 0.3,
                            y: cannon.SC_H * 0.7,
                        },
                        noMiss: {
                            type: "tm.display.Label",
                            init: ["no miss", 20],
                            align: "left",
                            baseline: "middle",
                            x: cannon.SC_W * 0.3,
                            y: cannon.SC_H * 0.75,
                        },
                        score: {
                            type: "tm.display.Label",
                            init: ["score", 20],
                            align: "left",
                            baseline: "middle",
                            x: cannon.SC_W * 0.3,
                            y: cannon.SC_H * 0.85,
                        },
                    },
                },
                values: {
                    type: "tm.display.CanvasElement",
                    children: {
                        combo1: {
                            type: "tm.display.Label",
                            init: ["" + (clearData.comboCount[0]), 20],
                            align: "right",
                            fontFamily: "ShareTechMono",
                            baseline: "middle",
                            x: cannon.SC_W * 0.7,
                            y: cannon.SC_H * 0.2,
                        },
                        combo2: {
                            type: "tm.display.Label",
                            init: ["" + (clearData.comboCount[1]), 20],
                            align: "right",
                            fontFamily: "ShareTechMono",
                            baseline: "middle",
                            x: cannon.SC_W * 0.7,
                            y: cannon.SC_H * 0.25,
                        },
                        combo3: {
                            type: "tm.display.Label",
                            init: ["" + (clearData.comboCount[2]), 20],
                            align: "right",
                            fontFamily: "ShareTechMono",
                            baseline: "middle",
                            x: cannon.SC_W * 0.7,
                            y: cannon.SC_H * 0.3,
                        },
                        combo4: {
                            type: "tm.display.Label",
                            init: ["" + (clearData.comboCount[3]), 20],
                            align: "right",
                            fontFamily: "ShareTechMono",
                            baseline: "middle",
                            x: cannon.SC_W * 0.7,
                            y: cannon.SC_H * 0.35,
                        },
                        combo5: {
                            type: "tm.display.Label",
                            init: ["" + (clearData.comboCount[4]), 20],
                            align: "right",
                            fontFamily: "ShareTechMono",
                            baseline: "middle",
                            x: cannon.SC_W * 0.7,
                            y: cannon.SC_H * 0.4,
                        },
                        combo6: {
                            type: "tm.display.Label",
                            init: ["" + (clearData.comboCount[5]), 20],
                            align: "right",
                            fontFamily: "ShareTechMono",
                            baseline: "middle",
                            x: cannon.SC_W * 0.7,
                            y: cannon.SC_H * 0.45,
                        },
                        bossBattleTime: {
                            type: "tm.display.Label",
                            init: ["", 20],
                            align: "right",
                            fontFamily: "ShareTechMono",
                            baseline: "middle",
                            x: cannon.SC_W * 0.7,
                            y: cannon.SC_H * 0.65,
                            onenterframe: function(){ this.text = "" + Math.floor(scene.bossBattleTime) },
                        },
                        perfect: {
                            type: "tm.display.Label",
                            init: ["", 20],
                            align: "right",
                            fontFamily: "ShareTechMono",
                            baseline: "middle",
                            x: cannon.SC_W * 0.7,
                            y: cannon.SC_H * 0.7,
                            onenterframe: function(){ this.text = "" + Math.floor(scene.perfectBonus) },
                        },
                        noMiss: {
                            type: "tm.display.Label",
                            init: ["", 20],
                            align: "right",
                            fontFamily: "ShareTechMono",
                            baseline: "middle",
                            x: cannon.SC_W * 0.7,
                            y: cannon.SC_H * 0.75,
                            onenterframe: function(){ this.text = "" + Math.floor(scene.noMissBonus) },
                        },
                        score: {
                            type: "tm.display.Label",
                            init: ["", 20],
                            align: "right",
                            fontFamily: "ShareTechMono",
                            baseline: "middle",
                            x: cannon.SC_W * 0.7,
                            y: cannon.SC_H * 0.85,
                            onenterframe: function(){ this.text = "" + Math.floor(scene.score) },
                        },
                    },
                },
            },
        });

        this.tweener.clear()
            .wait(1000)
            .to({
                bossBattleTime: 0,
                score: this.score + this.bossBattleTime,
            }, 2000)
            .to({
                perfectBonus: 0,
                score: this.score + this.bossBattleTime + this.perfectBonus,
            }, 2000)
            .to({
                noMissBonus: 0,
                score: this.score + this.bossBattleTime + this.perfectBonus + this.noMissBonus,
            }, 2000);

        this.on("enterframe", function() {
            clearData.gameData.score = this.score;
        });
    },

    update: function() {
    },
});
