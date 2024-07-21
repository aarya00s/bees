import * as THREE from 'three';
import Experience from './Experience.js';
import Fireflies from './Fireflies.js';  // Ensure this path is correct based on your project structure

export default class World {
    constructor(_options) {
        const canvas = document.getElementById('webglCanvas');
        this.experience = new Experience(canvas);
        this.config = this.experience.config;
        this.scene = this.experience.scene;
        this.time = this.experience.time;

        this.setFireflies();  // Initialize Fireflies
    }

    setFireflies() {
        this.fireflies = new Fireflies({
            scene: this.scene, 
            time: this.time, 
            config: this.config  // Make sure the Fireflies class can handle this config properly
        });
    }

    update() {
        if (this.fireflies) {
            this.fireflies.update();
        }
    }
}
