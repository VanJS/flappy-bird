import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        this.load.image('menu-bg', 'assets/images/menu-bg.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
