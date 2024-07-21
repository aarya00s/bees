(function (THREE) {
    'use strict';

    function _interopNamespace(e) {
        if (e && e.__esModule) return e;
        var n = Object.create(null);
        if (e) {
            Object.keys(e).forEach(function (k) {
                if (k !== 'default') {
                    var d = Object.getOwnPropertyDescriptor(e, k);
                    Object.defineProperty(n, k, d.get ? d : {
                        enumerable: true,
                        get: function () { return e[k]; }
                    });
                }
            });
        }
        n["default"] = e;
        return Object.freeze(n);
    }

    var THREE__namespace = /*#__PURE__*/_interopNamespace(THREE);

    class Config {
        constructor(targetElement) {
            this.pixelRatio = Math.min(Math.max(window.devicePixelRatio, 1), 2);
            const boundings = targetElement.getBoundingClientRect();
            this.width = boundings.width;
            this.height = boundings.height || window.innerHeight;

            // Setup basic color configurations and world parameters
            this.backgroundColor = '#4b9bfb';  // Default background color
            this.lightColor = '#ffffe5';       // Default light color
            this.firefliersColor = '#f87c42';  // Fireflies color
            this.shadowColor = '#1364b5';      // Default shadow color

            // Add fireflies specific configuration
            this.firefliesSpeed = 4;   // Speed of the fireflies
            this.firefliesSize = 290;  // Size of the fireflies

            // Debugging options (simplify or remove if not needed)
            this.debug = this.width > 420;  // Enable debugging on larger screens
        }
    }

    class Experience {
        constructor(canvas) {
            this.config = new Config(canvas);
            this.scene = new THREE__namespace.Scene();
            this.camera = new THREE__namespace.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
            this.camera.position.z = 5;
            this.renderer = new THREE__namespace.WebGLRenderer({
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

    var firefliersVertexShader = "//uniform mat4 projectionMatrix;\r\n//uniform mat4 viewMatrix;\r\n//uniform mat4 modelMatrix;\r\nuniform float uTime;\r\nuniform float uTimeFrequency;\r\n\r\nuniform float uPixelRation;\r\nuniform float uSize;\r\n\r\nattribute float aScale;\r\n\r\nvoid main()\r\n{\r\n\tvec4 modelPosition = modelMatrix * vec4(position, 1.0);\r\n\tmodelPosition.y += sin(uTime * uTimeFrequency * 0.6 + modelPosition.y * 100.0) * aScale * 0.3;\r\n\tmodelPosition.z += sin(uTime * uTimeFrequency * 0.7 + modelPosition.z * 110.0) * aScale * 0.25;\r\n\tmodelPosition.x += sin(uTime * uTimeFrequency * 0.8 + modelPosition.x * 120.0) * aScale * 0.2;\r\n\r\n\tvec4 viewPosition = viewMatrix * modelPosition;\r\n\tvec4 projectedPosition = projectionMatrix * viewPosition;\r\n\r\n\tgl_Position = projectedPosition;\r\n\r\n\tgl_PointSize = uSize * aScale * uPixelRation;\r\n\tgl_PointSize *= (1.0 / -viewPosition.z);\r\n}\r\n";

    var firefliersFragmentShader = "uniform vec3 uColor;\r\n\r\nvoid main()\r\n{\r\n\tfloat distanceToCenter = distance(gl_PointCoord, vec2(0.5));\r\n\tfloat strength = 0.05 / distanceToCenter - 0.1;\r\n\r\n\tgl_FragColor = vec4(uColor, strength);\r\n}\r\n";

    class Fireflies {
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
            this.model.geometry = new THREE__namespace.BufferGeometry();
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
            this.model.geometry.setAttribute('position', new THREE__namespace.BufferAttribute(this.model.positionArray, 3));
            this.model.geometry.setAttribute('aScale', new THREE__namespace.BufferAttribute(this.model.scaleArray, 1));

            // Material
            this.model.material = new THREE__namespace.ShaderMaterial({
                uniforms: {
                    uTime: { value: 0 },
                    uTimeFrequency: { value: this.config.firefliesSpeed / 10000 },
                    uPixelRation: { value: this.config.pixelRatio },
                    uSize: { value: this.config.firefliesSize },
                    uColor: { value: new THREE__namespace.Color(this.config.firefliersColor) },
                },
                vertexShader: firefliersVertexShader,
                fragmentShader: firefliersFragmentShader,
                transparent: true,
                blending: THREE__namespace.AdditiveBlending,
                depthWrite: false,
            });

            // Points
            this.model.points = new THREE__namespace.Points(this.model.geometry, this.model.material);

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

    class World {
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

    document.addEventListener('DOMContentLoaded', () => {
        const canvas = document.getElementById('webglCanvas');
        if (!canvas) {
            console.error('Canvas element not found! Ensure your HTML contains a canvas element with id="webglCanvas"');
            return;
        }

        const world = new World();

        const animate = () => {
            requestAnimationFrame(animate);
            world.update(); // Update the world which in turn updates fireflies
        };

        animate();
    });

})(THREE);
