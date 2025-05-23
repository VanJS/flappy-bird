import { Scene } from "phaser";
import { Background } from "../objects/background";
import { Ground } from "../objects/ground";
import { Bird } from "../objects/bird";
import { Logos } from "../objects/Logos";


class CountDown extends Scene {
    private countdownText: Phaser.GameObjects.Text;
    private countdownValue: number = 3;
    private timerEvent: Phaser.Time.TimerEvent;


    constructor() {
        super({ key: "CountDown" });
    }


    create() {
        this.countdownValue = 3;
        
        // Play a random countdown sound
        const soundKey = Math.floor(Math.random() * 5) + 1;
        this.sound.play(`countdown${soundKey}`, { volume: 0.8 });
        
        new Background(this);
        new Ground(this);
        new Bird(this); 
        
        // Add logo to the screen
        new Logos(this);

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


