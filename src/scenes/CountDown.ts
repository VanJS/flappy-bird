import { Scene } from "phaser";
import { Background } from "../objects/background";
import { Ground } from "../objects/ground";
import { Bird } from "../objects/bird";


class CountDown extends Scene {
    private countdownText: Phaser.GameObjects.Text;
    private countdownValue: number = 3;
    private timerEvent: Phaser.Time.TimerEvent;


    constructor() {
        super({ key: "CountDown" });
    }


    create() {
        this.countdownValue = 3;
        new Background(this);
        new Ground(this);
        new Bird(this); 

        this.input.enabled = false;

        this.countdownText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.countdownValue.toString(),
            {
                fontFamily: "PixelGame",
                fontSize: "128px",
                color: "#ffffff",
                stroke: '#000000',
                strokeThickness: 6
            }
        ).setOrigin(0.5)

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateCountdown,
            callbackScope: this,
            loop: true
        });
    }

    private updateCountdown() {
        this.countdownValue--;
        this.countdownText.setText(this.countdownValue.toString());

        if (this.countdownValue <= 0) {
            this.timerEvent.remove();
            this.input.enabled = true; 
            this.scene.start("Game");
        }
    }

}

export default CountDown;


