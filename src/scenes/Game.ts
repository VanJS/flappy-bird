import { Scene } from 'phaser';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    duck: Phaser.GameObjects.Image;
    pauseButton: Phaser.GameObjects.Image;
    popup: Phaser.GameObjects.Container;
    scoreText: Phaser.GameObjects.Text;
    
    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;


        this.background = this.add.image(512, 384, 'background');

        this.scoreText = this.add.text(450, 50, 'Score: 0', {
            fontFamily: 'PixelGame',
            fontSize: 18,
            color: '#ffffff'
        });

        // Test Only- replace with actual duck spritesheet
        this.duck = this.add.image(512, 384, 'duck').setScale(0.1);


        // Add pause button
        this.pauseButton = this.add.image(60, 50, 'play-icon')
            .setScale(0.05)
            .setInteractive()
            .on('pointerdown', this.showPopup, this);

        // Create popup (initially hidden)
        this.createPopup();
    }

    createPopup() {
        // Create a container for the popup (initially hidden)
        this.popup = this.add.container(512, 384).setVisible(false);
        
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
            .on('pointerdown', this.hidePopup, this);
        
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
