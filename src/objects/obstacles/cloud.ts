import { BaseObject } from "../../utils/interfaces/object-abstract-class.ts";
import * as CONFIG from "../../utils/configuration.ts";
import { generateRandom } from "../../utils/generateRandom.ts";
import { Game } from "../../scenes/Game.ts";

export class Cloud extends BaseObject {
  private cloudGroup: Phaser.Physics.Arcade.Group;
  private pipeListener: Function;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
    this.pipeListener = this.GenerateNewCloud.bind(this);

    this.scene.events.on(`newPipe`, this.pipeListener);

    // Clean up listeners when scene shuts down
    this.scene.events.once("shutdown", () => {
      this.scene.events.off(`newPipe`, this.pipeListener);
    });
  }

  getCloudGroup(): Phaser.Physics.Arcade.Group {
    return this.cloudGroup;
  }

  init(): void {
    this.cloudGroup = this.scene.physics.add.group({
      allowGravity: false,
      immovable: true,
      velocityX: -CONFIG.PIPE_SPEED,
    });
  }

  private createCloud(x: number, y: number): Phaser.Physics.Arcade.Sprite {
    const cloud = this.cloudGroup
      .create(x, y, "cloud")
      .setDepth(CONFIG.CLOUD_DEPTH);
    const scale = generateRandom(0.5, 1.2);
    cloud.setScale(scale);
    this.scene.events.emit("cloudCreated", cloud);
    console.log(`Created cloud at x: ${x}, y: ${y}`);
    return cloud;
  }

  /**
   * remove clouds that are off screen
   */
  private removeOffScreenClouds() {
    this.cloudGroup.getChildren().forEach((cloud) => {
      const c = cloud as Phaser.Physics.Arcade.Sprite;
      if (c && c.x + c.displayWidth / 2 < 0) {
        this.cloudGroup.remove(c, true, true);
        console.log(`Destroy clouds at x: ${c.x}, y: ${c.y}`);
      }
    });
  }

  private GenerateNewCloud = (
    topPipe: Phaser.Physics.Arcade.Sprite,
    bottomPipe: Phaser.Physics.Arcade.Sprite,
    pipeGap_X: number
  ) => {
    const num = Math.floor(pipeGap_X / CONFIG.CLOUD_GAP_X) - 1;
    for (let i = 0; i < num; i++) {
      const cloudX =
        topPipe.x +
        topPipe.displayWidth / 2 +
        CONFIG.CLOUD_OFFSET_X +
        i * CONFIG.CLOUD_GAP_X;
      const minY = CONFIG.CLOUD_OFFSET_Y;
      const maxY =
        this.scene.cameras.main.height -
        CONFIG.GROUND_HEIGHT -
        bottomPipe.displayHeight;
      const cloudY = generateRandom(minY, maxY);
      this.createCloud(cloudX, cloudY);
    }
  };

  update(): void {
    const gameScene = this.scene as Game;
    if (!gameScene.isGamePaused && gameScene.gameStarted) {
      this.removeOffScreenClouds();
      this.cloudGroup.getChildren().forEach((cloud) => {
        const c = cloud as Phaser.Physics.Arcade.Sprite;
        c.x -= CONFIG.PIPE_SPEED;
      });
    }
  }
}
