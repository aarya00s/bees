import World from '../World.js';  // Adjust path if necessary

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
