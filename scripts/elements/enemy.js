tm.define("Enemy", {
    superClass: "tm.display.Sprite",

    init: function(texture) {
        this.superInit(texture);
        this.setBoundingType("circle");
        this.radius = this.width * 0.3;

        this.hp = 5;
    },

    damage: function(damage) {

    }

});
