tm.define("cannon.Background", {
    superClass: "tm.display.CanvasElement",

    init: function() {
        this.superInit();

        this.fromJSON({
            children: {
                bg: {
                    type: "tm.display.Sprite",
                    init: tm.graphics.Canvas()
                        .resize(cannon.SC_W, cannon.SC_H)
                        .setFillStyle("black")
                        .fillRect(0, 0, cannon.SC_W, cannon.SC_H),
                    originX: 0, originY: 0,
                },
            },
        });
    },
});
