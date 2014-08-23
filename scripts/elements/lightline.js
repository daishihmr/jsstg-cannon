tm.define("cannon.LightLine", {
    superClass: "tm.display.Shape",

    init: function() {
        var height = Math.rand(10, 30);
        this.superInit(200, height);
        this.canvas
            .setFillStyle(tm.graphics.RadialGradient(0, height * 0.5, 0, 0, height * 0.5, 200).addColorStopList([
                { offset: 0.0,                  color: "hsla(160, 100%, 95%, 0.0)" },
                { offset: Math.randf(0.1, 0.3), color: "hsla(160, 100%, 95%, 1.0)" },
                { offset: 1.0,                  color: "hsla(160, 100%, 95%, 0.0)" },
            ]).toStyle())
            .fillTriangle(0, height * 0.5, 200, 0, 200, height);

        this
            .setOrigin(0, 0.5)
            .setRotation(Math.rand(0, 360))
            .setBlendMode("lighter")
            .setAlpha(0.0)
            .setScale(Math.randf(0.1, 0.2));

        this.on("added", function() {
            this.tweener
                .wait(Math.rand(200, 1000))
                .by({
                    alpha: 1.0,
                    scaleX: 2.6,
                    scaleY: 2.6,
                    rotation: Math.rand(-180, 180),
                }, 5000, "easeOutQuart");
        });
    },
});
