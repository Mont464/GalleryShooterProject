class oneDmove extends Phaser.Scene {
    graphics;
    curve;
    path;
    
    constructor() {
        super("oneDScene");
        this.my = {sprite: {}, text: {}};  // Create an object to hold sprite bindings

        // Create variables to hold constant values for sprite locations
        this.shipX = 400;
        this.shipY = 500;
        this.shipLives = [];

        this.aKey = null;
        this.dKey = null;
        this.spaceKey = null;
        
        this.my.sprite.bullet = [];   
        this.maxBullets = 3;
        this.bulletCooldown = 4;
        this.bulletCooldownCounter = 0;

        this.my.sprite.enemyBullet = [];
        this.enemyBulletCooldownCounter = 0;

        this.my.sprite.enemies = [];
        this.maxEnemies = 3;
        this.enemyCooldown = 5;
        this.enemyCooldownCounter = [];
        this.enemyCountMax = 8;
        this.enemyCount = 0;

        this.myScore = 0;
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        this.load.setPath("./assets/");
        // background
        this.load.image("background" , "Backgrounds/darkPurple.png");
        // body
        this.load.image("ship", "PNG/playerShip1_red.png");
        this.load.image("lives", "PNG/UI/playerLife1_red.png");
        // spaceship that runs along the path
        this.load.image("enemyShip", "PNG/Enemies/enemyGreen1.png");
        this.load.image("groupShip", "PNG/Enemies/enemyGreen5.png");
        this.load.image("smallShip", "PNG/Enemies/enemyGreen2.png");
        // emission
        this.load.image("star", "PNG/Lasers/laserRed06.png");
        // enemy shot
        this.load.image("enemyShot", "PNG/Lasers/laserGreen09.png")
        // score medal
        this.load.image("bronzeMedal", "PNG/flat_medal2.png");
        this.load.image("silverMedal", "PNG/flatshadow_medal7.png");
        this.load.image("goldMedal", "PNG/flatshadow_medal1.png");
        // Player fire sound
        this.load.audio("sfx_fire", "Audio/laserSmall_001.ogg");
        this.load.audio("sfx_enemy_hit", "Audio/explosionCrunch_004.ogg");
        // Player lose sound
        this.load.audio("sfx_player_hit", "Audio/explosionCrunch_000.ogg");
        this.load.audio("sfx_lose", "Audio/explosionCrunch_002.ogg");
        // Player win sound
        this.load.audio("sfx_win", "Bonus/sfx_shieldUp.ogg");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        // create background
        my.sprite.background = this.add.sprite(400, 400, "background");
        my.sprite.background.setScale(4);

        // create medals
        this.my.sprite.medals = [];
        this.my.sprite.medals.push(this.add.sprite(750, 70, "bronzeMedal"));
        this.my.sprite.medals.push(this.add.sprite(750, 70, "silverMedal"));
        this.my.sprite.medals.push(this.add.sprite(750, 70, "goldMedal"));

        for (let i = 0; i < this.my.sprite.medals.length; i++) {
            this.my.sprite.medals[i].setScale(1.5);
            if (i > 0) {
                this.my.sprite.medals[i].visible = false;
            }
        }

        // Create the main body sprite
        my.sprite.ship = this.add.sprite(this.shipX, this.shipY, "ship");
        my.sprite.ship.setScale(0.75);

        for (let i = 0; i < 3; i++) {
            this.shipLives.push(this.add.sprite(30 + (50 * i), 30, "lives"));
        }

        this.soloPoints = [
            400, 100,
            100, 200,
            400, 300,
            700, 200,
            400, 100
        ];
        this.soloCurve = new Phaser.Curves.Spline(this.soloPoints);

        this.groupPoints = [
            150, 100,
            300, 100,
            300, 300,
            500, 300,
            500, 100,
            650, 100
        ];
        this.groupCurve = new Phaser.Curves.Spline(this.groupPoints);
        
        this.smallPoints = [
            100, 400,
            400, 100,
            700, 400
        ];
        this.smallCurve = new Phaser.Curves.Spline(this.smallPoints);

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.createEnemy(0);
        this.createEnemy(1);
        this.createEnemy(2);

        my.text.score = this.add.text(750, 50, this.myScore, {fontFamily: "'Audiowide'", fontSize: 24, color: "#000", wordWrap: { width: 60 }}).setOrigin(0.5);
    }

    createEnemy(i) {
        switch(i) {
            case 0: {
                let soloEnemy = this.add.follower(this.soloCurve, 400, 100, "enemyShip");
                soloEnemy.setScale(0.75);
                soloEnemy.visible = true;
                soloEnemy.startFollow({from: 0, to: 1, delay: 0, duration: 5000, repeat: -1, yoyo: false, rotateToPath: false, rotationOffset: -90});
                this.my.sprite.enemies.push({"sprite":soloEnemy, "coolDown": 30, "score": 10});
                break;
            }
            case 1: {
                let groupEnemy = this.add.follower(this.groupCurve, 150, 100, "groupShip");
                groupEnemy.setScale(1);
                groupEnemy.visible = true;
                groupEnemy.startFollow({from: 0, to: 1, delay: 0, duration: 10000, repeat: -1, yoyo: true, rotateToPath: false, rotationOffset: -90});
                this.my.sprite.enemies.push({"sprite":groupEnemy, "coolDown":50, "score": 15});
                break;
            }
            case 2: {
                let smallEnemy = this.add.follower(this.smallCurve, 100, 400, "smallShip");
                smallEnemy.setScale(0.5);
                smallEnemy.visible = true;
                smallEnemy.startFollow({from: 0, to: 1, delay: 0, duration: 4000, repeat: -1, yoyo: true, rotateToPath: false, rotationOffset: -90});
                this.my.sprite.enemies.push({"sprite":smallEnemy, "coolDown":60, "score": 5});
                break;
            } 
        }
        return null;
    }

    update() {
        let my = this.my;    // create an alias to this.my for readability
        this.bulletCooldownCounter--;
        this.enemyBulletCooldownCounter++;
        if (this.enemyBulletCooldownCounter > 12) {
            this.enemyBulletCooldownCounter == 1
        }

        for(let i = 0; i < this.enemyCooldownCounter.length; i++) {
            if(this.enemyCooldownCounter[i] > 0) {
                this.enemyCooldownCounter[i]--;
                if(this.enemyCooldownCounter[i] == 0) {
                    this.createEnemy(Math.floor(Math.random() * 3));
                    this.enemyCooldownCounter.splice(i,1);
                    i--;
                }
            }
        }
        if(this.aKey.isDown)
        {
            console.log("pressing a");
            if(my.sprite["ship"].x >= 100)
            {
                my.sprite["ship"].x -= 10;
            }
        }
        else if(this.dKey.isDown)
        {
            console.log("pressing d");
            if(my.sprite["ship"].x <= 700)
            {
                my.sprite["ship"].x += 10;
            }
        }

        if (this.spaceKey.isDown) {
            // Are we under our bullet quota?
            console.log("pressing space");
            if (this.bulletCooldownCounter < 0) {
                if (my.sprite.bullet.length < this.maxBullets) {
                    my.sprite.bullet.push(this.add.sprite(my.sprite.ship.x, my.sprite.ship.y-(my.sprite.ship.displayHeight/2), "star"));
                    this.sound.play("sfx_fire");
                    this.bulletCooldownCounter = this.bulletCooldown;
                }
            }
        }

        for (let i = 0; i < my.sprite.enemies.length; i++) {
            let enemy = my.sprite.enemies[i];
            //console.log(enemy.texture.key);
            if(this.enemyBulletCooldownCounter % enemy.coolDown == 0) {
                my.sprite.enemyBullet.push(this.add.sprite(enemy.sprite.x, enemy.sprite.y+(enemy.sprite.displayHeight/2), "enemyShot"));
            }
        }

        for (let bullet of my.sprite.bullet) {
            bullet.y -= 10;
        }

        for (let bullet of my.sprite.enemyBullet) {
            bullet.y += 5
        }

        my.sprite.bullet = my.sprite.bullet.filter((bullet) => bullet.y > -(bullet.displayHeight/2));
        my.sprite.enemyBullet = my.sprite.enemyBullet.filter((bullet) => bullet.y < 800);

        //console.log(my.sprite.enemies.length);
        for (let bullet of my.sprite.bullet) {
            for (let i = 0; i < my.sprite.enemies.length; i++) {
                //console.log("hit");
                let enemy = my.sprite.enemies[i];
                if (this.collides(enemy.sprite, bullet)) {
                    //console.log("hit");
                    // start animation
                    //this.puff = this.add.sprite(my.sprite.hippo.x, my.sprite.hippo.y, "whitePuff03").setScale(0.25).play("puff");
                    // clear out bullet -- put y offscreen, will get reaped next update
                    
                    //my.sprite.enemyShip.visible = false;
                    this.updateScore(enemy.score);
                    enemy.sprite.destroy();
                    my.sprite.enemies.splice(i, 1);
                    i--;
                    bullet.y = -100;
                    this.sound.play("sfx_enemy_hit");
                    if(++this.enemyCount < this.enemyCountMax) {
                        this.enemyCooldownCounter.push(this.enemyCooldown);
                    }
                    if(my.sprite.enemies.length == 0 && this.enemyCooldownCounter.length == 0) {
                        this.sound.play("sfx_win");
                        this.endClean();
                        this.scene.start("winScene");
                    }
                }
            }
        }

        for (let bullet of my.sprite.enemyBullet) {
            if (this.collides(my.sprite.ship, bullet)) {
                this.shipLives[this.shipLives.length - 1].y = -200;
                this.shipLives[this.shipLives.length - 1].destroy();
                this.shipLives.splice(this.shipLives.length - 1, 1);
                bullet.y = 1000;
                this.sound.play("sfx_player_hit");
                if (this.shipLives.length == 0) {
                    my.sprite.ship.y = -200;
                    my.sprite.ship.destroy();
                    this.sound.play("sfx_lose");
                    this.endClean();
                    this.scene.start("endScene");
                    return;
                }
            }
        }
        // if(this.runActive == true)
        // {
        //     my.sprite.enemyShip.stopFollow();
        //     my.sprite.enemyShip.visible = false;
        //     this.runActive = false;
        // }

        // else
        // {
        //     if(this.curve.points.length < 1)
        //     {
        //         console.log("no points to follow");

        //     }
        //     else
        //     {
        //         this.runActive = true;
        //         my.sprite["enemyShip"].x = this.curve.points[0].x;
        //         my.sprite["enemyShip"].y = this.curve.points[0].y;
        //         my.sprite.enemyShip.visible = true;
        //         my.sprite.enemyShip.startFollow({from: 0, to: 1, delay: 0, duration: 2000, ease: 'Sine.easeInOut', repeat: -1, yoyo: false, rotateToPath: false, rotationOffset: -90});
        //     }
        // }
    }

    collides(a, b) {
        if (Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if (Math.abs(a.y - b.y) > (a.displayHeight/2 + b.displayHeight/2)) return false;
        return true;
    }

    updateScore(pointsUp) {
        let my = this.my;
        this.myScore += pointsUp;
        if (this.myScore > 149) {
            my.sprite.medals[1].visible = false;
            my.sprite.medals[2].visible = true;
        }

        else if (this.myScore > 74) {
            my.sprite.medals[0].visible = false;
            my.sprite.medals[1].visible = true;
        }

        my.text.score.setText(this.myScore);
    }

    endClean() {
        let my = this.my;
        for (let bullet of my.sprite.bullet) {
            bullet.destroy();
        }

        for (let bullet of my.sprite.enemyBullet) {
            bullet.destroy();
        }

        for (let enemy of my.sprite.enemies) {
            enemy.sprite.destroy();
        }

        my.sprite.bullet = [];
        my.sprite.enemyBullet = [];
        my.sprite.enemies = [];
        this.myScore = 0;
        this.enemyCooldownCounter = [];
        this.enemyCount = 0;
   }
}