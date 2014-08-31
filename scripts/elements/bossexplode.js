tm.define("cannon.BossExplode", {
    superClass: "tm.display.CanvasElement",

    init: function(x, y) {
        this.superInit();
        this.setPosition(x, y).setBlendMode("lighter");
        var size = 1000;
        this.fromJSON({
            children: [
                {
                    type: "tm.display.CircleShape",
                    init: [size, size, {
                        fillStyle: tm.graphics.RadialGradient(size/2, size/2, 0, size/2, size/2, size/2).addColorStopList(
                            Array.range(0, 60).map(function(i) {
                                return {
                                    offset: i / 60,
                                    color: "rgba(255, 255, 255, {0})".format(Math.pow(0.9, i))
                                };
                            })
                        ).toStyle(),
                        strokeStyle: "transparent",
                    }],
                },
            ],
        });

        this.setScale(0.1);
        this.tweener.to({
            scaleX: 60,
            scaleY: 60,
        }, 9000, "easeOutQuad");
    },
});
