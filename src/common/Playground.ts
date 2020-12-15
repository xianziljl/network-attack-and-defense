import { AmbientLight, DirectionalLight, FogExp2, PerspectiveCamera, Scene, Vector2, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { update as TweenUpdate } from '@tweenjs/tween.js'
import { Stats } from '../utils/stats'


export class Playground extends Scene{
  el: HTMLElement
  // 摄像机
  camera = new PerspectiveCamera(72, 1, 0.1, 5000)
  // 渲染器
  renderer = new WebGLRenderer({ antialias: false })
  // 泛光效果
  bloom = new UnrealBloomPass(new Vector2(), 1, 1.2, 0.23)
  // 合成器
  composer = new EffectComposer(this.renderer)
  // 交互控制器
  controls = new OrbitControls(this.camera, document.body)
  // 是否已暂停
  isPaused = false

  constructor(el: HTMLElement) {
    super()
    this.el = el
    this.init()
  }
  init () {
    const { renderer, camera, el } = this
    el.appendChild(renderer.domElement)
    this.resize()
    camera.position.z = 1000
    camera.position.y = -100
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld(true)
    // 雾效果
    this.fog = new FogExp2(0x0f1022, 0.0005)
    // 灯光
    this.add(new AmbientLight(0xffffff, 0.3)) // 环境光
    const dirLight = new DirectionalLight(0xffffff, 0.3)
    dirLight.position.set(1500, 800, 3000)
    this.add(dirLight)
    
    window.addEventListener('resize', this.resize.bind(this))
    this.animate()
  }
  animate() {
    if (!this.isPaused) requestAnimationFrame(this.animate.bind(this))
    TweenUpdate()
    this.controls.update()
    this.composer.render()
  }
  resize() {
    const { clientWidth, clientHeight } = this.el
    this.camera.aspect = clientWidth / clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.bloom.resolution.set(clientWidth, clientHeight)
    this.renderer.setSize(clientWidth, clientHeight)
  }
}