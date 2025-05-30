import { Scene, GameObjects } from 'phaser';
import * as CONFIG from '../utils/configuration.ts'
import { OrientationGuide } from '../objects/OrientationGuide';
import { Logos } from '../objects/Logos';

export class MainMenu extends Scene {
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
    startKey: Phaser.Input.Keyboard.Key | undefined;
    private orientationGuide: OrientationGuide;

    constructor() {
        super('MainMenu');
    }

    create() {
        // Add cursor keys
        this.cursors = this.input.keyboard?.createCursorKeys();

        // Add space key for jumping
        this.startKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.background = this.add.image(512, 384, 'menu-bg');

        this.logo = this.add.image(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 40, 'logo').setScale(0.3);

        this.title = this.add.text(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 + 100, 'Click to Start', {
            fontFamily: 'PixelGame', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Create orientation guide
        this.orientationGuide = new OrientationGuide(this);
        
        // Add logo to the screen
        new Logos(this);

        this.input.once('pointerdown', () => {
            this.scene.start('CountDown');
        });
    }

    update() {
        // Check for jump input
        if (this.startKey && Phaser.Input.Keyboard.JustDown(this.startKey)) {
            this.scene.start('CountDown');
        }
    }
}
