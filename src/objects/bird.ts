
import { BaseObject } from '../utils/interfaces/object-interface';
import { IExtendedScene } from '../utils/interfaces/scene-interface';
import * as CONFIG from '../utils/configuration.ts'

export class Bird extends BaseObject {
    private bird : Phaser.Physics.Arcade.Sprite | undefined
    private x = 0;
    private y = 0;
    private idleDirection = 1;

    constructor(scene: IExtendedScene) {
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
        // this.bird.setAccelerationY(0);
    }

    update() {
        if (!this.bird) {
            return;
        }
        // create swing effect before game start
        if(! this.scene.gameStarted) {
            if (this.bird.y < this.y - CONFIG.IDLE_OFFEST_Y) {
                this.idleDirection *= -1;
            } else if(this.bird.y > this.y + CONFIG.IDLE_OFFEST_Y) {
                this.idleDirection *= -1;
            }
            this.bird.y += this.idleDirection;
        } 
    }
}
