import { BaseObject } from "../../utils/interfaces/object-abstract-class.ts";
import * as CONFIG from '../../utils/configuration.ts'
import { Game } from "../../scenes/Game.ts";
import { generateRandom } from "../../utils/generateRandom.ts";

export class Pipes extends BaseObject {

    private pipes: Phaser.Physics.Arcade.Sprite[] = [];
    private initialPos_X: number;
    
    
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.init();
    }

    init() {
        this.initialPos_X = this.scene.cameras.main.width + CONFIG.PIPE_OFFSET_X;
    }

    private createPipe (x: number, y: number, rotation: number ): Phaser.Physics.Arcade.Sprite {
        const pipe = this.scene.physics.add.sprite(
            x, 
            y, 
            'pipe'
        )
            .setDepth(CONFIG.PIPE_DEPTH)
            .setRotation(rotation);
        pipe.setScale(0.2);
        pipe.setVisible(true);
        return pipe;
    }

    /**
     * remove pipes that is off screen
     */
    private removeOffScreenPipes() {
        if(this.pipes.length) {
            const visiblePipes: Phaser.Physics.Arcade.Sprite[] = [];
            this.pipes.forEach((pipe) =>{
                // still on screen, push to visible array
                if(pipe && pipe.x + pipe.displayWidth / 2 > 0){
                    visiblePipes.push(pipe);
                } else {
                    // off screen, destroy
                    pipe.destroy();
                    //debugging
                    console.log(`Destroy pipes at x: ${pipe.x}, y: ${pipe.y}`);
                }
            })
            this.pipes = visiblePipes;
        }
    }

    /**
     * check if its time to generate new pipe
     * @returns boolean
     */
    private shouldGenerateNewPipe() {
        if (this.pipes.length === 0) return true;
        const lastTopPipe = this.pipes[this.pipes.length - 1]
        return this.initialPos_X - lastTopPipe.x >=  CONFIG.PIPE_GAP_X;
    }

    /**
     * randomly generate new top and bottom pipes
     */
    private generatePipes() {
        //create new bottom pipe 
        const bottomPipe = this.createPipe (this.initialPos_X, 0, 0);

        //randomly generate Y position of bottom pipe
        const minBottomY = this.scene.cameras.main.height - bottomPipe.displayHeight / 2 +  CONFIG.GROUND_HEIGHT
        const maxBottonY = this.scene.cameras.main.height + CONFIG.GROUND_HEIGHT
        const bottomY = generateRandom(minBottomY, maxBottonY);
        bottomPipe.setY(bottomY);
        
        //create new top pipe 
        const topPipe = this.createPipe(this.initialPos_X, 0, Math.PI);

        //calculate Y position of top pipe to keep the gap
        const topY = bottomY - bottomPipe.displayHeight / 2 - CONFIG.PIPE_GAP_Y;
        topPipe.setY(topY);

        // push to the lists
        this.pipes.push(topPipe, bottomPipe);

        // debugging
        console.log(`Created pipes at x: ${this.initialPos_X}, topY: ${topY}, bottomY: ${bottomY}`);

    }

    update(){
        const gameScene = this.scene as Game
        if(gameScene.gameStarted) {
            this.removeOffScreenPipes();
            if(this.shouldGenerateNewPipe()) {
                this.generatePipes();
            }
            
            this.pipes.forEach((pipe) => {
                pipe.setGravity(-CONFIG.GRAVITY);
                pipe.x -= CONFIG.BACKGROUND_SPEED;
            }) 
        }
        // TODO: collision and score update

    }
}