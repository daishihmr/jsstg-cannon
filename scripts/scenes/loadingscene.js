tm.define("cannon.LoadingScene", {
    superClass: "tm.ui.LoadingScene",

    init: function() {
        this.superInit.apply(this, arguments);

        this.stage.bg.canvas.setFillStyle("black").fillRect(0, 0, cannon.SC_W, cannon.SC_H);

        for (var i = 0; i < 10; i++) {
            this._createHiyoko(this.param)
                .setPosition(Math.rand(0, cannon.SC_W), Math.rand(0, cannon.SC_H))
                .addChildTo(this.stage.piyoLayer);
        }
    },

    _createHiyoko: function(param) {
        // 蒼いひよこさん
        var piyo = tm.display.Shape(84, 84);
        piyo.x = tm.util.Random.randint(0, param.width);
        piyo.y = tm.util.Random.randint(0, param.height);
        piyo.canvas.setColorStyle("white", tm.graphics.RadialGradient(42, 42, 0, 42, 42, 32).addColorStopList([
            { offset: 0.0, color: "hsla(200,100%, 80%, 1.0)" },
            { offset: 0.5, color: "hsla(200,100%, 80%, 1.0)" },
            { offset: 1.0, color: "hsla(200,100%, 70%, 0.0)" },
        ]).toStyle()).fillCircle(42, 42, 32);
        piyo.canvas.setColorStyle("white", "black").fillCircle(27, 27, 2);
        piyo.canvas.setColorStyle("white", "brown").fillRect(40, 70, 4, 15).fillTriangle(0, 40, 11, 35, 11, 45);
        piyo.dir = tm.geom.Vector2.random(0, 360, 4);
        var rect = tm.geom.Rect(0, 0, param.width, param.height);
        rect.padding(42);
        piyo.update = function(app) {
            this.position.add(this.dir);

            if (this.x < rect.left) {
                this.x = rect.left;
                this.dir.x*=-1;
            }
            else if (this.x > rect.right) {
                this.x = rect.right;
                this.dir.x*=-1;
            }
            if (this.y < rect.top) {
                this.y = rect.top;
                this.dir.y*=-1;
            }
            else if (this.y > rect.bottom) {
                this.y = rect.bottom;
                this.dir.y*=-1;
            }

            if (this.dir.x<0) {
                this.rotation -= 7;
                this.scaleX = 1;
            }
            else {
                this.rotation += 7;
                this.scaleX = -1;
            }

            // // 向き更新
            // if (app.pointing.getPointingStart()) {
            //     var p = app.pointing.position;
            //     var v = tm.geom.Vector2.sub(p, this.position);
            //     this.dir = v.normalize().mul(4);
            // }

        };

        return piyo;
    },
});
