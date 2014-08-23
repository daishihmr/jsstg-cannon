tm.define("cannon.EndingScene", {
    superClass: "tm.app.Scene",

    init: function(score) {
        this.superInit();

        this.fromJSON({
            children: {
                label: {
                    type: "tm.display.Label",
                    init: "ending",
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * 0.5,
                },
            },
        });
    }
});
