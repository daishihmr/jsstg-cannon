tm.define("cannon.PauseScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        this.fromJSON({
            children: {
                bg: {
                    type: "tm.display.RectangleShape",
                    init: [cannon.SC_W, cannon.SC_H, {
                        fillStyle: "rgba(0, 0, 0, 0.8)",
                        strokeStyle: "transparent",
                    }],
                    originX: 0, originY: 0,
                },
                title: {
                    type: "tm.display.Label",
                    init: ["pause", 40],
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * 0.5,
                },
            },
        });
    },

    update: function(app) {
        var kb = app.keyboard;
        if (kb.getKeyDown("space")) {
            this.app.popScene();
        }
    },
});
