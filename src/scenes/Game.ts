import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.TileSprite;
    duck: Phaser.Physics.Arcade.Sprite;
    pauseButton: Phaser.GameObjects.Image;
    popup: Phaser.GameObjects.Container;
    scoreText: Phaser.GameObjects.Text;
    uiCamera: Phaser.Cameras.Scene2D.Camera;
    isGamePaused: boolean = false;
    score: number = 0;
    
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        // Set up main camera
        this.camera = this.cameras.main;
        
        // Set world bounds for our game (extend far to the right)
        this.physics.world.setBounds(0, 0, 10000, 768);
        
        // Create background - repeating to cover the extended world
        this.background = this.add.tileSprite(0, 0, 10000, 768, 'background')
            .setOrigin(0, 0)
            .setScrollFactor(0.8); // Parallax effect
        
        // Create the duck with physics
        this.duck = this.physics.add.sprite(200, 384, 'duck')
            .setScale(0.1)
            .setCollideWorldBounds(true);
            
        // Set the duck to move constantly to the right
        this.duck.setVelocityX(200);
        
        // Make camera follow the duck
        this.camera.startFollow(this.duck, true, 0.5, 0.5);
        this.camera.setBounds(0, 0, 10000, 768);
        
        // Create a UI camera that doesn't move
        this.uiCamera = this.cameras.add(0, 0, 1024, 768);
        this.uiCamera.setScroll(0, 0);
        this.uiCamera.setName('UICamera');
        
        // UI elements
        this.scoreText = this.add.text(450, 50, 'Score: 0', {
            fontFamily: 'PixelGame',
            fontSize: 18,
            color: '#ffffff'
        }).setScrollFactor(0).setDepth(100);
        
        // Add pause button - fixed to UI
        this.pauseButton = this.add.image(60, 50, 'play-icon')
            .setScale(0.05)
            .setScrollFactor(0)
            .setDepth(100)
            .setInteractive()
            .on('pointerdown', this.togglePause, this);

        // Create popup (initially hidden)
        this.createPopup();
        
        // Update score every second
        this.time.addEvent({
            delay: 1000,
            callback: this.updateScore,
            callbackScope: this,
            loop: true
        });
    }
    
    update() {
        // Only move the duck when the game is not paused
        if (!this.isGamePaused) {
            this.duck.setVelocityX(200);
        } else {
            this.duck.setVelocityX(0);
        }
    }
    
    updateScore() {
        if (!this.isGamePaused) {
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
        }
    }

    createPopup() {
        // Create a container for the popup (initially hidden)
        this.popup = this.add.container(512, 384).setVisible(false).setScrollFactor(0).setDepth(200);
        
        // Add semi-transparent background overlay
        const overlay = this.add.rectangle(0, 0, 1024, 768, 0x000000, 0.7);
        
        // Add popup panel background
        const panel = this.add.rectangle(0, 0, 400, 300, 0x333333, 0.9);
        panel.setStrokeStyle(2, 0xffffff);
        
        // Add title
        const title = this.add.text(0, -100, 'Game Paused', {
            fontFamily: 'PixelGame',
            fontSize: 24,
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Add continue button
        const continueButton = this.add.rectangle(0, -20, 300, 60, 0x4a4a4a)
            .setInteractive()
            .on('pointerdown', this.togglePause, this);
        
        const continueText = this.add.text(0, -20, 'Continue Playing', {
            fontFamily: 'PixelGame',
            fontSize: 14,
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Add return to menu button
        const menuButton = this.add.rectangle(0, 60, 300, 60, 0x4a4a4a)
            .setInteractive()
            .on('pointerdown', this.returnToMainMenu, this);
        
        const menuText = this.add.text(0, 60, 'Return to Main Menu', {
            fontFamily: 'PixelGame',
            fontSize: 14,
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Add all elements to the container
        this.popup.add([overlay, panel, title, continueButton, continueText, menuButton, menuText]);
    }
    
    togglePause() {
        this.isGamePaused = !this.isGamePaused;
        
        if (this.isGamePaused) {
            this.showPopup();
        } else {
            this.hidePopup();
        }
    }
    
    showPopup() {
        this.popup.setVisible(true);
    }
    
    hidePopup() {
        this.popup.setVisible(false);
    }
    
    returnToMainMenu() {
        this.scene.start('MainMenu');
    }
}
