
export class Score extends Phaser.GameObjects.Text {
    
    private score: number;

    constructor(scene: Phaser.Scene) {
        super(scene, 450, 50, 'Score: 0', {
            fontFamily: 'PixelGame',
            fontSize: 18,
            color: '#ffffff'});
        this.setScrollFactor(0).setDepth(100);
        this.init();
        this.scene.add.existing(this);
    }

    init(): void {
        this.score = 0;
    }

    update(time: number): void{
       
    }

    addPoint() {
        this.score += 10;
        this.setText(`Score: ${this.score}`);
    }

}