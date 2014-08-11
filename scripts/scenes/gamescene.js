(function() {

var score = 0;
var rank = 0;
var zanki = 3;

tm.define("cannon.GameScene", {
    superClass: "tm.app.Scene",

    init: function(stageIndex) {
        this.superInit();

        this.stageIndex = stageIndex || 0;

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
                            init: [cannon.STAGE_DATA[this.stageIndex].terrain],
                        },
                    ],
                },
                enemyLayer: {
                    type: "tm.display.CanvasElement",
                },
                bulletLayer: {
                    type: "tm.display.CanvasElement",
                },
                uiLayer: {
                    type: "tm.display.CanvasElement",
                    children: {
                        scoreLabel: {
                            type: "cannon.ScoreLabel",
                            x: cannon.SC_W - 5,
                            y: 5,
                        },
                        rankLabel: {
                            type: "cannon.RankLabel",
                            x: 5,
                            y: 5,
                        },
                        zankiLabel: {
                            type: "cannon.ZankiLabel",
                            x: 32 + 5,
                            y: cannon.SC_H - 32 - 5,
                        }
                    }
                },
            },
        });

        var that = this;

        this.uiLayer.zankiLabel.setZanki(zanki);
        this.uiLayer.scoreLabel.set(score);
        this.uiLayer.rankLabel.set(rank);

        this.mt = new MersenneTwister(1000 + this.stageIndex);

        this.scrollSpeed = cannon.STAGE_DATA[this.stageIndex].scrollSpeed;
        this.stageStep = cannon.STAGE_DATA[this.stageIndex].stageStep;
        this.waitCount = 0;

        this.player = this.playerLayer.player;
        this.player.on("killed", function() {
            zanki -= 1;
            if (zanki <= 0) {
                that.gameover();
                return;
            }

            rank = Math.clamp(rank - 30, 0, cannon.RANK_MAX);
            bulletml.Walker.globalScope["$rank"] = rank * 0.001;
            that.uiLayer.rankLabel.add(-30);

            that.uiLayer.zankiLabel.setZanki(zanki);
            that.tweener.clear().wait(500).call(function() {
                that.launchPlayer();
            });
        });

        bulletml.Walker.globalScope["$rank"] = rank * 0.001;
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

        for (var i = 0, len = terrains.length; i < len; i++) {
            terrains[i].scroll += this.scrollSpeed;
        }
        for (var i = 0, len = backgrounds.length; i < len; i++) {
            backgrounds[i].scroll += this.scrollSpeed * 0.5;
        }
        for (var i = 0, len = cannon.Enemy.ACTIVES.length; i < len; i++) {
            var enemy = cannon.Enemy.ACTIVES[i];
            if (enemy.isGround) enemy.x -= that.scrollSpeed;
        }

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
            enemy.setRoute(step.data);
            break;
        case "sine":
            enemy.setSineWaveMotion(step.data);
            break;
        case "horizontal":
            enemy.setHorizontalMotion(step.data);
            break;
        case "homing":
            enemy.setHomingMotion(step.data, this.player);
            break;
        }

        var attack = step.attack;
        if (attack) {
            var m = attack.match("{(\\d)}");
            if (m) {
                attack = attack.replace(m[0], this.mt.nextInt(~~m[1]));
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
        var bullets;
        var shots;
        var enemies;

        // enemy vs shot
        enemies = cannon.Enemy.ACTIVES.clone();
        shots = cannon.Shot.ACTIVES.clone();
        for (var i = 0, ilen = shots.length; i < ilen; i++) {
            var shot = shots[i];
            for (var j = 0, jlen = enemies.length; j < jlen; j++) {
                var enemy = enemies[j];
                if (shot.isHitElement(enemy)) {
                    if (!enemy.damage(cannon.SHOT_POWER)) {
                        shot.damage();
                        break;
                    } else {
                        var rate = Math.min(shot.killCount, 5);

                        var delta = [1, 2, 4, 8, 16, 32][rate] * enemy.score;
                        score += delta;
                        this.uiLayer.scoreLabel.add(delta);
                        shot.killEnemy(enemy, this.uiLayer);

                        rank = Math.clamp(rank + rate, 0, cannon.RANK_MAX);
                        bulletml.Walker.globalScope["$rank"] = rank * 0.001;
                        this.uiLayer.rankLabel.add(rate);
                    }
                }
            }
        }

        // terrain vs enemy
        enemies = cannon.Enemy.ACTIVES.clone();
        for (var i = 0, len = enemies.length; i < len; i++) {
            var enemy = enemies[i];
            if (enemy.hasTerrainCollider) {
                var line = null;
                if (terrains.some(function(t) { return (line = t.getHitLine(enemy)) !== null })) {
                    var ev = tm.event.Event("hitterrain");
                    ev.line = line;
                    enemy.fire(ev);
                }
            }
        }

        // terrain vs bullet
        bullets = cannon.Bullet.ACTIVES.clone();
        for (var i = 0, len = bullets.length; i < len; i++) {
            var bullet = bullets[i];
            if (terrains.some(function(t) { return t.getHitLine(bullet) !== null })) {
                bullet.damage();
            }
        }

        // terrain vs shot
        shots = cannon.Shot.ACTIVES.clone();
        for (var i = 0, len = shots.length; i < len; i++) {
            var shot = shots[i];
            if (terrains.some(function(t) { return t.getHitLine(shot) !== null })) {
                shot.damage();
            }
        }

        if (player.parent) {

            // enemy vs player
            enemies = cannon.Enemy.ACTIVES.clone();
            for (var i = 0, len = enemies.length; i < len; i++) {
                var enemy = enemies[i];
                if (player.isHitElement(enemy)) {
                    if (player.damage()) {
                        break;
                    }
                }
            }

            // bullet vs player
            bullets = cannon.Bullet.ACTIVES.clone();
            for (var i = 0, len = bullets.length; i < len; i++) {
                var bullet = bullets[i];
                if (player.isHitElement(bullet)) {
                    bullet.damage();
                    if (player.damage()) {
                        break;
                    }
                }
            }

            // terrain vs player
            if (terrains.some(function(t) { return t.getHitLine(player) !== null })) {
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
            })
            .wait(2000)
            .call(function() {
                player.muteki = false;
                player.boostOff();
            });
    },

    gameover: function() {
        // TODO
        console.log("gameover!");
        this.app.stop();
    },
});

cannon.GameScene.createLoadingScene = function(stageIndex) {
    return cannon.LoadingScene({
        width: cannon.SC_W,
        height: cannon.SC_H,
        assets: cannon.STAGE_DATA[stageIndex].assets,
        nextScene: function() {
            return cannon.GameScene(stageIndex);
        },
    });
};

})();
