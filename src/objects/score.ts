export class Score extends Phaser.GameObjects.Text {
  private score: number;

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
    this.score = 0;
  }

  update(): void {}

  addPoint(point: number) {
    this.score += point;
    this.setText(`Score: ${this.score}`);
  }
}
