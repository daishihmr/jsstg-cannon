cannon.STAGE_DATA = [];
(function() {
// 1面

var wait = function(v){ return { type: "wait", value: v } };

var enemy3 = function(x, y, initialDirection) {
    return {
        type: "enemy",
        attack: "simpleA{5}",
        enemyType: 3,
        motionType: "homing",
        data: { x: x, y: y, initialDirection: initialDirection, speed: 3, homing: 0.001 },
    };
};

var enemy4 = function(y) {
    return {
        type: "enemy",
        attack: "4way",
        enemyType: 4,
        motionType: "horizontal",
        data: { x:1060, y:y, vx:-1.4 },
    };
};

var enemy5 = function(y) {
    return {
        type: "enemy",
        attack: "horizontal2",
        enemyType: 5,
        motionType: "horizontal",
        data: { x:1060, y:y, vx:-1.4 },
    };
};

var enemy6f = function(x, y, vx) {
    return {
        type: "enemy",
        attack: "simpleB{5}",
        enemyType: 6,
        motionType: "run",
        data: { x:x, y:y, vx:vx, g:6 },
    };
};
var enemy6c = function(x, y, vx) {
    return {
        type: "enemy",
        attack: "simpleB{5}",
        enemyType: 6,
        motionType: "run",
        data: { x:x, y:y, vx:vx, g:-6 },
    };
};

var enemy13f = function(x, y, vx) {
    return {
        type: "enemy",
        attack: "around{5}",
        enemyType: 13,
        motionType: "jump",
        data: { x:x, y:y, vx:vx, vy:-12, g:0.3 },
    };
};
var enemy13c = function(x, y, vx) {
    return {
        type: "enemy",
        attack: "around{5}",
        enemyType: 13,
        motionType: "jump",
        data: { x:x, y:y, vx:vx, vy:+12, g:-0.3 },
    };
};

var enemy7 = function(v) {
    var route;
    switch (v) {
    case 0:
        route = cannon.spline([{ x:320, y:-100 },{ x:100, y:320 },{ x:320, y:540 },{ x:760, y:540 }, {x:860, y:320}, {x:480, y:320}, {x:-100, y:320}], 100);
        break;
    case 1:
        route = cannon.spline([{ x:640, y:-100 },{ x:860, y:320 },{ x:640, y:540 },{ x:200, y:540 }, {x:100, y:320}, {x:480, y:320}, {x:1060, y:320}], 100);
        break;
    }
    return {
        type: "enemy",
        attack: null,
        enemyType: 7,
        motionType: "route",
        data: route,
    };
};

var enemy8 = function(v) {
    var route;
    switch (v) {
    case 0:
        route = cannon.spline([{ x:900, y:-100 },{ x:900, y:600 },{ x:600, y:270 },{ x:-200, y:270 }], 60);
        break;
    case 1:
        route = cannon.spline([{ x:900, y:760 },{ x:900, y:40 },{ x:600, y:370 },{ x:-200, y:370 }], 60);
        break;
    case 2:
        route = cannon.spline([{ x:900, y:-100 },{ x:900, y:600 },{ x:600, y:315 },{ x:-200, y:315 }], 60);
        break;
    case 3:
        route = cannon.spline([{ x:900, y:760 },{ x:900, y:40 },{ x:600, y:325 },{ x:-200, y:325 }], 60);
        break;
    case 4:
        route = cannon.spline([{ x:60, y:-100 },{ x:60, y:600 },{ x:360, y:270 },{ x:1160, y:270 }], 60);
        break;
    case 5:
        route = cannon.spline([{ x:60, y:760 },{ x:60, y:40 },{ x:360, y:370 },{ x:1160, y:370 }], 60);
        break;
    }
    return {
        type: "enemy",
        attack: null,
        enemyType: 8,
        motionType: "route",
        data: route,
    };
};

var enemy10 = function(x, y, i) {
    return {
        type: "enemy",
        attack: "simpleA{5}",
        enemyType: 10,
        motionType: "sine",
        data: { x:x, y:y, vx:-2, ia:Math.PI*i, va:0.04, r:120 }
    };
};

cannon.STAGE_DATA[0] = {
    assets: {
        "terrain/stage1": "images/terrainStage1.png",
        "background/stage1": "images/backgroundStage1.png",
        "bgm/stage1": "sounds/nc67883.mp3",
    },
    bgm: "bgm/stage1",
    bgmLoopRange: [14.142, 151.285],
    background: {
        texture: "background/stage1",
    },
    terrain: {
        texture: "terrain/stage1",
        lines: [[383,-12,434,1],[433,-1,520,4],[520,4,656,-1],[656,-1,815,6],[815,6,986,-2],[1356,-6,1471,60],[1471,60,1496,59],[1496,59,1558,19],[1558,19,1661,-8],[1810,-8,1845,39],[1845,39,1885,14],[1885,14,1887,-12],[2180,-4,2209,13],[2209,13,2257,10],[2257,10,2271,16],[2271,16,2313,20],[2313,20,2337,12],[2337,12,2419,22],[2419,22,2447,31],[2447,31,2463,42],[2463,42,2553,43],[2552,43,2596,44],[2596,44,2633,36],[2633,36,2786,41],[2786,41,2847,43],[2847,43,2934,39],[2934,39,2997,42],[2997,42,3060,33],[3060,34,3242,25],[3241,23,3324,30],[3324,29,3392,18],[3392,18,3496,33],[3496,33,3554,34],[3554,34,3626,60],[3626,60,3678,75],[3674,73,3756,42],[3756,42,3912,23],[3912,23,4018,33],[4018,33,4102,39],[4102,39,4186,79],[4186,79,4242,87],[4238,89,4337,62],[4337,61,4442,56],[4442,56,4580,38],[4579,35,4612,43],[4612,43,4867,29],[4867,29,4880,23],[4880,23,5117,44],[5116,43,5245,27],[5245,27,5470,47],[5470,47,5558,31],[5558,31,5713,39],[5713,39,5742,33],[5742,33,5939,53],[5939,50,6166,61],[6166,61,6277,58],[6277,58,6426,54],[6426,53,6495,43],[6495,43,6648,55],[6648,55,6777,97],[6775,96,6902,160],[6902,161,6953,121],[6953,121,7058,57],[7058,57,7239,-6],[1848,665,1860,630],[1860,630,1936,632],[1934,630,1956,627],[1956,627,2058,623],[2058,623,2102,615],[2102,615,2188,609],[2188,609,2370,608],[2370,609,2607,622],[2607,622,2818,627],[2822,627,2909,611],[2909,610,3140,630],[3137,630,3232,615],[3232,615,3428,633],[3428,633,3766,614],[3765,614,3792,620],[3791,620,3943,602],[3942,602,4006,606],[4005,606,4138,567],[4137,564,4147,573],[4147,573,4204,580],[4203,579,4257,610],[4257,610,4428,634],[4430,633,4545,627],[4549,627,4611,619],[4611,619,4703,584],[4706,582,4802,618],[4802,618,4974,635],[4973,635,5057,630],[5056,629,5131,633],[5131,633,5339,623],[5338,623,5531,614],[5539,612,5585,615],[5589,617,5710,619],[5711,619,5818,611],[5818,611,5916,606],[5912,607,5928,615],[5927,615,5990,626],[5990,626,6158,624],[6158,624,6164,610],[6164,610,6203,630],[6203,630,6331,633],[6331,633,6356,626],[6356,626,6366,641],[6366,641,6470,621],[6470,621,6525,563],[6526,563,6536,563],[6536,563,6571,601],[6574,601,6630,618],[6638,619,6704,604],[6704,604,6824,550],[6824,550,6880,510],[6878,509,6917,513],[6915,512,7008,570],[7008,570,7109,611],[7109,611,7135,608],[7135,608,7170,630],[7170,630,7211,626],[7211,626,7305,641],[7305,641,7333,633],[7333,633,7394,657]],
    },
    scrollSpeed: 1,
    stageStep: [
        wait(100),

        wait(100),
        enemy8(0),
        wait(10),
        enemy8(0),
        wait(10),
        enemy8(0),
        wait(10),
        enemy8(0),
        wait(10),
        enemy8(0),

        wait(150),
        enemy8(1),
        wait(10),
        enemy8(1),
        wait(10),
        enemy8(1),
        wait(10),
        enemy8(1),
        wait(10),
        enemy8(1),

        wait(150),
        enemy8(0),
        wait(10),
        enemy8(0),
        wait(10),
        enemy8(0),
        wait(10),
        enemy8(0),
        wait(10),
        enemy8(0),

        wait(150),
        enemy8(1),
        wait(10),
        enemy8(1),
        wait(10),
        enemy8(1),
        wait(10),
        enemy8(1),
        wait(10),
        enemy8(1),

        wait(250),
        enemy8(2),
        enemy8(3),
        wait(10),
        enemy8(2),
        enemy8(3),
        wait(10),
        enemy8(2),
        enemy8(3),
        wait(10),
        enemy8(2),
        enemy8(3),
        wait(10),
        enemy8(2),
        enemy8(3),

        enemy6f(1060, 480,-2),
        enemy6c(-100, 160, 2),

        wait(200),
        enemy4(160),
        enemy4(480),

        wait(200),
        enemy10(1060, 270, 0),
        enemy10(1160, 270, 1),
        enemy10(1260, 270, 0),
        enemy10(1360, 270, 1),

        enemy6c(1060, 160,-2),
        enemy6f(-100, 480, 2),

        wait(200),
        enemy10(1060, 370, 0),
        enemy10(1160, 370, 1),
        enemy10(1260, 370, 0),
        enemy10(1360, 370, 1),

        wait(250),
        enemy5(320),
        wait(100),
        enemy5(290),
        wait(120),
        enemy5(260),
        wait(80),
        enemy5(220),

        wait(250),
        enemy3(-100, 128,  90),
        enemy3(-100, 256,  90),
        enemy3(-100, 384,  90),
        enemy3(-100, 512,  90),

        wait(150),
        enemy8(1),
        wait(10),
        enemy8(1),
        wait(10),
        enemy8(1),
        wait(10),
        enemy8(1),
        wait(10),
        enemy8(1),

        wait(150),
        enemy8(4),
        wait(10),
        enemy8(4),
        wait(10),
        enemy8(4),
        wait(10),
        enemy8(4),
        wait(10),
        enemy8(4),

        enemy6f(1060, 480, -2),

        wait(150),
        enemy8(5),
        wait(10),
        enemy8(5),
        wait(10),
        enemy8(5),
        wait(10),
        enemy8(5),
        wait(10),
        enemy8(5),

        enemy6f(1060, 480,-2),
        enemy6c(-100, 160, 2),

        wait(200),
        enemy4(160),
        enemy4(480),

        wait(250),
        enemy3(-100, 128,  90),
        enemy3(-100, 256,  90),
        enemy3(-100, 384,  90),
        enemy3(-100, 512,  90),
        enemy3(1060, 128, -90),
        enemy3(1060, 256, -90),
        enemy3(1060, 384, -90),
        enemy3(1060, 512, -90),

        wait(150),
        enemy6c(1060, 160,-2),
        enemy6f(-100, 480, 2),

        wait(150),
        enemy7(1),
        wait(15),
        enemy7(1),
        wait(15),
        enemy7(1),
        wait(15),
        enemy7(1),
        wait(15),
        enemy7(1),
        wait(15),

        wait(150),
        enemy7(0),
        wait(15),
        enemy7(0),
        wait(15),
        enemy7(0),
        wait(15),
        enemy7(0),
        wait(15),
        enemy7(0),
        wait(15),

        wait(250),
        enemy13f(-100, 480, 2),
        enemy13f(1060, 480,-2),
        enemy13c(-100, 160, 2),

        wait(250),
        enemy8(0),
        wait(10),
        enemy8(0),
        wait(10),
        enemy8(0),
        wait(10),
        enemy8(0),
        wait(10),
        enemy8(0),

        wait(250),
        enemy8(5),
        wait(10),
        enemy8(5),
        wait(10),
        enemy8(5),
        wait(10),
        enemy8(5),
        wait(10),
        enemy8(5),

        wait(250),
        enemy13f(1060, 480,-2),
        enemy13c(1060, 160,-2),

        wait(250),
        enemy8(1),
        enemy8(5),
        wait(10),
        enemy8(1),
        enemy8(5),
        wait(10),
        enemy8(1),
        enemy8(5),
        wait(10),
        enemy8(1),
        enemy8(5),
        wait(10),
        enemy8(1),
        enemy8(5),

        wait(250),
        enemy13f(-100, 480, 2),
        enemy13c(-100, 160, 2),

        wait(250),
        enemy5(160),
        enemy5(320),
        enemy5(480),
        wait(120),
        enemy5(240),
        enemy5(400),
        wait(120),
        enemy5(160),
        enemy5(480),

        wait(500),
        { type: "boss", boss: "cannon.Boss1" },
    ],
};

})();
