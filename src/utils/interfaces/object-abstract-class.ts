
export abstract class BaseObject {
  [x: string]: any;
  protected scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  abstract init(): void;

  abstract update(): void;
}