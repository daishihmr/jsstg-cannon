cannon.ATTACK_DATA = {};

(function() {

var action = bulletml.dsl.action;
var actionRef = bulletml.dsl.actionRef;
var bullet = bulletml.dsl.bullet;
var bulletRef = bulletml.dsl.bulletRef;
var fire = bulletml.dsl.fire;
var fireRef = bulletml.dsl.fireRef;
var changeDirection = bulletml.dsl.changeDirection;
var changeSpeed = bulletml.dsl.changeSpeed;
var accel = bulletml.dsl.accel;
var wait = bulletml.dsl.wait;
var vanish = bulletml.dsl.vanish;
var repeat = bulletml.dsl.repeat;
var bindVar = bulletml.dsl.bindVar;
var notify = bulletml.dsl.notify;
var direction = bulletml.dsl.direction;
var speed = bulletml.dsl.speed;
var horizontal = bulletml.dsl.horizontal;
var vertical = bulletml.dsl.vertical;
var fireOption = bulletml.dsl.fireOption;
var offsetX = bulletml.dsl.offsetX;
var offsetY = bulletml.dsl.offsetY;
var autonomy = bulletml.dsl.autonomy;

var spd = function(v){ return speed("{0} * 3 * (1 + Math.sqrt($rank) * 2)".format(v)) };
var interval = function(v){ return wait("{0} / (1 + Math.sqrt($rank))".format(v)) };

for (var i = 0; i < 5; i++) {

    cannon.ATTACK_DATA["simpleA{0}".format(i)] = new bulletml.Root({
        "top": action([
            interval(250 + i * 5),
            repeat(999, [
                fire(spd(1), bullet()),
                interval(300),
            ]),
        ]),
    });

    cannon.ATTACK_DATA["simpleB{0}".format(i)] = new bulletml.Root({
        "top": action([
            interval(250 + i * 5),
            repeat(999, [
                fire(spd(1), bullet()),
                repeat(3, [
                    fire(direction(0, "sequence"), spd(1), bullet()),
                    wait(5),
                ]),
                interval(300),
            ]),
        ]),
    });

    cannon.ATTACK_DATA["around{0}".format(i)] = new bulletml.Root({
        "top": action([
            interval(250 + i * 5),
            repeat(999, [
                repeat(10, [
                    fire(direction(360/10, "sequence"), spd(0.8), bullet()),
                ]),
                interval(300),
            ]),
        ]),
    });

}

cannon.ATTACK_DATA["horizontal2"] = new bulletml.Root({
    "top": action([
        repeat(999, [
            interval(130),
            repeat(6, [
                fire(direction( -90, "absolute"), spd(1.5), bullet({color: 1}), offsetY(-20)),
                fire(direction( -90, "absolute"), spd(1.5), bullet({color: 1}), offsetY(+20)),
                wait(3),
            ]),
        ]),
    ]),
});

cannon.ATTACK_DATA["4way"] = new bulletml.Root({
    "top": action([
        repeat(999, [
            interval(130),
            repeat(2, [
                fire(direction(-45), spd(1.5), bullet({color: 2})),
                fire(direction(-15), spd(1.5), bullet({color: 2})),
                fire(direction( 15), spd(1.5), bullet({color: 2})),
                fire(direction( 45), spd(1.5), bullet({color: 2})),
                wait(50),
            ]),
        ]),
    ]),
});

})();

