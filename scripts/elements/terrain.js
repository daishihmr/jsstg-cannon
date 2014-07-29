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

            context.moveTo(line.a.x - scroll, line.a.y);
            context.lineTo(line.b.x - scroll, line.b.y);
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
        for (var i = 0, len = lines.length; i < len; i++) {
            var line = lines[i];
            if (line.a.x < c.x - c.radius && c.x + c.radius < line.b.x && cannon.CollisionHelper.isHitCircleLine(c, line)) {
                return true;
            }
        }
        return false;
    },

});
