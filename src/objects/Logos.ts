import { Scene } from "phaser";
import * as CONFIG from "../utils/configuration";

export class Logos {
    private static instance: Logos | null = null;
    private scene: Scene;
    private container: Phaser.GameObjects.Container | null = null;
    
    private constructor(scene: Scene) {
        this.scene = scene;
        this.create();
        this.setupSceneTransitions();
    }
    
    public static get(scene: Scene): Logos {
        if (!Logos.instance) {
            Logos.instance = new Logos(scene);
        }
        return Logos.instance;
    }
    
    private create(): void {
        if (this.container) {
            this.container.destroy();
        }
        
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
    
    private setupSceneTransitions(): void {
        const game = this.scene.game;
        
        game.events.on('prestep', () => {
            const currentScene = game.scene.getScenes(true)[0];
            if (currentScene && currentScene !== this.scene) {
                this.scene = currentScene;
                this.create();
            }
        });
    }
} 