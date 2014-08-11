tm.define("cannon.Background", {
    superClass: "tm.display.CanvasElement",

    init: function(data) {
        this.superInit();

        var that = this;
        Array.range(0, 3).forEach(function(index) {
            var panel = tm.display.Sprite(data.texture, cannon.SC_H, cannon.SC_H)
                .setOrigin(0, 0)
                .setPosition(cannon.SC_H * index, 0)
                .addChildTo(that);
            panel.index = index;
        });

        this.scroll = 0;
    },

    update: function() {
        var scroll = this.scroll;
        var width = cannon.SC_H;
        this.children.forEach(function(panel) {
            panel.x = -scroll % width + width * panel.index;
        });
    }
});
