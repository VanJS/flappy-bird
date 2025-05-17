import { Scene } from "phaser";

export class NameEntry {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private nameText: Phaser.GameObjects.Text;
  private currentName: string = "";
  private width: number;
  private height: number;
  private defaultName: string = "Husky";

  constructor(scene: Scene) {
    this.scene = scene;
    this.width = this.scene.cameras.main.width;
    this.height = this.scene.cameras.main.height;
  }

  create() {
    this.container = this.scene.add.container(0, 0);

    // background panel
    const panel = this.scene.add
      .rectangle(
        this.width / 2,
        this.height / 2,
        this.width / 2,
        this.height / 2,
        0x222244,
        0.95
      )
      .setOrigin(0.5)
      .setStrokeStyle(4, 0x4444aa);
    this.container.add(panel);

    //  title message
    const title = this.scene.add
      .text(this.width / 2, this.height / 2 - 100, "New High Score!", {
        fontFamily: "PixelGame",
        fontSize: 24,
        color: "#ffff00",
        align: "center",
      })
      .setOrigin(0.5);
    this.container.add(title);

    // prompt instruction
    const instruction = this.scene.add
      .text(this.width / 2, this.height / 2 - 50, "Enter your name:", {
        fontFamily: "PixelGame",
        fontSize: 16,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
    this.container.add(instruction);

    // input box background
    const inputBox = this.scene.add
      .rectangle(this.width / 2, this.height / 2, 300, 40, 0x333366)
      .setOrigin(0.5);
    this.container.add(inputBox);

    // input display
    this.nameText = this.scene.add
      .text(this.width / 2, this.height / 2, " ", {
        fontFamily: "PixelGame",
        fontSize: 20,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
    this.container.add(this.nameText);

    // submit button
    const submitBtn = this.scene.add
      .rectangle(this.width / 2, (2 * this.height) / 3, 200, 40, 0x446644)
      .setOrigin(0.5)
      .setStrokeStyle(2, 0x66aa66)
      .setInteractive({ useHandCursor: true });
    this.container.add(submitBtn);

    const submit = this.scene.add
      .text(this.width / 2, (2 * this.height) / 3, "Submit", {
        fontFamily: "PixelGame",
        fontSize: 16,
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);
    this.container.add(submit);

    submitBtn
      .on("pointerover", () => {
        submitBtn.setFillStyle(0x558855);
      })
      .on("pointerout", () => {
        submitBtn.setFillStyle(0x446644);
      })
      .on("pointerdown", () => {
        this.submit();
      });

    this.scene.input.keyboard?.on("keydown", this.handleKeyInput, this);
  }

  /**
   * update the nameText and the player name along with the keyboard input
   * @param event
   */
  private handleKeyInput(event: KeyboardEvent) {
    if (/^[a-zA-Z0-9]$/.test(event.key)) {
      if (this.currentName.length < 15) {
        this.currentName += event.key.toUpperCase();
        this.nameText.setText(this.currentName);
      }
    } else if (event.key === "Backspace") {
      if (this.currentName.length > 0) {
        this.currentName = this.currentName.slice(0, -1);
        this.nameText.setText(this.currentName);
      }
    } else if (event.key === "Enter") {
      this.submit();
    } else if (event.key === "Escape") {
      this.currentName = this.defaultName;
      this.submit();
    }
  }

  private submit() {
    this.scene.input.keyboard?.off("keydown", this.handleKeyInput, this);
    const playerName = this.currentName || this.defaultName;
    this.scene.events.emit("nameSubmitted", playerName);
    this.container.destroy();
  }
}
