import { Scene } from "phaser";
import { Background } from "../objects/background";
import { Ground } from "../objects/ground";
import { Bird } from "../objects/bird";


class CountDown extends Scene {
    private countdownText: Phaser.GameObjects.Text;
    private countdownValue: number = 3;
    private timerEvent: Phaser.Time.TimerEvent;
    private backgroundObj: Background;
    private groundObj: Ground;
    private birdObj: Bird;


    constructor() {
        super({ key: "CountDown" });
    }


    create() {
        this.backgroundObj = new Background(this);
        this.groundObj = new Ground(this);
        this.birdObj = new Bird(this); 


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
            this.scene.start("Game");
        }
    }

}

export default CountDown;


