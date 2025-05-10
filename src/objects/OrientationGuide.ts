import { Scene } from "phaser";
import * as CONFIG from "../utils/configuration";

export class OrientationGuide {
    private scene: Scene;
    private overlay: Phaser.GameObjects.Container;
    
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
        this.overlay = this.scene.add.container(0, 0);
        
        // Semi-transparent background
        const bg = this.scene.add.rectangle(
            0, 0, CONFIG.GAME_WIDTH, CONFIG.GAME_HEIGHT, 
            0x000000, 0.85
        ).setOrigin(0);
        
        // Phone rotation image
        const rotateImage = this.scene.add.image(
            CONFIG.GAME_WIDTH / 2,
            CONFIG.GAME_HEIGHT / 2 - 50,
            'rotate-phone'
        ).setScale(0.7);
        
        // "Tap to continue" text
        const tapText = this.scene.add.text(
            CONFIG.GAME_WIDTH / 2,
            CONFIG.GAME_HEIGHT / 2 + 120,
            'Tap to Continue',
            {
                fontFamily: 'PixelGame',
                fontSize: '20px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }
        ).setOrigin(0.5);
        
        this.overlay.add([bg, rotateImage, tapText]);
        this.overlay.setDepth(1000);
        this.overlay.setVisible(false);
        
        // Make the entire overlay interactive
        bg.setInteractive();
        bg.on('pointerdown', this.hideOverlay, this);
    }
    
    private checkOrientation(): void {
        // Check if in portrait mode
        const isPortrait = window.innerWidth < window.innerHeight;
        
        if (isPortrait) {
            this.overlay.setVisible(true);
            
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
    }
    
    public isVisible(): boolean {
        return this.overlay?.visible || false;
    }
} 