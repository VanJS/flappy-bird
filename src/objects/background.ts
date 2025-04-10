import { BaseObject } from "../utils/interfaces/object-interface";
import { IExtendedScene } from "../utils/interfaces/scene-interface";
import * as CONFIG from '../utils/configuration.ts'

export class Background extends BaseObject {
    private sprite: Phaser.GameObjects.TileSprite | undefined;

    constructor(scene: Phaser.Scene) {
        super(scene)
        this.init();
    }
    
    init(): void {
        this.sprite = this.scene.add.tileSprite(
            0, 
            0, 
            this.scene.cameras.main.width, 
            this.scene.cameras.main.height, 
            'bg'
        )
        .setOrigin(0)
        .setDepth(CONFIG.BACKGROUND_DEPTH);
    }

    update() {
        if (!this.sprite) {
            return;
        }
        this.sprite.tilePositionX += CONFIG.BACKGROUND_SPEED;
    }
}