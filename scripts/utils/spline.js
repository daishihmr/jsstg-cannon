cannon.spline = function(points, duration) {
    var spline = new Spline({
        points: points,
        duration: duration,
    });
    var ret = [];
    for (var i = 0; i < duration; i++) {
        ret.push(spline.pos(i));
    }
    return ret;
};
