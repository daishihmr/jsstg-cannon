tm.define("cannon.WebGLParams", {
    superClass: "tm.app.Element",

    init: function() {
        this.superInit();
        this._worldMatrix = tm.geom.Matrix44();

        this.labelAreaHeight = 0.0;
    },

});
