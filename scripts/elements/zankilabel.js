tm.define("cannon.ZankiLabel", {
    superClass: "tm.display.CanvasElement",

    init: function() {
        this.superInit();
        this.fromJSON({
            children: Array.range(0, cannon.ZANKI_MAX).map(function(i) {
                return {
                    type: "tm.display.Sprite",
                    init: ["fighter", 128, 64],
                    scaleX: 0.5, scaleY: 0.5,
                    x: 64 * i,
                    frameIndex: 6,
                }
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
