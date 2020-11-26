import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import scss from 'rollup-plugin-scss'
import uglify from 'rollup-plugin-uglify-es'

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/dist.js',
    format: 'esm'
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