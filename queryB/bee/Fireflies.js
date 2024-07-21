import * as THREE from 'three';
import firefliersVertexShader from './shaders/firefliersVertex.glsl';
import firefliersFragmentShader from './shaders/firefliersFragment.glsl';

export default class Fireflies {
    constructor(options) {
        this.scene = options.scene;
        this.time = options.time;
        this.config = options.config;

        console.log('Fireflies time:', this.time); // Debugging log

        this.addModel();
    }

    addModel() {
        this.model = {};

        // Geometry
        this.model.geometry = new THREE.BufferGeometry();
        this.model.count = 75;
        this.model.positionArray = new Float32Array(this.model.count * 3);
        this.model.scaleArray = new Float32Array(this.model.count);

        for (let i = 0; i < this.model.count; i++) {
            this.model.scaleArray[i] = (Math.random() * (1 - 0.2) + 0.2);

            if (i < (this.model.count / 3 * 2)) {
                this.model.positionArray[i * 3 + 0] = (Math.random() + 0.2) * 2; // x
                this.model.positionArray[i * 3 + 1] = (Math.random() - 0.8) * 1.2; // y
                this.model.positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4; // z
            } else {
                this.model.positionArray[i * 3 + 0] = (Math.random() - 0.7) * 2; // x
                this.model.positionArray[i * 3 + 1] = (Math.random() - 0.8) * 1.2; // y
                this.model.positionArray[i * 3 + 2] = (Math.random() + 0.4) * 2; // z
            }
        }
        this.model.geometry.setAttribute('position', new THREE.BufferAttribute(this.model.positionArray, 3));
        this.model.geometry.setAttribute('aScale', new THREE.BufferAttribute(this.model.scaleArray, 1));

        // Material
        this.model.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uTimeFrequency: { value: this.config.firefliesSpeed / 10000 },
                uPixelRation: { value: this.config.pixelRatio },
                uSize: { value: this.config.firefliesSize },
                uColor: { value: new THREE.Color(this.config.firefliersColor) },
            },
            vertexShader: firefliersVertexShader,
            fragmentShader: firefliersFragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        // Points
        this.model.points = new THREE.Points(this.model.geometry, this.model.material);

        this.scene.add(this.model.points);
    }

    update() {
        if (this.model.material.uniforms.uTime) {
            this.model.material.uniforms.uTime.value = this.time.elapsed;
        }
    }

    destroy() {
        // Cleanup resources if necessary
    }
}
