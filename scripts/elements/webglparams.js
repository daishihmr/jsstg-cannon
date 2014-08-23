tm.define("cannon.WebGLParams", {
    superClass: "tm.app.Element",

    init: function() {
        this.superInit();
        this._worldMatrix = tm.geom.Matrix44();

        this.quake = 0.0;

        this.labelAreaHeight = 0.0;

        this.strength = 0.0;
        this.centerOffset = [100, 100];

        this.lightRadius = 0.0;
    },

});
