tm.define("cannon.GameScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        this.fromJSON({
            children: {
                backgroundLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                        bg: {
                            type: "cannon.Background"
                        },
                    },
                },
                terrainLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                        ceil: {
                            type: "cannon.Terrain",
                            init: [CEIL],
                        },
                        floor: {
                            type: "cannon.Terrain",
                            init: [FLOOR],
                        },
                    },
                },
                playerLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                        player: {
                            type: "cannon.Fighter",
                            scene: this,
                        },
                    },
                },
                enemyLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                    },
                },
                bulletLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                    },
                },
            },
        });

        this.player = this.playerLayer.player;
    },

    update: function(app) {
        var player = this.player;

        this.terrainLayer.children.forEach(function(t){
            t.scroll += 1;
        });

        // terrain vs player
        if (this.terrainLayer.children.some(function(t) {
            return t.isHit(player);
        })) {
            player.damage();
        }
    },
});

var CEIL = [
    0,
    100,
    120,
    90,
    120,
    120,
    90,
    120,
    120,
    90,
    120,
    120,
    90,
    120,
    120,
    500,
];
var FLOOR = [
    500,
    600,
    620,
    490,
    520,
    520,
    690,
    620,
    620,
    690,
    620,
    620,
    690,
    620,
    620,
    700,
];
