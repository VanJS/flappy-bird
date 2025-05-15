import { BaseObject } from "../../utils/interfaces/object-abstract-class.ts";
import * as CONFIG from "../../utils/configuration.ts";
import { Game } from "../../scenes/Game.ts";
import { generateRandom } from "../../utils/generateRandom.ts";

export class Pipes extends BaseObject {
  private group: Phaser.Physics.Arcade.Group;
  private offset_X: number;
  private initialPos_X: number;

  private pipeGap_Y: number;
  private pipeGap_X: number;

  private passed: boolean;
  private birdX: number; // x position of bird
  private pipeIndex: number

  constructor(
    scene: Phaser.Scene,
    group: Phaser.Physics.Arcade.Group,
    offset: number = CONFIG.PIPE_OFFSET_X
  ) {
    super(scene);
    this.group = group;
    this.offset_X = offset;
    this.init();
    this.pipeIndex = 0;
  }

  init() {
    this.initialPos_X = this.scene.cameras.main.width + this.offset_X;
    this.pipeGap_Y = CONFIG.PIPE_GAP_Y_BASE;
    this.pipeGap_X = CONFIG.PIPE_GAP_X_BASE;
    this.passed = false;
    this.birdX = this.scene.cameras.main.width / 2 - CONFIG.BIRD_OFFSET_X;
  }

  getPipeGap_X() {
    return this.pipeGap_X;
  }

  private createPipe(
    x: number,
    y: number,
    rotation: number,
    pipeType: CONFIG.PipeType
  ): Phaser.Physics.Arcade.Sprite {
    const pipe = this.scene.physics.add
      .sprite(x, y, pipeType.key)
      .setDepth(CONFIG.PIPE_DEPTH)
      .setRotation(rotation);
    pipe.setScale(pipeType.scale);
    pipe.setVisible(true);

    // Set hitbox and offset
    pipe.body?.setSize(pipe.width * 0.95, pipe.height * 0.9);

    // Make the body static and immovable
    pipe.body?.setAllowGravity(false);
    pipe.body?.setImmovable(true);
    return pipe;
  }

  /**
   * remove pipes that is off screen
   */
  private removeOffScreenPipes() {
    this.group.getChildren().forEach((pipe) => {
      const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
      if (pipeSprite && pipeSprite.x + pipeSprite.displayWidth / 2 < 0) {
        this.group.remove(pipeSprite, true, true);
        console.log(`Destroy pipes at x: ${pipeSprite.x}, y: ${pipeSprite.y}`);
      }
    });
  }

  /**
   * check if its time to generate new pipe
   * @returns boolean
   */
  private shouldGenerateNewPipe() {
    const children = this.group.getChildren();
    if (children.length === 0) return true;
    const lastTopPipe = children[
      children.length - 2
    ] as Phaser.Physics.Arcade.Sprite;
    return this.initialPos_X - lastTopPipe.x >= this.pipeGap_X;
  }

  /**
   * randomly generate new top and bottom pipes
   */
  private generatePipes() {
    // Randomly select a pipe type
  
    const selectedPipeType = CONFIG.PIPE_TYPES[this.pipeIndex];
    if (this.pipeIndex === CONFIG.PIPE_TYPES.length - 1) {
      this.pipeIndex = 0;
    } else {
      this.pipeIndex++;
    }

    //create new bottom pipe
    const bottomPipe = this.createPipe(this.initialPos_X, 0, 0, selectedPipeType);

    //randomly generate Y position of bottom pipe
    const minBottomY =
      this.scene.cameras.main.height -
      bottomPipe.displayHeight / 2 +
      CONFIG.GROUND_HEIGHT;
    const maxBottonY = this.scene.cameras.main.height + CONFIG.GROUND_HEIGHT;
    const bottomY = generateRandom(minBottomY, maxBottonY);
    bottomPipe.setY(bottomY);

    //create new top pipe
    const topPipe = this.createPipe(this.initialPos_X, 0, Math.PI, selectedPipeType);

    //calculate Y position of top pipe to keep the gap
    const topY = bottomY - bottomPipe.displayHeight / 2 - this.pipeGap_Y;
    topPipe.setY(topY);

    // Add pipe pair to the group instead of the array
    this.group.add(topPipe);
    this.group.add(bottomPipe);
    this.scene.events.emit(`newPipe`, topPipe, bottomPipe, this.pipeGap_X);

    // debugging
    console.log(
      `Created pipes at x: ${this.initialPos_X}, topY: ${topY}, bottomY: ${bottomY}`
    );
  }

  private passingPipe() {
    return !!this.group.getChildren().find((pipe) => {
      const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
      return (
        this.birdX > pipeSprite.x - pipeSprite.displayWidth / 2 &&
        this.birdX < pipeSprite.x + pipeSprite.displayWidth / 2
      );
    });
  }

  private gainPoints() {
    const isPassing = this.passingPipe();
    if (this.passed && !isPassing) {
      this.scene.events.emit("pipePassed");
    }
    this.passed = isPassing;
  }

  update() {
    const gameScene = this.scene as Game;
    // update game difficulty
    const level = gameScene.getDifficultyLevel();
    this.pipeGap_X =
      CONFIG.PIPE_GAP_X_BASE - (level - 1) * CONFIG.GAP_X_REDUCTION;
    this.pipeGap_Y =
      CONFIG.PIPE_GAP_Y_BASE - (level - 1) * CONFIG.GAP_Y_REDUCTION;

    this.removeOffScreenPipes();

    if (this.shouldGenerateNewPipe()) {
      this.generatePipes();
    }

    // Iterate over the group's children to update positions
    this.group.getChildren().forEach((pipe) => {
      const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
      pipeSprite.x -= CONFIG.PIPE_SPEED;
    });

    this.gainPoints();
  }
}
