import { BaseObject } from "../../utils/interfaces/object-abstract-class.ts";
import * as CONFIG from "../../utils/configuration.ts";
import { generateRandom } from "../../utils/generateRandom.ts";
import { Game } from "../../scenes/Game.ts";

export class Thunder extends BaseObject {
  private thunderGroup: Phaser.Physics.Arcade.Group;
  private pipeListener: Function;

  constructor(scene: Phaser.Scene) {
    super(scene);
    this.init();
    this.pipeListener = this.GenerateNewThunder.bind(this);

    // Use the scene's unique key in the event name to prevent conflicts
    const sceneKey = this.scene.scene.key;
    this.scene.events.on(`newPipe_${sceneKey}`, this.pipeListener);

    // Clean up listeners when scene shuts down
    this.scene.events.once("shutdown", () => {
      this.scene.events.off(`newPipe_${sceneKey}`, this.pipeListener);
    });
  }

  getThunderGroup(): Phaser.Physics.Arcade.Group {
    return this.thunderGroup;
  }

  init(): void {
    this.thunderGroup = this.scene.physics.add.group({
      allowGravity: false,
      immovable: true,
      velocityX: -CONFIG.PIPE_SPEED,
    });
  }

  private createThunder(x: number, y: number): Phaser.Physics.Arcade.Sprite {
    const thunder = this.thunderGroup
      .create(x, y, "thunder")
      .setDepth(CONFIG.PIPE_DEPTH);
    thunder.setData("isCollectable", true);
    const scale = generateRandom(0.8, 1.2);
    thunder.setScale(scale);
    this.scene.events.emit("thunderCreated", thunder);
    console.log(`Created thunder at x: ${x}, y: ${y}`);
    return thunder;
  }

  /**
   * remove thunders that is off screen
   */
  private removeOffScreenThunders() {
    this.thunderGroup.getChildren().forEach((thunder) => {
      const t = thunder as Phaser.Physics.Arcade.Sprite;
      if (t && t.x + t.displayWidth / 2 < 0) {
        this.thunderGroup.remove(t, true, true);
        console.log(`Destroy thunders at x: ${t.x}, y: ${t.y}`);
      }
    });
  }

  private GenerateNewThunder = (
    topPipe: Phaser.Physics.Arcade.Sprite,
    bottomPipe: Phaser.Physics.Arcade.Sprite,
    pipeGap_X: number
  ) => {
    const num = Math.floor(pipeGap_X / CONFIG.CLOUD_GAP_X) - 1;
    for (let i = 0; i < num; i++) {
      const thunderX =
        topPipe.x +
        topPipe.displayWidth / 2 +
        CONFIG.CLOUD_OFFSET_X +
        i * CONFIG.CLOUD_GAP_X;
      const minY = CONFIG.CLOUD_OFFSET_Y;
      const maxY = this.scene.cameras.main.height - CONFIG.GROUND_HEIGHT;
      const thunderY = generateRandom(minY, maxY);
      const thunder = this.createThunder(thunderX, thunderY);
      this.scene.physics.add.collider(thunder, topPipe);
      this.scene.physics.add.collider(thunder, bottomPipe);
    }
  };

  update(): void {
    const gameScene = this.scene as Game;
    if (!gameScene.isGamePaused && gameScene.gameStarted) {
      this.removeOffScreenThunders();
      this.thunderGroup.getChildren().forEach((thunder) => {
        const t = thunder as Phaser.Physics.Arcade.Sprite;
        const verticalMovement =
          Math.sin(this.scene.time.now / 500 + t.x) * 0.5;
        t.y += verticalMovement;
        t.x -= CONFIG.PIPE_SPEED;
      });
    }
  }
}
