import * as THREE from 'three';
import Config from './Config.js';

export default class Experience {
    constructor(canvas) {
        this.config = new Config(canvas);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.z = 5;
        this.renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this.time = {
            start: Date.now(),
            elapsed: 0,
            update: function() {
                const now = Date.now();
                this.elapsed = now - this.start;
            }
        };

        this.update();
    }

    update() {
        this.time.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.update.bind(this));
    }
}
