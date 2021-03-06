(function() {

var gameData = null;

var comboCount = [0, 0, 0, 0, 0, 0];
var enemyCount = 0;
var destroyCount = 0;
var noMiss = true;

tm.define("cannon.GameScene", {
    superClass: "tm.app.Scene",

    init: function() {
        this.superInit();
        cannon.gameScene = this;

        this.fromJSON({
            children: {
                backgroundLayer: {
                    type: "tm.display.CanvasElement",
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
                            x: 5,
                            y: 5,
                        },
                        rankLabel: {
                            type: "cannon.RankLabel",
                            x: 5,
                            y: 40,
                        },
                        zankiLabel: {
                            type: "cannon.ZankiLabel",
                            x: 32 + 5,
                            y: cannon.SC_H - 32 - 5,
                        },
                        gameoverLabel: {
                            type: "tm.display.Label",
                            init: ["Game Over", 96],
                            fillStyle: "hsl(0, 100%, 50%)",
                            x: cannon.SC_W * 0.5,
                            y: cannon.SC_H * 0.5,
                            alpha: 0,
                            visible: false,
                        },
                        warningLabel: {
                            type: "tm.display.CanvasElement",
                            alpha: 0,
                            visible: false,
                            children: [{
                                type: "tm.display.Label",
                                init: ["CAUTION!!", 96],
                                fillStyle: "hsl(0, 80%, 80%)",
                                x: cannon.SC_W * 0.5,
                                y: cannon.SC_H * 0.5 + 10,
                                shadowColor: "white",
                                shadowBlur: 15,
                                blendMode: "lighter",
                                onenterframe: function(e){ this.alpha = 0.6 + Math.sin(e.app.frame * 0.2) * 0.4 },
                            }],
                        },
                        bossBattleTimeLabel: {
                            type: "cannon.CountDownLabel",
                            init: 60 * 1000,
                            x: cannon.SC_W - 5,
                            y: 5,
                            visible: false,
                        },
                    },
                },
            },
        });

        var that = this;

        gameData = cannon.GameData();
        gameData.on("updatescore", function() {
            that.uiLayer.scoreLabel.score = this.score;
        });
        gameData.on("updaterank", function() {
            that.uiLayer.rankLabel.rank = this.rank;
        });
        gameData.on("updatezanki", function() {
            that.uiLayer.zankiLabel.zanki = this.zanki;
        });
        gameData.initializeValues();

        if (location.hostname === "localhost") {
            cannon.gameData = gameData;
        }

        this.stageIndex = 0;

        this.player = this.playerLayer.player;
        this.player.on("killed", function() {
            var t = tm.app.Tweener(that.webglParams)
                .set({ quake:6 })
                .to({ quake:0 }, 600)
                .on("finish", function(){ that.off("enterframe", tt) });
            var tt = function(e){ t.update(e.app) };
            that.on("enterframe", tt);

            gameData.zanki -= 1;
            if (gameData.zanki <= 0) {
                that.gameover();
                return;
            }

            gameData.rank += cannon.RANK_DOWN_AT_KILLED;

            that.tweener.clear().wait(500).call(function() {
                that.launchPlayer();
            });

            noMiss = false;
        });

        this.bulletmlConfig = {
            target: this.player,
            createNewBullet: function(runner, spec) {
                cannon.BulletMLBullet(runner, spec).addChildTo(this.bulletLayer);
            }.bind(this)
        };

        this.on("enter", function(e) {
            if (e.app.webgl) {
                this.webglParams = e.app.webgl.params.addChildTo(this);
            } else {
                this.webglParams = cannon.WebGLParams();
            }
            this.stageStart();
        });

        this.on("enterframe", function(e) {
            if (e.app.frame % (60 * 5) === 0) {
                window.parent.entry && window.parent.entry(gameData.score);
            }
        });
    },

    stageStart: function() {
        this.uiLayer.scoreLabel.clearAnimation();
        this.uiLayer.rankLabel.clearAnimation();
        this.uiLayer.bossBattleTimeLabel.visible = false;

        this.backgroundLayer.removeChildren();
        this.terrainLayer.removeChildren();
        this.enemyLayer.removeChildren();
        this.bulletLayer.removeChildren();

        this.webglParams.quake = 0;
        this.webglParams.labelAreaHeight = 0;
        this.webglParams.strength = 0;
        this.webglParams.lightRadius = 0;

        cannon.Enemy.ACTIVES.clear();
        cannon.Bullet.ACTIVES.clear();
        cannon.Shot.ACTIVES.clear();

        comboCount = [0, 0, 0, 0, 0, 0];
        enemyCount = 0;
        destroyCount = 0;
        noMiss = true;

        this.mt = new MersenneTwister(1000 + this.stageIndex);

        var stageData = cannon.STAGE_DATA[this.stageIndex];
        cannon.Background(stageData.background).addChildTo(this.backgroundLayer);
        cannon.Terrain(stageData.terrain).addChildTo(this.terrainLayer);
        this.scrollSpeed = stageData.scrollSpeed;
        this.stageStep = stageData.stageStep.clone();
        this.waitCount = 0;

        this.launchPlayer();

        cannon.playBgm(stageData.bgm, stageData.bgmLoopRange);
    },

    stageClear: function() {
        var that = this;
        this.uiLayer.scoreLabel.animation = false;
        this.uiLayer.rankLabel.animation = false;
        var resultScene = cannon.ResultScene({
            gameData: gameData,
            comboCount: comboCount,
            killRatio: destroyCount / enemyCount,
            bossBattleTime: this.uiLayer.bossBattleTimeLabel.time,
            perfectBonus: (destroyCount / enemyCount >= 1) ? 10000 : 0,
            noMissBonus: noMiss ? 10000 : 0,
        });
        resultScene.on("finish", function() {
            that.uiLayer.scoreLabel.animation = true;
            that.uiLayer.rankLabel.animation = true;

            this.app.popScene();
            // this.remove();

            cannon.stopBgm();

            // that.stageIndex += 1;
            if (that.stageIndex < cannon.STAGE_COUNT) {
                that.stageStart();
            } else {
                that.app.replaceScene(cannon.EndingScene(gameData.score));
            }
        });
        this.app.pushScene(resultScene);
        // resultScene.addChildTo(this);
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
            // this.app.pushScene(cannon.PauseScene());
            var o = cannon.OptionScene();
            this.app.pushScene(o);
            o.openRootMenu();
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
        case "boss":
            this.launchBoss(s);
            break;
        }
    },

    launchEnemy: function(step) {
        var enemy = cannon.Zako(cannon.ENEMY_DATA[step.enemyType]).addChildTo(this.enemyLayer);

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
        case "run":
            enemy.setRunMotion(step.data);
            break;
        case "jump":
            enemy.setJumpMotion(step.data);
            break;
        }

        var attack = step.attack;
        if (attack) {
            var m = attack.match("{(\\d)}");
            if (m) {
                attack = attack.replace(m[0], this.mt.nextInt(~~m[1]));
            }
            var a = cannon.ATTACK_DATA[attack];
            if (a) enemy.startAttack(a, this.bulletmlConfig);
        }

        var that = this;
        if (enemy.shotBack) {
            enemy.on("destroy", function() {
                cannon.AimBullet({
                    target: that.player,
                    x: this.x,
                    y: this.y,
                    speed: 1,
                }).addChildTo(that.bulletLayer);
            });
        }

        enemyCount += 1;
        enemy.on("destroy", function() {
            destroyCount += 1;
        });
    },

    launchBoss: function(step) {
        var that = this;
        var webglParams = this.webglParams;
        var warningLabel = this.uiLayer.warningLabel;
        warningLabel.visible = true;
        warningLabel.alpha = 0;

        var boss = tm.using(step.boss)();
        var bossBattleTimeLabel = this.uiLayer.bossBattleTimeLabel;

        bossBattleTimeLabel.on("timeup", function() {
            boss.muteki = true;
            boss.tweener.clear()
                .to({
                    x: cannon.SC_W * 1.5
                }, 3000, "easeInQuad")
                .call(function() {
                    boss.remove();
                });
        });

        this.tweener.clear()
            .call(function(){ webglParams.tweener.clear().to({ labelAreaHeight:60 }, 700, "easeOutBack") })
            .wait(700)
            .call(function(){ warningLabel.tweener.clear().to({ alpha:1 }, 1000) })
            .wait(3000)
            .call(function(){ warningLabel.tweener.clear().to({ alpha:0 }, 1000) })
            .wait(1000)
            .call(function(){ webglParams.tweener.clear().to({ labelAreaHeight:0 }, 700, "easeInBack") })
            .call(function() {
                bossBattleTimeLabel.x += 100;
                bossBattleTimeLabel.visible = true;
                bossBattleTimeLabel.tweener.clear()
                    .by({
                        x: -100
                    }, 500, "easeOutBack")
                    .call(function(){ bossBattleTimeLabel.start() });
                boss.addChildTo(that.enemyLayer);
            });

        var lightLines = Array.range(0, 12).map(function(i) {
            return cannon.LightLine();
        });
        var bossExplosion = cannon.BossExplode(0, 0);
        boss.on("destroy", function() {
            that.player.muteki = true;
            bossBattleTimeLabel.stop();

            lightLines.forEach(function(lightLine) {
                lightLine
                    .setPosition(this.x, this.y)
                    .addChildTo(that.enemyLayer);
            }.bind(this));

            that.webglParams.centerOffset = [this.x, this.y];
            that.webglParams.tweener.clear()
                .wait(3000)
                .call(function(){ that.webglParams.quake = 2.0 })
                .call(function(){ bossExplosion.setPosition(this.x, this.y).addChildTo(that.enemyLayer) }.bind(this))
                .to({
                    strength: 20.0,
                    // lightRadius: 1200,
                }, 3000, "easeOutQuad")
                .to({
                    quake: 0,
                }, 1500)
                .call(function(){ this.remove() }.bind(this));
        });
        boss.on("removed", function() {
            lightLines.forEach(function(lightLine){ lightLine.remove() });
            if (bossExplosion.parent) bossExplosion.remove();
            that.player.muteki = true;
            that.webglParams.quake = 0;
            that.webglParams.strength = 0;
            that.webglParams.lightRadius = 0;
            that.stageClear();
        });

        enemyCount += 1;
        boss.on("destroy", function() {
            destroyCount += 1;
        });
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
                    // console.log(enemy.hp);
                    if (!enemy.damage(cannon.SHOT_POWER)) {
                        shot.damage();
                        break;
                    } else {
                        var rate = Math.min(shot.killCount, 5);

                        comboCount[rate] += 1;
                        var delta = [1, 2, 4, 8, 16, 32][rate] * enemy.score;
                        gameData.score += delta;
                        shot.killEnemy(enemy, this.uiLayer);

                        gameData.rank += rate;
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
                var index = 0;
                if (terrains.some(function(t, i){ index = i; return (line = t.getHitLine(enemy)) !== null })) {
                    var ev = tm.event.Event("hitterrain");
                    ev.line = line;
                    ev.terrain = terrains[index];
                    ev.gameScene = this;
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

        player.muteki = false;
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
        var gameoverLabel = this.uiLayer.gameoverLabel;
        gameoverLabel.tweener.clear()
            .set({
                alpha: 0,
                visible: true,
            })
            .fadeIn(500)
            .wait(3000)
            .set({
                alpha: 0,
                visible: false,
            })
            .call(function() {
                cannon.stopBgm();
                cannon.app.replaceScene(cannon.TitleScene());
            });
    },
});

cannon.GameScene.createLoadingScene = function(stageIndex) {
    return cannon.LoadingScene({
        width: cannon.SC_W,
        height: cannon.SC_H,
        assets: cannon.STAGE_DATA[stageIndex].assets,
        nextScene: function() {
            var gameScene = cannon.GameScene(stageIndex);
            return gameScene;
        },
    });
};

})();
