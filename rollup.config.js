import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import scss from 'rollup-plugin-scss'
// import uglify from 'rollup-plugin-uglify-es'

export default {
  input: 'src/index.ts',
  external: [
    'three',
    '@tweenjs/tween.js',
    'three/examples/jsm/loaders/GLTFLoader',
    'three/examples/jsm/loaders/OBJLoader2',
    'three/examples/jsm/postprocessing/EffectComposer',
    'three/examples/jsm/postprocessing/RenderPass',
    'three/examples/jsm/postprocessing/UnrealBloomPass',
    'three/examples/jsm/controls/OrbitControls'
  ],
  output: {
    file: 'dist/dist.js',
    format: 'esm',
    paths: {
      'three': '/node_modules/three/build/three.module.js',
      '@tweenjs/tween.js': '/node_modules/@tweenjs/tween.js/dist/tween.esm.js',
      'three/examples/jsm/loaders/GLTFLoader': '/node_modules/three/examples/jsm/loaders/GLTFLoader.js',
      'three/examples/jsm/loaders/OBJLoader2': '/node_modules/three/examples/jsm/loaders/OBJLoader2.js',
      'three/examples/jsm/controls/OrbitControls': '/node_modules/three/examples/jsm/controls/OrbitControls.js',
      'three/examples/jsm/postprocessing/EffectComposer': '/node_modules/three/examples/jsm/postprocessing/EffectComposer.js',
      'three/examples/jsm/postprocessing/RenderPass': '/node_modules/three/examples/jsm/postprocessing/RenderPass.js',
      'three/examples/jsm/postprocessing/UnrealBloomPass': '/node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js',
    }
  },
  plugins: [
    resolve(),
    typescript(),
    scss(),
    serve(),
    livereload(),
    // uglify(),
  ]
}