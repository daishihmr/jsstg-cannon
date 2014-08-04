tm.define("cannon.Terrain", {
    superClass: "tm.display.CanvasElement",
    init: function(data) {
        this.superInit();
        this.setOrigin(0, 0);

        this.lines = [];
        for (var i = 0, len = data.length; i < len; i++) {
            this.lines.push({
                a: tm.geom.Vector2(100 * i, data[i]),
                b: tm.geom.Vector2(100 * (i + 1), data[i + 1]),
            });
        }

        this.scroll = 0;
        this.strokeStyle = "hsl(30, 80%, 80%)";
    },

    draw: function(canvas) {
        var context = canvas;
        var lines = this.lines;
        var scroll = this.scroll;

        context.lineWidth = 2;

        context.beginPath();
        for (var i = 0, len = lines.length; i < len; i++) {
            var line = lines[i];
            var a = line.a;
            var b = line.b;

            if (0 <= a.x - scroll && a.x - scroll < cannon.SC_W || 0 <= b.x - scroll && b.x - scroll < cannon.SC_W) {
                context.moveTo(a.x - scroll, a.y);
                context.lineTo(b.x - scroll, b.y);
            }
        }
        context.stroke();
    },

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
