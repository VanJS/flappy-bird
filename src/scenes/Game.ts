import { Scene } from 'phaser';
import * as CONFIG from '../utils/configuration.ts'
import { BaseObject } from '../utils/interfaces/object-abstract-class';
import { Background } from '../objects/background';
import { Ground } from '../objects/ground';
import { Bird } from '../objects/bird';
import { Pipes } from '../objects/obstacles/pipes';
import { Cloud } from '../objects/obstacles/cloud';
import { Thunder } from '../objects/obstacles/thunder';

export class Game extends Scene
{

    camera: Phaser.Cameras.Scene2D.Camera;
    private isGameStarted: boolean = false;
    private isGameOver: boolean = false;

    private gameObjects: BaseObject[] = [];

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


    get gameStarted() {
        return this.isGameStarted;
    }

    get gameOver() {
        return this.isGameOver;
    }

    init()
    {
        // Reset game state variables when scene starts or restarts
        this.isGamePaused = false;
        this.isGameStarted = false;
        this.isGameOver = false; 
        this.score = 0;
        this.gameObjects = [];
        
    }

    startGame() {
        this.isGameStarted = true;
        
        // Apply gravity to the world
        this.physics.world.gravity.y = CONFIG.GRAVITY;
        

    }

    create ()
    {
        // Set up main camera
        this.camera = this.cameras.main;
        
        // Set world bounds for the game (extend far to the right)
        // TODO: Replace with actual bounds
        this.physics.world.setBounds(0, 0, 10000, CONFIG.GAME_HEIGHT);
        
        // TODO: Replace with actual background
        this.background = this.add.tileSprite(0, 0, 10000, CONFIG.GAME_HEIGHT, 'background')
            .setOrigin(0, 0)
            .setScrollFactor(0.8);
        
        // TODO: Test only- replace with actual duck spritesheet
        this.duck = this.physics.add.sprite(200, 384, 'duck')
            .setScale(0.1)
            .setCollideWorldBounds(true)
            .setDepth(CONFIG.BIRD_DEPTH);
            
        // Set the duck to move constantly to the right
        this.duck.setVelocityX(200);
        this.duck.setVisible(false);
        
        // Score text
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

        // create objects to the screen
        this.gameObjects.push(
            new Background(this), 
            new Ground(this), 
            new Bird(this), 
            new Pipes(this), 
            new Cloud(this),
            new Thunder(this)
        );

        // Get references to the bird and ground
        const bird = (this.gameObjects[2] as Bird).getBird();
        const ground = (this.gameObjects[1] as Ground).getGround();
        
        // Add collision detection
        if (bird && ground) {
            this.physics.add.collider(bird, ground, this.handleGroundCollision, undefined, this);
        }
    }
    
    update() {
        // Only move the duck when the game is not paused
        if (!this.isGamePaused) {
            this.duck.setVelocityX(200);
        } else {
            this.duck.setVelocityX(0);
        }

        // call update of each object
        // Only update game objects if the game is not over
        if (!this.isGameOver) {
            // call update of each object
            this.gameObjects.forEach((object) => object.update());
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
        this.popup = this.add.container(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2).setVisible(false).setScrollFactor(0).setDepth(200);
        
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
        // Stop all timers and clean up the scene
        this.scene.stop();
        this.scene.start('MainMenu');
    }

    handleGroundCollision() {
        if (!this.isGameOver) {
            this.isGameOver = true;
            
            // Stop the bird's movement
            const bird = (this.gameObjects[2] as Bird).getBird();
            if (bird) {
                bird.setVelocity(0, 0);
            }
            if (bird) {
                // Completely stop the bird's movement
                bird.setVelocity(0, 0);
                
                // Disable physics to ensure it doesn't move
                if (bird.body) {
                    bird.body.enable = false;
                    bird.body.moves = false;  // This prevents any physics movement
                }
                
                // Make sure no animations are playing
                bird.anims.stop();
            }

            this.physics.pause();

            this.time.paused = true;
            
            // Display game over text or perform other end-game actions
            this.add.text(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2, 'Game Over', {
                fontFamily: 'PixelGame',
                fontSize: 32,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6
            }).setOrigin(0.5).setScrollFactor(0).setDepth(200);
            
            // Add restart button
            const restartButton = this.add.text(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 50, 'Restart', {
                fontFamily: 'PixelGame',
                fontSize: 24,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setScrollFactor(0).setDepth(200)
              .setInteractive()
              .on('pointerdown', () => {
                  this.scene.restart();
              });
        }
    }

    
}
