cannon.ENEMY_DATA = [
    { texture: "enemy0",  size: 128, score: 500, hp: 8, expType: 1, rotation: "fix", }, // 0
    { texture: "enemy1",  size:  64, score: 100, hp: 1, expType: 0, rotation: "fix", }, // 1
    { texture: "enemy2",  size:  64, score: 100, hp: 1, expType: 0, rotation: "fix", }, // 2
    { texture: "enemy3",  size:  64, score: 100, hp: 1, expType: 0, rotation: "dir", }, // 3
    { texture: "enemy4",  size: 128, score: 500, hp: 8, expType: 1, rotation: "fix", }, // 4
    { texture: "enemy5",  size: 128, score: 500, hp: 8, expType: 1, rotation: "fix", }, // 5
    { texture: "enemy6",  size:  64, score: 300, hp: 1, expType: 0, rotation: "fix", }, // 6
    { texture: "enemy7",  size:  64, score: 100, hp: 1, expType: 0, rotation: "rot", }, // 7
    { texture: "enemy8",  size:  64, score: 100, hp: 1, expType: 0, rotation: "rot", }, // 8
    { texture: "enemy9",  size:  64, score: 100, hp: 1, expType: 0, rotation: "rot", }, // 9
    { texture: "enemy10", size:  64, score: 100, hp: 1, expType: 0, rotation: "rot", }, // 10
    { texture: "enemy11", size:  64, score: 100, hp: 1, expType: 0, rotation: "rot", }, // 11
    { texture: "enemy12", size:  64, score: 100, hp: 1, expType: 0, rotation: "rot", }, // 12
    { texture: "enemy13", size:  64, score: 100, hp: 1, expType: 0, rotation: "rot", }, // 13
    { texture: "enemy14", size:  64, score: 100, hp: 1, expType: 0, rotation: "rot", }, // 14
];

cannon.BOSS1_DATA = {
    parts: [
        { texture: "boss1_2", size: 128, score: 500, hp: 20, expType: 1, x:-50, y: -60, scaleX:-1, scaleY: 1, delay: 3 },
        { texture: "boss1_3", size: 128, score: 500, hp: 20, expType: 1, x: 40, y: -80, scaleX:-1, scaleY: 1, delay: 6 },
        { texture: "boss1_2", size: 128, score: 500, hp: 20, expType: 1, x:-50, y:  60, scaleX:-1, scaleY:-1, delay: 3 },
        { texture: "boss1_3", size: 128, score: 500, hp: 20, expType: 1, x: 40, y:  80, scaleX:-1, scaleY:-1, delay: 6 },
        { texture: "boss1_1", size: 128, score: 500, hp: 20, expType: 1, x:  0, y:   0, scaleX:-1, scaleY: 1, delay: 0 },
    ],
};
