import { Scene } from "phaser";
import * as CONFIG from "../utils/configuration.ts";
import { BaseObject } from "../utils/interfaces/object-abstract-class";
import { Background } from "../objects/background";
import { Ground } from "../objects/ground";
import { Bird } from "../objects/bird";
import { Pipes } from "../objects/obstacles/pipes";
import { Cloud } from "../objects/obstacles/cloud";
import { Score } from "../objects/score.ts";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;

  private gameObjects: BaseObject[] = [];

  // difficulty level management
  private difficultyLevel: number = 1;
  private gameStartTime: number = 0;
  private targetLevelTime: number = 0;
  private difficultyInterval: number = CONFIG.DIFFICULTY_INTERVAL;

  private score: Score;

  background: Phaser.GameObjects.TileSprite;
  scoreText: Phaser.GameObjects.Text;
  uiCamera: Phaser.Cameras.Scene2D.Camera;

  private pipesGroup: Phaser.Physics.Arcade.Group;

  constructor() {
    super("Game");
  }

  getDifficultyLevel(): number {
    return this.difficultyLevel;
  }

  setLevel(level: number) {
    this.difficultyLevel = level;
    console.log(`Difficulty increased to level ${level}`);
  }

  init() {
    // Reset game state variables when scene starts or restarts
    this.gameObjects = [];
    this.difficultyLevel = 1;
    this.gameStartTime = 0;
    this.targetLevelTime = 0;

    // Play background music
    this.sound.play('background-music', { loop: true, volume: 0.5 });

    // Apply gravity to the world
    this.physics.world.gravity.y = CONFIG.GRAVITY;
    this.gameStartTime = this.time.now;
    this.targetLevelTime = this.gameStartTime + this.difficultyInterval;
  }

  create() {
    // Set up main camera
    this.camera = this.cameras.main;

    // Set world bounds for the game (extend far to the right)
    // TODO: Replace with actual bounds
    this.physics.world.setBounds(0, 0, 10000, CONFIG.GAME_HEIGHT);

    // TODO: Replace with actual background
    this.background = this.add
      .tileSprite(0, 0, 10000, CONFIG.GAME_HEIGHT, "background")
      .setOrigin(0, 0)
      .setScrollFactor(0.8);


    // add score component
    this.score = new Score(this);
    this.events.on("pipePassed", this.onPipePassed);

    // Create a physics group for the pipes
    this.pipesGroup = this.physics.add.group();
    // Set default physics properties for objects added to this group
    this.pipesGroup.defaults.setAllowGravity = false;
    this.pipesGroup.defaults.setImmovable = true;

    // create objects to the screen, passing the group to Pipes
    this.gameObjects.push(
      new Background(this),
      new Ground(this),
      new Bird(this),
      new Pipes(this, this.pipesGroup, 50),
      new Cloud(this)
      //new Thunder(this)
    );

    // Get references to GameObjects
    const bird = (
      this.gameObjects.find((obj) => obj instanceof Bird) as Bird
    ).getBird();
    const ground = (
      this.gameObjects.find((obj) => obj instanceof Ground) as Ground
    ).getGround();
    const cloudGroup = (
      this.gameObjects.find((obj) => obj instanceof Cloud) as Cloud
    ).getCloudGroup();

    // Add collision detection
    if (bird && ground) {
      this.physics.add.collider(
        bird,
        ground,
        this.handleBirdCollision,
        undefined,
        this
      );
    }

    // Add collision detection between bird and the pipes group
    if (bird && this.pipesGroup) {
      this.physics.add.collider(
        bird,
        this.pipesGroup,
        this.handleBirdCollision,
        undefined,
        this
      );
    }

    // Add collision detection between bird and the cloud group
    if (bird && cloudGroup) {
      this.physics.add.overlap(
        bird,
        cloudGroup,
        this.handleCloudCollision,
        undefined,
        this
      );
    }
  }

  update() {
    const currentTime = this.time.now;

    // Update difficulty if game has started
    if (this.gameStartTime > 0) {
      this.updateDifficulty(currentTime);
    }

    // Update all game objects
    this.gameObjects.forEach((object) => {
      object.update();
    });
  }

  /**
   * Update difficulty level based on current time
   * @param currentTime Current game time in ms
   */
  private updateDifficulty(currentTime: number) {
    if (
      currentTime > this.targetLevelTime &&
      this.difficultyLevel < CONFIG.DIFFICULTY_LEVEL_MAX
    ) {
      this.difficultyLevel++;
      this.targetLevelTime = currentTime + this.difficultyInterval;
      console.log(`Difficulty increased to level ${this.difficultyLevel}`);
    }
  }

  private onPipePassed = () => {
    this.score.addPoint(10);
  };

  returnToMainMenu() {
    this.scene.stop();
    this.scene.start("MainMenu");
  }

  handleCloudCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_bird, cloud) => {
    if (cloud instanceof Phaser.Physics.Arcade.Sprite) {
      cloud.disableBody(true, true);
    }
    this.score.addPoint(5);
  }

  handleBirdCollision: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (_bird, obstacle) => {
    if (obstacle instanceof Phaser.Physics.Arcade.Sprite) {
      this.sound.play("hit_sound");
    }

    this.events.off("pipePassed", this.onPipePassed);

    const birdObject = this.gameObjects.find((obj) => obj instanceof Bird) as
      | Bird
      | undefined;
    if (birdObject) {
      birdObject.handleCollision();
    }

    // Pause the entire physics system
    this.physics.pause();

    // Stop all game timers
    this.time.paused = true;

    // Stop background music
    this.sound.stopByKey('background-music');

    this.scene.start('GameOver', { score: this.score.score });
  }
}
