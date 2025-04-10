
import { BaseObject } from '../../utils/interfaces/object-abstract-class.ts';
import * as CONFIG from '../../utils/configuration.ts'

export class Thunder extends BaseObject {

    constructor(scene: Phaser.Scene) {
    
        super(scene);
        this.init();  
    
    }

    init(): void {
        // TODO: change the depth
        const thunder = this.scene.physics.add.sprite(
            this.scene.cameras.main.width / 2, 
            this.scene.cameras.main.height / 3, 
            'thunder'
        )
        .setDepth(CONFIG.PIPE_DEPTH);
    }
    update(): void {
        // TODO: generate random thunders 
    }

}
