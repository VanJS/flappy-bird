import { Boot } from './scenes/Boot.ts';
import { Game as MainGame } from './scenes/Game.ts';
import { MainMenu } from './scenes/MainMenu.ts';
import { GameOver } from './scenes/GameOver.ts';
import { Preloader } from './scenes/Preloader.ts';
import * as CONFIG from './utils/configuration.ts'
import { Game, Types } from "phaser";
import CountDown from './scenes/CountDown.ts';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: CONFIG.GAME_WIDTH,
    height: CONFIG.GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: window.location.search.includes('debugphysics')
        },
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        CountDown,
        MainGame,
        GameOver,
    ]
};

export default new Game(config);
