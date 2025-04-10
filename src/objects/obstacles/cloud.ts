
import { BaseObject } from '../../utils/interfaces/object-abstract-class.ts';
import * as CONFIG from '../../utils/configuration.ts'

export class Cloud extends BaseObject {

    constructor(scene: Phaser.Scene) {
    
        super(scene);
        this.init();  
    
    }

    init(): void {
        // TODO: change the depth
        const cloud = this.scene.physics.add.sprite(
            this.scene.cameras.main.width / 2, 
            this.scene.cameras.main.height / 2, 
            'cloud'
        )
        .setDepth(CONFIG.PIPE_DEPTH);
    }
    update(): void {
        // TODO: generate random clouds 
        
    }

}
