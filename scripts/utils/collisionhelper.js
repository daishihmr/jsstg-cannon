cannon.CollisionHelper = {

    isHitCircleLine: function(circle, line) {
        var Vec2 = tm.geom.Vector2;
        var s = line.s || (line.s = Vec2.sub(line.b, line.a));
        var a = Vec2.sub(circle, line.a);
        var b = Vec2.sub(circle, line.b);
        var radSq = circle.radius * circle.radius;
        
        if (a.lengthSquared() <= radSq || b.lengthSquared() <= radSq) {
            return true;
        } else {
            if (Math.abs(Vec2.cross(s, a)) / s.length() > circle.radius) {
                return false;
            } else {
                return Vec2.dot(a, s) * Vec2.dot(b, s) <= 0;
            }
        }
    },

};
