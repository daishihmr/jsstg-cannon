tm.define("cannon.GameScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();

        this.fromJSON({
            children: {
                backgroundLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                        bg: {
                            type: "cannon.Background"
                        },
                    },
                },
                terrainLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                        ceil: {
                            type: "cannon.Terrain",
                            init: [CEIL],
                        },
                        floor: {
                            type: "cannon.Terrain",
                            init: [FLOOR],
                        },
                    },
                },
                playerLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                        player: {
                            type: "cannon.Fighter",
                            scene: this,
                            controllable: false,
                        },
                    },
                },
                enemyLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                    },
                },
                bulletLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                    },
                },
            },
        });

        this.player = this.playerLayer.player;
        this.launchPlayer();
    },

    update: function(app) {
        var player = this.player;
        var terrains = this.terrainLayer.children;
        var shots;

        terrains.forEach(function(t){
            t.scroll += 1;
        });

        // terrain vs player
        if (terrains.some(function(t) { return t.isHit(player) })) {
            player.damage();
        }

        // terrain vs shot
        shots = cannon.Shot.ACTIVES.clone();
        for (var i = 0, len = shots.length; i < len; i++) {
            var shot = shots[i];
            if (terrains.some(function(t) { return t.isHit(shot) })) {
                shot.damage();
            }
        }

        // enemy vs shot
        var enemies = cannon.Enemy.ACTIVES.clone();
        shots = cannon.Shot.ACTIVES.clone();
        for (var i = 0, il = shots.length; i < il; i++) {
            var shot = shots[i];
            for (var j = 0, jl = enemies.length; j < jl; j++) {
                var enemy = enemies[j];
                if (shot.isHitElement(enemy)) {
                    if (!enemy.damage()) {
                        shot.damage();
                        break;
                    }
                }
            }
        }

        if (app.keyboard.getKeyDown("space")) {
            this.app.pushScene(cannon.PauseScene());
        }

        if (app.frame % 120 === 0) {
            cannon.Enemy4().setPosition(cannon.SC_W * 1.1, cannon.SC_H * 0.5).addChildTo(this.enemyLayer);
        }
    },

    launchPlayer: function() {
        var player = this.player;
        player.tweener.clear().set({
            controllable: false,
            x: cannon.SC_W * -0.2,
        }).to({
            x: cannon.SC_W * 0.2,
        }, 2000, "easeOutBack").call(function() {
            player.controllable = true;
        });
    }
});

var CEIL = [
    0,
    100,
    120,
    90,
    120,
    120,
    90,
    120,
    120,
    90,
    120,
    120,
    90,
    120,
    120,
    500,
    0,
    100,
    120,
    90,
    120,
    120,
    90,
    120,
    120,
    90,
    120,
    120,
    90,
    120,
    120,
    500,
];
var FLOOR = [
    500,
    600,
    620,
    490,
    520,
    520,
    690,
    620,
    620,
    690,
    620,
    620,
    690,
    620,
    620,
    700,
    500,
    600,
    620,
    490,
    520,
    520,
    690,
    620,
    620,
    690,
    620,
    620,
    690,
    620,
    620,
    700,
];
