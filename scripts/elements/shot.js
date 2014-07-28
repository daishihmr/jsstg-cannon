tm.define("cannon.Shot", {
    superClass: "tm.display.Sprite",

    init: function() {
        this.superInit("shot");
        this.setScale(3.0);
    },

    update: function() {
        this.x += cannon.SHOT_SPEED;
    },
});
