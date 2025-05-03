import { BaseObject } from "../../utils/interfaces/object-abstract-class.ts";
import * as CONFIG from "../../utils/configuration.ts";
import { generateRandom } from "../../utils/generateRandom.ts";
import { Game } from "../../scenes/Game.ts";

export class Thunder extends BaseObject {
  constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
  }

  init(): void {}

  update(): void {}
}
