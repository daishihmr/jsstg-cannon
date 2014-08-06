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
                    children: [
                        {
                            type: "cannon.Terrain",
                            init: [cannon.STAGE_DATA[cannon.currentStage].terrain],
                        },
                    ],
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
        var enemies;

        terrains.forEach(function(t){
            t.scroll += 1;
        });

        // enemy vs shot
        enemies = cannon.Enemy.ACTIVES.clone();
        shots = cannon.Shot.ACTIVES.clone();
        for (var i = 0, il = shots.length; i < il; i++) {
            var shot = shots[i];
            for (var j = 0, jl = enemies.length; j < jl; j++) {
                var enemy = enemies[j];
                if (shot.isHitElement(enemy)) {
                    if (!enemy.damage(cannon.SHOT_POWER)) {
                        shot.damage();
                        break;
                    }
                }
            }
        }

        // enemy vs player
        enemies = cannon.Enemy.ACTIVES.clone();
        for (var i = 0, l = enemies.length; i < l; i++) {
            var enemy = enemies[i];
            if (player.isHitElement(enemy)) {
                player.damage();
            }
        }

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

        if (app.keyboard.getKeyDown("space")) {
            this.app.pushScene(cannon.PauseScene());
        }

        if (app.frame % 120 === 0) {
            cannon.Enemy12().setPosition(cannon.SC_W * 1.1, cannon.SC_H * 0.5).addChildTo(this.enemyLayer);
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
