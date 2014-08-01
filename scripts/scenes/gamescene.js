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
        var terrains = this.terrainLayer.children;

        terrains.forEach(function(t){
            t.scroll += 1;
        });

        // terrain vs player
        if (terrains.some(function(t) { return t.isHit(player) })) {
            player.damage();
        }

        // terrain vs shot
        cannon.Shot.ACTIVES.forEach(function(shot) {
            if (terrains.some(function(t) { return t.isHit(shot) })) {
                shot.damage();
            }
        });
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
