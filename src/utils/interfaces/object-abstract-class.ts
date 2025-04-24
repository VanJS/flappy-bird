
export abstract class BaseObject {
  protected scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  abstract init(): void;

  abstract update(time: number): void;
}