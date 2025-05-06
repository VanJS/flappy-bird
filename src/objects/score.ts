export class Score extends Phaser.GameObjects.Text {
  private _score: number;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, "Score: 0", {
      fontFamily: "PixelGame",
      fontSize: 18,
      color: "#ffffff",
    });
    this.setScrollFactor(0).setDepth(100);
    this.setPosition(scene.cameras.main.width / 2 - this.displayWidth / 2, 50);
    this.init();
    this.scene.add.existing(this);
  }

  init(): void {
    this._score = 0;
  }

  get score(): number {
    return this._score;
  }

  update(): void { }

  addPoint(point: number) {
    this._score += point;
    this.setText(`Score: ${this._score}`);
  }
}
