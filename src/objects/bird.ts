import { Game } from '../scenes/Game.ts'
import { BaseObject } from '../utils/interfaces/object-abstract-class.ts';
import * as CONFIG from '../utils/configuration.ts'

export class Bird extends BaseObject {
    private bird: Phaser.Physics.Arcade.Sprite | undefined
    private x = 0;
    private y = 0;
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    private jumpKey: Phaser.Input.Keyboard.Key | undefined;

    constructor(scene: Phaser.Scene) {
        super(scene);
        this.init();
        if (this.bird?.body instanceof Phaser.Physics.Arcade.Body) {
            this.bird.body.collideWorldBounds = true;
        }
    }

    init() {
        this.x = this.scene.cameras.main.width / 2 - CONFIG.BIRD_OFFSET_X;
        this.y = this.scene.cameras.main.height / 2;
        this.bird = this.scene.physics.add.sprite(
            this.x,
            this.y,
            'bird_sprite')
            .setScale(0.2)
            .setDepth(CONFIG.BIRD_DEPTH)
            .play('bird_sprite');

        // Set hitbox and offset
        this.bird.body?.setSize(this.bird.width * 0.8, this.bird.height * 0.8);

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
        if (this.bird) {
            // Apply upward velocity for jump
            this.bird.setVelocityY(-CONFIG.JUMP_STRENGTH);
        }
    }

    handleCollision(): void {
        if (!this.bird) {
            return;
        }

        // Completely stop the bird's movement
        this.bird.setVelocity(0, 0);

        // Disable physics to ensure it doesn't move
        if (this.bird.body) {
            this.bird.body.enable = false;
        }

        // Stop any animations that might be playing
        this.bird.anims.stop();
    }

    update() {
        if (!this.bird) {
            return;
        }
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
