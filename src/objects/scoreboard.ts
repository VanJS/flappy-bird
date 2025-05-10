import { Scene } from "phaser";
import { HighScore } from "../utils/interfaces/high-score";

export class Scoreboard {
  private colors: string[] = [
    "#ff0000",
    "#ffff00",
    "#00ffff",
    "#00ff00",
    "#ff00ff",
  ];
  private defaultScores: HighScore[] = [
    { name: "---", score: 0 },
    { name: "---", score: 0 },
    { name: "---", score: 0 },
    { name: "---", score: 0 },
    { name: "---", score: 0 },
  ];
  private ranks: string[] = ["1ST", "2ND", "3RD", "4TH", "5TH"];
  private localStorageKey: string = "FlappyDuckHighScores";

  private scene: Scene;
  private highScores: HighScore[];
  private x: number;
  private y: number;
  private width: number;

  private rankText: Phaser.GameObjects.Text[] = [];
  private playerText: Phaser.GameObjects.Text[] = [];
  private scoreText: Phaser.GameObjects.Text[] = [];

  constructor(scene: Scene) {
    this.scene = scene;
    this.x = scene.cameras.main.width / 2;
    this.y = 200;
    this.width = scene.cameras.main.width;
    this.highScores = this.getHighScores();
  }

  public create() {
    // Ranking table
    this.scene.add
      .text(this.x, this.y - 50, "- RANKING -", {
        fontFamily: "PixelGame",
        fontSize: 24,
        color: "#00ffff",
        align: "center",
      })
      .setOrigin(0.5);

    // Header
    this.scene.add
      .text(this.x - this.width * 0.25, this.y, "- RANK", {
        fontFamily: "PixelGame",
        fontSize: 18,
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.scene.add
      .text(this.x, this.y, "PLAYER", {
        fontFamily: "PixelGame",
        fontSize: 18,
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.scene.add
      .text(this.x + this.width * 0.25, this.y, "SCORE -", {
        fontFamily: "PixelGame",
        fontSize: 18,
        color: "#ffffff",
      })
      .setOrigin(0.5);
  }

  /**
   * return defaultScores if no record otherwise return stored highscores
   * @returns
   */
  private getHighScores(): HighScore[] {
    try {
      const storedScores = localStorage.getItem(this.localStorageKey);
      if (!storedScores) {
        localStorage.setItem(
          this.localStorageKey,
          JSON.stringify(this.defaultScores)
        );
        return this.defaultScores;
      }
      return JSON.parse(storedScores);
    } catch (e) {
      console.error("Error accessing localStorage:", e);
      return this.defaultScores;
    }
  }

  /**
   * get the ranking index of the score
   * @param score new score to check
   * @returns ranking index if score is higher than any of the high scores, otherwise null
   */
  private checkRanking(score: number): number | null {
    if (score <= 0) return null;
    for (let i = 0; i < this.highScores.length; i++) {
      if (score > this.highScores[i].score) {
        return i;
      }
    }
    return null;
  }

  /**
   * display the high scores on the screen
   */
  private displayHighScores() {
    //rank text
    this.highScores.forEach((entry, index) => {
      const rank = this.scene.add
        .text(
          this.x + 10 - this.width * 0.25,
          this.y + 40 + index * 35,
          this.ranks[index],
          {
            fontFamily: "PixelGame",
            fontSize: 24,
            color: this.colors[index],
            align: "center",
          }
        )
        .setOrigin(0.5);
      this.rankText.push(rank);

      //player text
      const player = this.scene.add
        .text(this.x, this.y + 40 + index * 35, entry.name, {
          fontFamily: "PixelGame",
          fontSize: 18,
          color: this.colors[index],
        })
        .setOrigin(0.5);
      this.playerText.push(player);

      //score text
      const score = this.scene.add
        .text(
          this.x - 10 + this.width * 0.25,
          this.y + 40 + index * 35,
          `${entry.score}`,
          {
            fontFamily: "PixelGame",
            fontSize: 18,
            color: this.colors[index],
          }
        )
        .setOrigin(0.5);
      this.scoreText.push(score);
    });
  }

  /**
   * update the high scores if the score is higher than any of the recorded high scores
   * @param score new score to check
   * @param playerName name of the player
   */
  public updateHighScores(score: number, playerName: string = "Husky") {
    const ranking = this.checkRanking(score);
    if (ranking == null) return;
    const scores = this.getHighScores();
    scores.splice(ranking, 0, { name: playerName, score: score });
    scores.pop();
    try {
      localStorage.setItem(this.localStorageKey, JSON.stringify(scores));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
    this.highScores = scores;
    this.clearHighScoreTexts();
    this.displayHighScores();
  }

  /**
   * clear the high score texts from the screen
   */
  private clearHighScoreTexts() {
    this.rankText.forEach((rank) => rank.destroy());
    this.playerText.forEach((player) => player.destroy());
    this.scoreText.forEach((score) => score.destroy());

    this.rankText = [];
    this.playerText = [];
    this.scoreText = [];
  }

  /**
   * clear the highscores from local storage and reset the display
   * for testing purposes
   */
  public resetHighScores(): void {
    try {
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(this.defaultScores)
      );

      this.highScores = this.defaultScores;

      this.clearHighScoreTexts();
      this.displayHighScores();
    } catch (e) {
      console.error("Error resetting high scores:", e);
    }
  }
}
