tm.define("cannon.CountDownLabel", {
    superClass: "tm.display.Label",

    time: 0,

    init: function(ms) {
        this.superInit("1:00.00", 35);
        this
            .setAlign("right")
            .setBaseline("top")
            .setFillStyle("white")
            .setFontFamily("ShareTechMono");

        this.counting = false;
        this.time = ms;
    },

    start: function(ms) {
        this.time = ms || 60 * 1000;
        this.last = Date.now();
        this.counting = true;
    },
    stop: function() {
        this.counting = false;
    },

    update: function() {
        if (this.counting) {
            var now = Date.now();
            this.time -= now - this.last;
            this.last = now;

            if (this.time < 0) {
                this.time = 0;
                this.counting = false;
                this.flare("timeup");
            }
        }

        var min = Math.floor(this.time / (60 * 1000));
        var ms = (this.time - min * (60 * 1000)) / 1000;
        var s = Math.floor(ms * 100) / 100;
        var ss = "" + s;
        if (ss.split(".").length === 1) {
            ss = ss + ".00";
        } else if (ss.split(".")[1].length === 1) {
            ss = ss + "0";
        }
        if (ss.length === 4) {
            ss = "0" + ss;
        }

        this.text = "{0}:{1}".format(min, ss);
    }
});
