
import { BaseObject } from '../../utils/interfaces/object-interface';
import { IExtendedScene } from '../../utils/interfaces/scene-interface';
import * as CONFIG from '../../utils/configuration.ts'

export class Thunder extends BaseObject {

    constructor(scene: Phaser.Scene) {
    
        super(scene);
        this.init();  
    
    }

    init(): void {
        const thunder = this.scene.physics.add.sprite(
            this.scene.cameras.main.width / 2, 
            this.scene.cameras.main.height / 3, 
            'thunder'
        )
        .setDepth(CONFIG.PIPE_DEPTH);
    }
    update(): void {
        
    }

}
