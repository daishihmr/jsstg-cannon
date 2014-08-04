/*
 * bezier.js
 */

tm.geom = tm.geom || {};

(function() {

tm.define("tm.geom.Bezier", {

    /**
     * 曲線の各頂点 [[x0, y0], [x1, y1], [x2, y2], ...]
     * @type <Array.<number>>
     */
    vertices: null,

    /**
     * @param {Array.<Array.<number>>} points 制御点の配列 [[x0, y0], [x1, y1], [x2, y2], ...]
     * @param {number=} split 分割数(デフォルト:10)
     */
    init: function(points, split) {
        split = split || 10;

        this.vertices = [];
        for (var i = 0; i <= split; i++) {
            var v = tm.geom.Bezier.getPointOnCurve(points, i / split);
            this.vertices.push([v[0], v[1]]);
        }
    }

});

/**
 * 制御点とrateから、ベジェ曲線上の点を算出する。長さ2の数値配列[x, y]を返す。
 *
 * @param {Array.<Array.<number>>} points 制御点の配列 [[x0, y0], [x1, y1], [x2, y2], ...]
 * @param {number} rate 0から1へ変化する
 * @return Array,<number>
 */
tm.geom.Bezier.getPointOnCurve = function(points, rate) {
    while (points.length > 1) {
        var temp = [];
        for (var i = 0, count = points.length - 1; i < count; i++) {
            temp[i] = [
                points[i][0] + (points[i + 1][0] - points[i][0]) * rate,
                points[i][1] + (points[i + 1][1] - points[i][1]) * rate,
            ];
        }

        points = temp;
    }
    return points[0];
};

// 再帰版
// tm.geom.Bezier.getPointOnCurve = function(points, rate) {
//     return points.length <= 1 ? points[0] : tm.geom.Bezier.getPointOnCurve(points.slice(0, points.length - 1).map(function(vi, i) {
//         return vi.map(function(vj, j) {
//             return vj + (points[i + 1][j] - vj) * rate;
//         });
//     }), rate);
// };

})();

