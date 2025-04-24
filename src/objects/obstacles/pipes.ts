import { BaseObject } from "../../utils/interfaces/object-abstract-class.ts";
import * as CONFIG from '../../utils/configuration.ts'
import { Game } from "../../scenes/Game.ts";
import { generateRandom } from "../../utils/generateRandom.ts";

export class Pipes extends BaseObject {

    private pipes: Phaser.Physics.Arcade.Sprite[] = [];
    private initialPos_X: number;

    private gameStartTime: number = 0;
    private difficultyInterval: number = CONFIG.DIFFICULTY_INTERVAL; 
    private difficultyLevel: number;
    private pipeGapY: number;
    private pipeGapX: number;

    private pointEarned: () => void;
    private passed: boolean;
    private birdX: number;
    
    
    constructor(scene: Phaser.Scene, addPoint: () => void) {
        super(scene);
        this.init();
        this.pointEarned = addPoint;
    }

    init() {
        this.initialPos_X = this.scene.cameras.main.width + CONFIG.PIPE_OFFSET_X;
        this.difficultyLevel = 1;
        this.pipeGapY = CONFIG.PIPE_GAP_Y_Level_1;
        this.pipeGapX = CONFIG.PIPE_GAP_X_Level_1;
        this.passed = false;
        this.birdX = this.scene.cameras.main.width / 2 - CONFIG.BIRD_OFFSET_X;
    }

    private resetGameTime(currentTime: number) {
        this.gameStartTime = currentTime;
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
        return this.initialPos_X - lastTopPipe.x >=  this.pipeGapX;
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
        const topY = bottomY - bottomPipe.displayHeight / 2 - this.pipeGapY;
        topPipe.setY(topY);

        // push to the lists
        this.pipes.push(topPipe, bottomPipe);

        // debugging
        console.log(`Created pipes at x: ${this.initialPos_X}, topY: ${topY}, bottomY: ${bottomY}`);

    }

    /**
     * Update difficulty level based on elapsed time.
     * @param currentTime Current game time in ms
     */
    private updateDifficulty(currentTime: number) {
        const elapsedTime = currentTime - this.gameStartTime;
        if(elapsedTime >= 2 * this.difficultyInterval){
            this.difficultyLevel = 3;
            this.pipeGapX = CONFIG.PIPE_GAP_X_Level_3;
            this.pipeGapY = CONFIG.PIPE_GAP_Y_Level_3;
            console.log(`Difficulty increased to level 3. Vertical gap reduced to ${this.pipeGapY}`);
        } else if(elapsedTime >= this.difficultyInterval) {
            this.difficultyLevel = 2;
            this.pipeGapX = CONFIG.PIPE_GAP_X_Level_2;
            this.pipeGapY = CONFIG.PIPE_GAP_Y_Level_2;
            console.log(`Difficulty increased to level 2. Horizontal gap reduced to ${this.pipeGapX}`);
        }

    }

    private passingPipe() {
        return !! this.pipes.find((pipe) => {
           return this.birdX > pipe.x - pipe.displayWidth / 2 
                && this.birdX < pipe.x + pipe.displayWidth / 2;
        })
    }

    update(time: number){
        const currentTime = time ?? this.scene.time.now;
        const gameScene = this.scene as Game
        if(gameScene.gameStarted) {
            
            if(this.gameStartTime == 0 && currentTime){
                this.resetGameTime(currentTime);
            }

            this.updateDifficulty(currentTime);

            this.removeOffScreenPipes();

            if(this.shouldGenerateNewPipe()) {
                this.generatePipes();
            }
        
            this.pipes.forEach((pipe) => {
                pipe.setGravity(-CONFIG.GRAVITY);
                pipe.x -= CONFIG.BACKGROUND_SPEED;
            }) 

            const isPassing = this.passingPipe();
            if(this.passed && !isPassing) {
                this.pointEarned();
            }
            this.passed = isPassing;
        }

    }
}