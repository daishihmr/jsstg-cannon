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
                terrainLayer: {
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
    }
});
