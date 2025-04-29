import { BaseObject } from "../../utils/interfaces/object-abstract-class.ts";
import * as CONFIG from '../../utils/configuration.ts'
import { Game } from "../../scenes/Game.ts";
import { generateRandom } from "../../utils/generateRandom.ts";


export class Pipes extends BaseObject {

    private pipes: Phaser.Physics.Arcade.Sprite[] = [];
    private offset_X: number;
    private initialPos_X: number;

    private pipeGap_Y: number;
    private pipeGap_X: number;

    private passed: boolean;
    private birdX: number; // x position of bird
    
    
    constructor(scene: Phaser.Scene, offset: number = CONFIG.PIPE_OFFSET_X) {
        super(scene)
        this.offset_X = offset
        this.init();
    }
    
    getPipes(): Phaser.Physics.Arcade.Sprite[] {
        return this.pipes;
    }

    init() {
        this.initialPos_X = this.scene.cameras.main.width + this.offset_X;
        this.pipeGap_Y = CONFIG.PIPE_GAP_Y_BASE;
        this.pipeGap_X = CONFIG.PIPE_GAP_X_BASE;
        this.passed = false;
        this.birdX = this.scene.cameras.main.width / 2 - CONFIG.BIRD_OFFSET_X;
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

        // Set hitbox and offset
        pipe.body?.setSize(pipe.width * 0.95, pipe.height * 0.9);


        // Make the body static and immovable
        pipe.body?.setAllowGravity(false);
        pipe.body?.setImmovable(true);
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
        const lastTopPipe = this.pipes[this.pipes.length - 2]
        return this.initialPos_X - lastTopPipe.x >=  this.pipeGap_X;
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
        const topY = bottomY - bottomPipe.displayHeight / 2 - this.pipeGap_Y;
        topPipe.setY(topY);

        // add pipe pair to the list
        this.pipes.push(topPipe, bottomPipe);
        this.scene.events.emit('newPipe', topPipe, bottomPipe);

        // debugging
        console.log(`Created pipes at x: ${this.initialPos_X}, topY: ${topY}, bottomY: ${bottomY}`);

    }

    private passingPipe() {
        return !! this.pipes.find((pipe) => {
           return this.birdX > pipe.x - pipe.displayWidth / 2 
                && this.birdX < pipe.x + pipe.displayWidth / 2;
        })
    }

    private gainPoints() {
        const isPassing = this.passingPipe();
        if(this.passed && !isPassing) {
            this.scene.events.emit('pipePassed');
        }
        this.passed = isPassing;
    }

    update(){
        const gameScene = this.scene as Game
        if(!gameScene.isGamePaused && gameScene.gameStarted) {
            
            // update game difficulty
            const level = gameScene.getDifficultyLevel();
            this.pipeGap_X = CONFIG.PIPE_GAP_X_BASE - (level -1) * CONFIG.GAP_X_REDUCTION;
            this.pipeGap_Y = CONFIG.PIPE_GAP_Y_BASE - (level -1) * CONFIG.GAP_Y_REDUCTION;

            this.removeOffScreenPipes();

            if(this.shouldGenerateNewPipe()) {
                this.generatePipes();
            }
        
            this.pipes.forEach((pipe) => {
                pipe.x -= CONFIG.PIPE_SPEED;
            }) 

            this.gainPoints();
        }

    }
}