import { BaseObject } from "../../utils/interfaces/object-interface";
import * as CONFIG from '../../utils/configuration.ts'

export class Pipes extends BaseObject {
    pipe: Phaser.Physics.Arcade.Sprite;
    
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.init();
    }

    init() {
        this.pipe = this.scene.physics.add.sprite(
            this.scene.cameras.main.width / 2, 
            this.scene.cameras.main.height, 
            'pipe'
        )
        .setDepth(CONFIG.PIPE_DEPTH);
        
    }

    update(){
        
    }
}