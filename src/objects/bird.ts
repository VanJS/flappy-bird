import { Game } from '../scenes/Game.ts'
import { BaseObject } from '../utils/interfaces/object-abstract-class.ts';
import * as CONFIG from '../utils/configuration.ts'

export class Bird extends BaseObject {
    private bird : Phaser.Physics.Arcade.Sprite | undefined
    private x = 0;
    private y = 0;
    private idleDirection = 1;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private jumpKey: Phaser.Input.Keyboard.Key | undefined;

    constructor(scene: Phaser.Scene) {
        super(scene);  
        this.init();
   
    }

    init() {
        this.x = this.scene.cameras.main.width/2 - CONFIG.BIRD_OFFSET_X;
        this.y = this.scene.cameras.main.height/2;
        this.bird = this.scene.physics.add.sprite(
            this.x, 
            this.y, 
            'bird_sprite')
        .setScale(1.5)
        .setDepth(CONFIG.BIRD_DEPTH)
        .play('bird_sprite');

        // Add cursor keys
        this.cursors = this.scene.input.keyboard?.createCursorKeys();
        
        // Add space key for jumping
        this.jumpKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // Add touch/click input for mobile
        this.scene.input.on('pointerdown', this.jump, this);
    }

    getBird(): Phaser.Physics.Arcade.Sprite | undefined {
        return this.bird;
    }

    jump() {
        const gameScene = this.scene as Game;
        if (!gameScene.gameOver && this.bird) {
            if (!gameScene.gameStarted) {
                gameScene.startGame();
            }
            // Apply upward velocity for jump
            this.bird.setVelocityY(-CONFIG.JUMP_STRENGTH);
        }
    }

    update() {
        if (!this.bird) {
            return;
        }
        // create swing effect before game start
        const gameScene = this.scene as Game
        if(! gameScene.gameStarted) {
            if (this.bird.y < this.y - CONFIG.IDLE_OFFEST_Y) {
                this.idleDirection *= -1;
            } else if(this.bird.y > this.y + CONFIG.IDLE_OFFEST_Y) {
                this.idleDirection *= -1;
            }
            this.bird.y += this.idleDirection;
        } else if (!gameScene.gameOver && !gameScene.isGamePaused) {
            // Apply gravity manually or let physics handle it
            const velocityY = this.bird.body?.velocity.y;
            if (velocityY !== undefined) {
                this.bird.setVelocityY(velocityY + CONFIG.GRAVITY);
            }
            
            // Check for jump input
            if ((this.jumpKey && Phaser.Input.Keyboard.JustDown(this.jumpKey)) || 
                (this.cursors?.up && Phaser.Input.Keyboard.JustDown(this.cursors.up))) {
                this.jump();
            }
            
            // Rotate bird based on velocity
            if (this.bird.body && this.bird.body.velocity.y > 0) {
                // Point downward when falling
                this.bird.setAngle(Math.min(this.bird.angle + 2, 30));
            } else if (this.bird.body) {
                // Point upward when rising
                this.bird.setAngle(Math.max(this.bird.angle - 4, -30));
            }
        }
    }
}
