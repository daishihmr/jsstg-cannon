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
                terrainLayer: {
                    type: "tm.display.CanvasElement",
                    children: [
                        {
                            type: "cannon.Terrain",
                            init: [cannon.STAGE_DATA[cannon.currentStage].terrain],
                        },
                    ],
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

        var that = this;

        this.scrollSpeed = cannon.STAGE_DATA[cannon.currentStage].scrollSpeed;
        this.stageStep = cannon.STAGE_DATA[cannon.currentStage].stageStep;
        this.waitCount = 0;

        this.player = this.playerLayer.player;
        this.player.on("killed", function() {
            that.tweener.clear().wait(500).call(function() {
                that.launchPlayer();
            });
        });

        bulletml.Walker.globalScope["$rank"] = 0.0;
        this.bulletmlConfig = {
            target: this.player,
            createNewBullet: function(runner, spec) {
                cannon.Bullet(runner, spec).addChildTo(this.bulletLayer);
                console.log("create new")
            }.bind(this)
        };

        this.launchPlayer();
    },

    update: function(app) {
        var that = this;
        var terrains = this.terrainLayer.children;
        var backgrounds = this.backgroundLayer.children;

        terrains.forEach(function(t){
            t.scroll += that.scrollSpeed;
        });
        backgrounds.forEach(function(bg){
            bg.scroll += that.scrollSpeed * 0.5;
        });

        this.step();

        this.testCollision();

        if (app.keyboard.getKeyDown("space")) {
            this.app.pushScene(cannon.PauseScene());
        }
    },

    step: function() {
        this.waitCount -= 1;
        if (this.waitCount > 0) return;

        var s = this.stageStep.shift();
        if (s === undefined) return;
        switch (s.type) {
        case "wait":
            this.waitCount = s.value;
            break;
        case "enemy":
            this.launchEnemy(s);
            break;
        }
    },

    launchEnemy: function(step) {
        var enemy = cannon.Enemy(cannon.ENEMY_DATA[step.enemyType]).addChildTo(this.enemyLayer);
        switch (step.motionType) {
        case "route":
            enemy.setRoute(step.route);
            break;
        case "sine":
            enemy.setSineWaveMotion(step.sine);
            break;
        case "horizontal":
            enemy.setHorizontalMotion(step.data);
            break;
        }

        var attack = step.attack;
        if (attack) {
            var m = attack.match("{(\\d)}");
            if (m) {
                attack = attack.replace(m[0], Math.rand(0, ~~m[1]));
                console.log(attack);
            }
            var a = cannon.ATTACK_DATA[attack];
            if (a) enemy.startAttack(a, this.bulletmlConfig);
        }
    },

    testCollision: function() {
        var that = this;
        var player = this.player;
        var terrains = this.terrainLayer.children;
        var bullets = cannon.Bullet.ACTIVES.clone();
        var shots;
        var enemies;

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

        // terrain vs shot
        shots = cannon.Shot.ACTIVES.clone();
        for (var i = 0, len = shots.length; i < len; i++) {
            var shot = shots[i];
            if (terrains.some(function(t) { return t.isHit(shot) })) {
                shot.damage();
            }
        }

        if (player.parent) {

            // enemy vs player
            enemies = cannon.Enemy.ACTIVES.clone();
            for (var i = 0, l = enemies.length; i < l; i++) {
                var enemy = enemies[i];
                if (player.isHitElement(enemy)) {
                    player.damage();
                }
            }

            // bullet vs player
            for (var i = 0, l = bullets.length; i < l; i++) {
                var bullet = bullets[i];
                if (player.isHitElement(bullet)) {
                    player.damage();
                    bullet.damage();
                }
            }

            // terrain vs player
            if (terrains.some(function(t) { return t.isHit(player) })) {
                player.damage();
            }

        }
    },

    launchPlayer: function() {
        var player = this.player;
        if (!player.parent) player.addChildTo(this.playerLayer);

        player.controllable = false;
        player.muteki = true;
        player.direction = 1;
        player.x = cannon.SC_W * -0.2;
        player.y = cannon.SC_H * 0.5;
        player.boostOn();

        player.tweener
            .clear()
            .to({
                x: cannon.SC_W * 0.2,
            }, 2000, "easeOutBack")
            .call(function() {
                player.controllable = true;
                player.boostOff();
            })
            .wait(2000)
            .call(function() {
                player.muteki = false;
            });
    }
});
