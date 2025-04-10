import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.pack('asset_pack', 'assets/data/assets.json');
        this.load.json('animations_json', 'assets/data/animations.json');

    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.#createAnimations();
        this.scene.start('MainMenu');
    };

    #createAnimations() {
        interface AnimationData {
            key: string;
            assetKey: string;
            frames: number[];
            frameRate: number;
            repeat: number;
        }

        const animationData: AnimationData[] = this.cache.json.get('animations_json');

        /* Loop through to load the animation */
        animationData.forEach((animation: AnimationData) => {
            /* Create an array of frame objects */
            const frames = animation.frames
            ? this.anims.generateFrameNames(animation.assetKey, {frames: animation.frames as number[]})
            : this.anims.generateFrameNames(animation.assetKey); 
        
            this.anims.create({
            key: animation.key,
            frames: frames,
            frameRate: animation.frameRate,
            repeat: animation.repeat,
            });
        });
    }
}
