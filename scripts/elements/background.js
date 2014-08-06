tm.define("cannon.Background", {
    superClass: "tm.display.CanvasElement",

    init: function() {
        this.superInit();

        var s = 2;

        var that = this;
        Array.range(0, 3).forEach(function(index) {
            tm.display.Sprite("test")
                .setScale(s, 2)
                .setPosition(160 * s * index, cannon.SC_H * 0.5)
                .setAlpha(0.4)
                .addChildTo(that);
        });

        this.scroll = 0;
    },

    update: function() {
        this.x = -this.scroll;
    }
});
