import { Scene } from "phaser";


export class Logos {
    private scene: Scene;
    private container: Phaser.GameObjects.Container;
    
    constructor(scene: Scene) {
        this.scene = scene;
        this.create();
    }
    
    private create(): void {
        this.container = this.scene.add.container(0, 0);
        
        // Add the logo image
        const logoImage = this.scene.add.image(0, 0, 'vanjs-neu-logo');
        
        // Scale the logo to an appropriate size
        logoImage.setScale(0.26);
        
        // Add the logo to the container
        this.container.add(logoImage);
        
        // Position at the leftmost edge of the screen with some padding
        this.container.setPosition(10, 20);
        
        // Adjust the origin to make it align with the left edge
        logoImage.setOrigin(0, 0);
        
        // Make sure it appears above game elements
        this.container.setDepth(1000);
    }
}