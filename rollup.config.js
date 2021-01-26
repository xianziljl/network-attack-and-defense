import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import scss from 'rollup-plugin-scss'

const paths = {
  'three': '../node_modules/three/build/three.module.js',
  'three/examples/jsm/libs/stats.module': '../node_modules/three/examples/jsm/libs/stats.module.js',
  'three/examples/jsm/loaders/GLTFLoader': '../node_modules/three/examples/jsm/loaders/GLTFLoader.js',
  'three/examples/jsm/loaders/OBJLoader2': '../node_modules/three/examples/jsm/loaders/OBJLoader2.js',
  'three/examples/jsm/controls/OrbitControls': '../node_modules/three/examples/jsm/controls/OrbitControls.js',
  'three/examples/jsm/postprocessing/EffectComposer': '../node_modules/three/examples/jsm/postprocessing/EffectComposer.js',
  'three/examples/jsm/postprocessing/RenderPass': '../node_modules/three/examples/jsm/postprocessing/RenderPass.js',
  'three/examples/jsm/postprocessing/UnrealBloomPass': '../node_modules/three/examples/jsm/postprocessing/UnrealBloomPass.js',
  'three/examples/jsm/postprocessing/FilmPass': '../node_modules/three/examples/jsm/postprocessing/FilmPass.js',
  'three/examples/jsm/modifiers/SimplifyModifier': '../node_modules/three/examples/jsm/modifiers/SimplifyModifier.js',
  'three/examples/jsm/shaders/FXAAShader': '../node_modules/three/examples/jsm/shaders/FXAAShader.js',
  'three/examples/jsm/postprocessing/ShaderPass': '../node_modules/three/examples/jsm/postprocessing/ShaderPass.js',
  

  '@tweenjs/tween.js': '../node_modules/@tweenjs/tween.js/dist/tween.esm.js',
  // 'vue': '../node_modules/vue/dist/vue.esm.browser.min.js',
  // 'impetus': '../node_modules/impetus/src/Impetus.js'
}

const external = Object.keys(paths)

const plugins = [
  resolve(),
  typescript(),
  scss(),
  serve({ port: 10002 }),
  livereload()
]

export default [{
  input: 'src/CTF/index.ts',
  external,
  output: {
    file: 'js/ctf.js',
    format: 'esm',
    paths
  },
  plugins
}, {
  input: 'src/AWD/index.ts',
  external,
  output: {
    file: 'js/awd.js',
    format: 'esm',
    paths
  },
  plugins
}]