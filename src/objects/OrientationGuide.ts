import { Scene } from "phaser";
import * as CONFIG from "../utils/configuration";

export class OrientationGuide {
    private scene: Scene;
    private overlay: Phaser.GameObjects.Container;
    private backgroundDim: Phaser.GameObjects.Rectangle;
    private rotateContainer: Phaser.GameObjects.Container;
    private pulseEffect: Phaser.Tweens.Tween | null = null;
    
    constructor(scene: Scene) {
        this.scene = scene;
        
        // Skip if on desktop
        if (this.isDesktopDevice()) {
            return;
        }
        
        this.createOverlay();
        this.checkOrientation();
    }
    
    private isDesktopDevice(): boolean {
        if (typeof navigator !== 'undefined' && navigator.userAgent) {
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            return !isMobile;
        }
        return true; // Default to desktop if can't detect
    }
    
    private createOverlay(): void {
        // Main container for all overlay elements
        this.overlay = this.scene.add.container(0, 0);
        
        // Semi-transparent black overlay to dim the game background
        this.backgroundDim = this.scene.add.rectangle(
            0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, 
            0x000000, 0.85
        ).setOrigin(0);
        
        // Add a solid bar to cover the "Click to Start" text at the bottom of the screen
        const textCoverBar = this.scene.add.rectangle(
            CONFIG.GAME_WIDTH / 2,
            CONFIG.GAME_HEIGHT / 2 + 100,
            600, 50,
            0x0066ff, 1
        ).setOrigin(0.5);
        
        // Create a container for the rotation elements
        this.rotateContainer = this.scene.add.container(CONFIG.GAME_WIDTH / 2, CONFIG.GAME_HEIGHT / 2 - 80);
        
        // Add a slight glow/highlight around the rotate image
        const glow = this.scene.add.circle(
            0, 0, 110, 0xffffff, 0.2
        ).setOrigin(0.5);
        
        // Phone rotation image
        const rotateImage = this.scene.add.image(
            0, 0,
            'rotate-phone'
        ).setScale(0.3);
        
        // Add to rotation container
        this.rotateContainer.add([glow, rotateImage]);
        
        // "Tap to continue" text
        const tapText = this.scene.add.text(
            CONFIG.GAME_WIDTH / 2,
            CONFIG.GAME_HEIGHT / 2 + 100, // Position exactly where the "Click to Start" text is
            'Rotate phone or tap to start',
            {
                fontFamily: 'PixelGame',
                fontSize: '18px', // Match the same font size
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);
        
        // Add all elements to the main overlay
        this.overlay.add([this.backgroundDim, textCoverBar, this.rotateContainer, tapText]);
        this.overlay.setDepth(1000);
        this.overlay.setVisible(false);
        
        // Make the entire overlay interactive
        this.backgroundDim.setInteractive();
        this.backgroundDim.on('pointerdown', this.hideOverlay, this);
    }
    
    private addPulseEffect(): void {
        // Stop any existing tween
        if (this.pulseEffect) {
            this.pulseEffect.stop();
        }
        
        // Create a subtle pulse effect on the rotation image
        this.pulseEffect = this.scene.tweens.add({
            targets: this.rotateContainer,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }
    
    private checkOrientation(): void {
        // Check if in portrait mode
        const isPortrait = window.innerWidth < window.innerHeight;
        
        if (isPortrait) {
            this.overlay.setVisible(true);
            this.addPulseEffect();
            
            // Listen for orientation change
            window.addEventListener('resize', () => {
                if (window.innerWidth > window.innerHeight) {
                    this.hideOverlay();
                }
            });
        }
    }
    
    private hideOverlay = (): void => {
        this.overlay.setVisible(false);
        
        // Stop the pulse effect when hiding
        if (this.pulseEffect) {
            this.pulseEffect.stop();
            this.pulseEffect = null;
        }
    }
    
    public isVisible(): boolean {
        return this.overlay?.visible || false;
    }
} 