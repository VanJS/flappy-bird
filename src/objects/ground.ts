import { BaseObject } from "../utils/interfaces/object-abstract-class.ts";
import * as CONFIG from '../utils/configuration.ts'

export class Ground extends BaseObject {
    private ground: Phaser.GameObjects.TileSprite | undefined;
     
     constructor(scene: Phaser.Scene) {
        super(scene)
        this.init();
     }

     init(): void {
       this.ground = this.scene.add.tileSprite(
        0,
        this.scene.cameras.main.height - CONFIG.GROUND_HEIGHT,
        this.scene.cameras.main.width,
        CONFIG.GROUND_HEIGHT,
        'ground'
       )
       .setOrigin(0)
       .setScrollFactor(0)
       .setDepth(CONFIG.GROUND_DEPTH);
    }
    update(): void {
        if(!this.ground) {
            return;
        }
        // create scrolling effects
        this.ground.tilePositionX += CONFIG.GROUND_SPEED;
        
    }
}