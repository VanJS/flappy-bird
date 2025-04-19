import { BaseObject } from "../../utils/interfaces/object-abstract-class.ts";
import * as CONFIG from '../../utils/configuration.ts'
import { Game } from "../../scenes/Game.ts";
import { generateRandom } from "../../utils/generateRandom.ts";

export class Pipes extends BaseObject {

    private pipes: Phaser.Physics.Arcade.Sprite[][] = [];
    
    constructor(scene: Phaser.Scene) {
        super(scene);
        this.init();
    }

    init() {
    }

    private createPipe (x: number, y: number, rotation: number ): Phaser.Physics.Arcade.Sprite {
        const pipe = this.scene.physics.add.sprite(
            x, 
            y, 
            'pipe'
        )
        .setDepth(CONFIG.PIPE_DEPTH)
        .setRotation(rotation);
        pipe.setVisible(true);
        return pipe;
    }

    private generatePipes() {

        // initial position
        const initialPos_X = this.scene.cameras.main.width + CONFIG.PIPE_OFFSET_X;
        console.log("initialPos_X:", initialPos_X);
        //if still pipes left
        if(this.pipes.length) {
            const firstTopPipe = this.pipes[0][0];
            // if the first pipe is completely off-screen, clear the top and bottom pipe set
            if (firstTopPipe.x + firstTopPipe.displayWidth < 0){
                const pair = this.pipes.shift();
                if(pair) {
                    const[topPipe, botPipe] = pair;
                    topPipe.destroy();
                    botPipe.destroy();
                }  
            }
            // check if add new pipes
            const lastTopPipe = this.pipes[this.pipes.length - 1][0]
            if(initialPos_X - lastTopPipe.x <  CONFIG.PIPE_GAP_X ) return;
        }

        //add new bottom pipe 
        const bottomPipe = this.createPipe (initialPos_X, 0, 0);

        //randomly generate position on Y of bottom pipe
        const minBottomY = this.scene.cameras.main.height - bottomPipe.displayHeight / 2 +  CONFIG.GROUND_HEIGHT
        const maxBottonY = this.scene.cameras.main.height +  bottomPipe.displayHeight / 2 -  CONFIG.GROUND_HEIGHT
        const bottomY = generateRandom(minBottomY, maxBottonY);
        bottomPipe.setY(bottomY);
        
        //add new top pipe 
        const topPipe = this.createPipe(initialPos_X, 0, Math.PI);

        //Y of top pipe to keep the gap
        const topY = bottomY - bottomPipe.displayHeight / 2 - CONFIG.PIPE_GAP_Y;
        topPipe.setY(topY);

        // push to the lists
        this.pipes.push([topPipe, bottomPipe]);
        // debugging
        console.log(`Created pipes at x: ${initialPos_X}, topY: ${topY}, bottomY: ${bottomY}`);

    }

    update(){
        const gameScene = this.scene as Game
        if(gameScene.gameStarted) {
            this.generatePipes();
            this.pipes.forEach(([topPipe, bottomPipe]) => {
                topPipe.setGravity(-CONFIG.GRAVITY);
                topPipe.x -= CONFIG.BACKGROUND_SPEED;
                bottomPipe.setGravity(-CONFIG.GRAVITY);
                bottomPipe.x -= CONFIG.BACKGROUND_SPEED;
            }) 
        }
        // TODO: collision and score update

    }
}