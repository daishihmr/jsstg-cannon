tm.define("cannon.Terrain", {
    superClass: "tm.display.CanvasElement",
    init: function(data) {
        this.superInit();
        this.setOrigin(0, 0);

        this.lines = [];
        for (var i = 0, len = data.lines.length; i < len; i++) {
            this.lines.push({
                a: tm.geom.Vector2(data.lines[i][0], data.lines[i][1]),
                b: tm.geom.Vector2(data.lines[i][2], data.lines[i][3]),
            });
        }

        this.scroll = 0;
        this.strokeStyle = "hsl(30, 80%, 80%)";

        var that = this;
        this.s = tm.display.Sprite(data.texture, 8000, 640)
            .setOrigin(0, 0)
            .setPosition(0, 0)
            .addChildTo(this)
            .on("enterframe", function() {
                this.x = -that.scroll;
            });
    },

    // draw: function(canvas) {
    //     var context = canvas;
    //     var lines = this.lines;
    //     var scroll = this.scroll;

    //     context.lineWidth = 2;

    //     context.beginPath();
    //     for (var i = 0, len = lines.length; i < len; i++) {
    //         var line = lines[i];
    //         var a = line.a;
    //         var b = line.b;

    //         if (0 <= a.x - scroll && a.x - scroll < cannon.SC_W || 0 <= b.x - scroll && b.x - scroll < cannon.SC_W) {
    //             context.moveTo(a.x - scroll, a.y);
    //             context.lineTo(b.x - scroll, b.y);
    //         }
    //     }
    //     context.stroke();
    // },

    isHit: function(target) {
        var c = {
            x: target.x + this.scroll,
            y: target.y,
            radius: target.radius,
        };
        var lines = this.lines;
        var scroll = this.scroll;
        for (var i = 0, len = lines.length; i < len; i++) {
            var line = lines[i];
            var a = line.a;
            var b = line.b;

            if (0 <= a.x - scroll && a.x - scroll < cannon.SC_W || 0 <= b.x - scroll && b.x - scroll < cannon.SC_W) {
                if (cannon.CollisionHelper.isHitCircleLine(c, line)) {
                    return true;
                }
            }
        }
        return false;
    },

});
