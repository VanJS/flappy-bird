import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  preload animation json file
        this.load.json('animations_json', 'assets/data/animations.json');  
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
