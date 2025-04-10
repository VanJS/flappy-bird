import { Scene } from 'phaser';
import { Bird } from '../objects/bird.ts';
import { Cloud } from '../objects/obstacles/cloud.ts';
import { BaseObject } from '../utils/interfaces/object-abstract-class.ts';
import { Background } from '../objects/background.ts';
import * as CONFIG from '../utils/configuration.ts'
import { Pipes } from '../objects/obstacles/pipes.ts';
import { Ground } from '../objects/ground.ts';
import { Thunder } from '../objects/obstacles/thunder.ts';
export class Game extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    msg_text : Phaser.GameObjects.Text;

    private isGameStarted = false;
    private isGameOver = false;

    private gameObjects: BaseObject[] = [];

    constructor ()
    {
        super('Game');
    }

    preload() {

        this.load.pack('asset_pack', 'assets/data/assets.json');
    }

    get gameStarted() {
        return this.isGameStarted;
    }

    get gameOver() {
        return this.isGameOver;
    }

    create ()
    {  
        // create objects to the screen
        this.gameObjects.push(
            new Background(this), 
            new Ground(this), 
            new Bird(this), 
            new Pipes(this), 
            new Cloud(this),
            new Thunder(this)
        );

        
        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });
    }

    update () {
        this.gameObjects.forEach((object) => object.update());
    }
}
