tm.define("cannon.Application", {
    superClass: "tm.display.CanvasApp",

    init: function(canvasId) {
        this.superInit(canvasId);
        this.keyboard.element.addEventListener("keydown", function(e){
            if (37 <= e.keyCode && e.keyCode <= 40 || e.keyCode === 32) e.preventDefault();
        }, false);

        this.canvas.imageSmoothingEnabled = true;
    }
});
