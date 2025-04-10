import { Boot } from './scenes/Boot.ts';
import { Game as MainGame } from './scenes/Game.ts';
import { GameOver } from './scenes/GameOver.ts';
import { MainMenu } from './scenes/MainMenu.ts';
import { Preloader } from './scenes/Preloader.ts';
import * as CONFIG from './utils/configuration.ts'
import { Game, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: CONFIG.GAME_WIDTH,
    height: CONFIG.GAME_HEIGHT,
    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: true,
        },   
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver
    ]
};

export default new Game(config);
