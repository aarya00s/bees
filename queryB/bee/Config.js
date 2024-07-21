import * as THREE from 'three';

export default class Config {
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
