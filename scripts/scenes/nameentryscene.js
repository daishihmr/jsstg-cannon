tm.define("cannon.NameEntryScene", {
    superClass: "tm.app.Scene",

    init: function(score) {
        this.superInit();
        this.fromJSON({
            children: {
                label: {
                    type: "tm.display.Label",
                    init: "name entry",
                    x: cannon.SC_W * 0.5,
                    y: cannon.SC_H * 0.5,
                },
            },
        });
    }
});
