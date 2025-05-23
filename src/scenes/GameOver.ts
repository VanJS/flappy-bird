import { Scene } from 'phaser';
import * as CONFIG from '../utils/configuration.ts';
import { Scoreboard } from '../objects/scoreboard.ts';
import { NameEntry } from '../objects/name-entry.ts';
import { Logos } from '../objects/Logos';

export class GameOver extends Scene {
  score: number;

  scoreboard: Scoreboard | null;
  cursors: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
  startKey: Phaser.Input.Keyboard.Key | undefined;

  nameEntry: NameEntry | null;
  constructor() {
    super('GameOver');
  }

  init(data: { score: number }) {
    this.score = data.score;
  }

  create() {
    // Add cursor keys
    this.cursors = this.input.keyboard?.createCursorKeys();

    // Add space key for jumping
    this.startKey = this.input.keyboard?.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    this.add.image(512, 384, 'menu-bg');

    // Add logo to the screen
    new Logos(this);

    this.add
      .text(CONFIG.GAME_WIDTH / 2, 50, 'Game Over', {
        fontFamily: 'PixelGame',
        fontSize: 64,
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center',
      })
      .setOrigin(0.5);

    this.add
      .text(
        CONFIG.GAME_WIDTH / 2,
        CONFIG.GAME_HEIGHT / 5,
        `Your Score: ${this.score}`,
        {
          fontFamily: 'PixelGame',
          fontSize: 18,
          color: '#ffffff',
          stroke: '#000000',
          strokeThickness: 6,
          align: 'center',
        }
      )
      .setOrigin(0.5);

    // create scoreboard
    this.scoreboard = new Scoreboard(this);

    // update the scoreboard if high score
    const ranking = this.scoreboard.checkRanking(this.score);
    if (ranking !== null) {
      this.nameEntry = new NameEntry(this);
      this.nameEntry.create();
      this.events.once('nameSubmitted', (name: string) => {
        if (this.scoreboard) {
          this.scoreboard.create();
          this.scoreboard.updateHighScores(this.score, name);
        }
      });
    }
    // display the scoreboard
    else {
      this.scoreboard.create();
      this.scoreboard.displayHighScores();
    }

    const restartButton = this.add.text(
      CONFIG.GAME_WIDTH / 2,
      CONFIG.GAME_HEIGHT - 50,
      'Restart',
      {
        fontFamily: 'PixelGame',
        fontSize: 24,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 8,
        align: 'center',
      }
    );
    restartButton.setOrigin(0.5);
    restartButton
      .setInteractive()
      .on('pointerover', () => {
        restartButton.setStyle({ fill: '#ff0' });
      })
      .on('pointerout', () => {
        restartButton.setStyle({ fill: '#fff' });
      })
      .on('pointerdown', () => {
        this.scene.start('CountDown');
      });

    //reset scoreboard
    if (this.input.keyboard) {
      this.input.keyboard.once(
        'keydown-R',
        (event: Phaser.Input.Keyboard.Key) => {
          if (event.shiftKey && this.scoreboard) {
            this.scoreboard.resetHighScores();
          }
        }
      );
    }
  }

  update() {
    // Check for jump input
    if (this.startKey && Phaser.Input.Keyboard.JustDown(this.startKey)) {
      if (this.scoreboard) {
        this.scoreboard = null;
      }
      this.scene.start('CountDown');
    }
  }
}
