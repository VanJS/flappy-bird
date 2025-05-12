import { Scene } from "phaser";
import * as CONFIG from "../utils/configuration";

export class OrientationGuide {
    private scene: Scene;
    private overlay: Phaser.GameObjects.Container;
    private pulseEffect: Phaser.Tweens.Tween | null = null;
    
    // Static flag to track if the guide has been shown during this game session
    private static hasBeenShownBefore: boolean = false;

    constructor(scene: Scene) {
        this.scene = scene;
        
        // Only check orientation in the MainMenu scene and only if we haven't shown it before
        if (scene.scene.key === 'MainMenu' && !OrientationGuide.hasBeenShownBefore) {
            this.createOverlay();
            this.checkOrientation();
        }
    }

    private createOverlay(): void {
        this.overlay = this.scene.add.container(0, 0);

        // Semi-transparent background
        const bg = this.scene.add.rectangle(
            0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, 
            0x000000, 0.85
        ).setOrigin(0);

        // Create a container for the rotation elements for animation
        const rotateContainer = this.scene.add.container(
            CONFIG.GAME_WIDTH / 2, 
            CONFIG.GAME_HEIGHT / 2 - 50
        );
        
        // Add a slight glow/highlight around the rotate image
        const glow = this.scene.add.circle(
            0, 0, 110, 0xffffff, 0.2
        ).setOrigin(0.5);

        // Phone rotation image
        const rotateImage = this.scene.add.image(
            0, 0, 'rotate-phone'
        ).setScale(0.3);
        
        // Add to rotation container
        rotateContainer.add([glow, rotateImage]);

        // Instruction text
        const instructionText = this.scene.add.text(
            CONFIG.GAME_WIDTH / 2,
            CONFIG.GAME_HEIGHT / 2 + 80,
            'Please rotate your device\nfor best experience',
            {
                fontFamily: 'PixelGame',
                fontSize: '20px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4,
                align: 'center'
            }
        ).setOrigin(0.5);

        // "Tap to continue" text
        const tapText = this.scene.add.text(
            CONFIG.GAME_WIDTH / 2,
            CONFIG.GAME_HEIGHT / 2 + 150,
            'Tap to Continue',
            {
                fontFamily: 'PixelGame',
                fontSize: '20px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);

        this.overlay.add([bg, rotateContainer, instructionText, tapText]);
        this.overlay.setDepth(1000);
        this.overlay.setVisible(false);

        // Make the entire overlay interactive
        bg.setInteractive();
        bg.on('pointerdown', this.hideOverlay, this);
        
        // Add pulse effect to the rotate container
        this.pulseEffect = this.scene.tweens.add({
            targets: rotateContainer,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            paused: true
        });
    }

    private checkOrientation(): void {
        // Use matchMedia to check if we're in portrait mode on a mobile device
        const mediaQuery = window.matchMedia("(orientation: portrait) and (max-width: 900px)");
        
        // Show overlay if in portrait mode
        if (mediaQuery.matches) {
            this.showOverlay();
            OrientationGuide.hasBeenShownBefore = true;
            
            // Add event listener to hide overlay when device is rotated
            const orientationChangeHandler = () => {
                if (!mediaQuery.matches) {
                    this.hideOverlay();
                    // Remove the event listener after hiding
                    mediaQuery.removeEventListener('change', orientationChangeHandler);
                }
            };
            
            // Listen for orientation changes
            mediaQuery.addEventListener('change', orientationChangeHandler);
        }
    }
    
    private showOverlay(): void {
        this.overlay.setVisible(true);
        
        // Start the pulse effect when showing
        if (this.pulseEffect) {
            this.pulseEffect.resume();
        }
    }

    private hideOverlay = (): void => {
        this.overlay.setVisible(false);
        
        // Stop the pulse effect when hiding
        if (this.pulseEffect) {
            this.pulseEffect.pause();
        }
    }

    public isVisible(): boolean {
        return this.overlay?.visible || false;
    }
} 