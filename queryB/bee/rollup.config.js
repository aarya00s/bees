import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import glsl from 'rollup-plugin-glsl';

export default {
  input: 'src/app.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    globals: {
      three: 'THREE' // Specifies that the global variable for 'three' should be 'THREE'
    }
  },
  plugins: [
    resolve(), // Helps Rollup find 'three' in node_modules
    commonjs(), // Converts 'three' to an ES module
    glsl({
      include: '**/*.glsl',
      compress: false
    })
  ],
  // Mark 'three' as an external dependency to prevent it from being bundled
  external: ['three']
};
