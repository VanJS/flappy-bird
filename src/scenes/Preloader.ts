import { Scene } from 'phaser';
import { AnimationData } from '../utils/interfaces/animation-interface';

export class Preloader extends Scene {
    private animationData: AnimationData[]

    constructor() {
        super('Preloader');
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'menu-bg');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload() {

        //  preload animation json file
        this.load.json('animations_json', 'assets/data/animations.json');

        //  Load the assets for the game
        this.load.pack('asset_pack', 'assets/data/assets.json');


        // Load custom font
        this.load.font(
            'PixelGame',
            'assets/fonts/PressStart2P-Regular.ttf',
            'truetype'
        );

        this.load.font(
            'Kenney-Future-Narrow',
            'assets/fonts/Kenney-Future-Narrow.ttf',
            'truetype'
        );

        // load background music
        this.load.audio({
            key: 'background-music',
            url: ['assets/audio/background-music.ogg', 'assets/audio/background-music.mp3']
        })

        // Load collision sound
        this.load.audio('hit_sound', 'assets/audio/hit.mp3');
        
        // Load countdown sounds
        this.load.audio('countdown1', 'assets/audio/countdown/count-down1.mp3');
        this.load.audio('countdown2', 'assets/audio/countdown/count-down2.MP3');
        this.load.audio('countdown3', 'assets/audio/countdown/count-down3.MP3');
        this.load.audio('countdown4', 'assets/audio/countdown/count-down4.MP3');
        this.load.audio('countdown5', 'assets/audio/countdown/count-down5.MP3');
        

    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        // create animations
        this.createAnimations();

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('MainMenu');
    };

    createAnimations() {

        this.animationData = this.cache.json.get('animations_json');

        /* Loop through to load the animation */
        this.animationData.forEach((animation: AnimationData) => {
            /* Create an array of frame objects */
            const frames = animation.frames
                ? this.anims.generateFrameNames(animation.assetKey, { frames: animation.frames as number[] })
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
