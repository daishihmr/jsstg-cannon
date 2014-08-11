tm.define("cannon.ZankiLabel", {
    superClass: "tm.display.CanvasElement",

    init: function() {
        this.superInit();
        this.fromJSON({
            children: Array.range(0, cannon.ZANKI_MAX).map(function(i) {
                return {
                    type: "tm.display.CanvasElement",
                    x: 64 * i,
                    children: [
                        {
                            type: "tm.display.RoundRectangleShape",
                            init: [128 * 0.4, 128 * 0.4, {
                                fillStyle: "rgba(255, 255, 255, 0.1)",
                                strokeStyle: "transparent",
                            }],
                            blendMode: "lighter",
                        },
                        {
                            type: "tm.display.Sprite",
                            init: ["fighter", 128, 64],
                            scaleX: 0.4, scaleY: 0.4,
                            frameIndex: 6,
                            blendMode: "lighter",
                        },
                    ],
                };
            }),
        });

        this.setZanki(0);
    },

    setZanki: function(v) {
        this.children.forEach(function(c, i) {
            c.visible = i < v - 1;
        });
    },
});
