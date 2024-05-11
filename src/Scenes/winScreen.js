class winScreen extends Phaser.Scene {
    constructor() {
        super("winScene");
        this.my = {sprite: {}, text: {}};  // Create an object to hold sprite bindings
    }

    // Use preload to load art and sound assets before the scene starts running.
    preload() {
        
    }

    create() {
          // update instruction text
        let my = this.my;   // create an alias to this.my for readability
        this.pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        my.text.title = this.add.text(400, 200, "SUCCESS", {fontFamily: "'Audiowide'", fontSize: 72, color: "#fff"}).setOrigin(0.5);
        my.text.direction = this.add.text(400, 400, "Press P to Play Again", {fontFamily: "'Audiowide'", fontSize: 64, color: "#fff"}).setOrigin(0.5);
    }

    update() {
        if (this.pKey.isDown) {
            this.scene.start("oneDScene");
        }
    }

}