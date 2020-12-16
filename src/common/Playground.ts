import { AmbientLight, DirectionalLight, FogExp2, PerspectiveCamera, Raycaster, Scene, Vector2, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { update as TweenUpdate } from '@tweenjs/tween.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// import { Stats } from '../utils/stats'
import Stats from 'three/examples/jsm/libs/stats.module'
import { Fire } from './Fire'
import { Panel } from './Panel'

export class Playground extends Scene{
  el: HTMLElement
  // 摄像机
  camera = new PerspectiveCamera(72, 1, 0.1, 5000)
  // 渲染器
  renderer = new WebGLRenderer({ antialias: false })
  // 场景渲染
  scenePass = new RenderPass(this, this.camera)
  // 泛光效果
  bloomPass = new UnrealBloomPass(new Vector2(window.innerWidth, window.innerHeight), 1, 1.2, 0.23)
  // 合成器
  composer = new EffectComposer(this.renderer)
  // 交互控制器
  controls = new OrbitControls(this.camera, document.body)
  // 是否已暂停
  isPaused = false
  // 帧率
  stats = new (Stats as any)()

  // 鼠标位置
  static mouse = new Vector2()
  static raycaster = new Raycaster()

  constructor(el: HTMLElement) {
    super()
    this.el = el
    this.init()
  }

  init () {
    const { renderer, camera, el, controls, composer, stats } = this
    el.appendChild(renderer.domElement)
    camera.position.z = 1000
    camera.position.y = -100
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld(true)
    // 雾效果
    this.fog = new FogExp2(0x0f1022, 0.0008)
    // 灯光
    this.add(new AmbientLight(0xffffff, 0.3)) // 环境光
    const dirLight = new DirectionalLight(0xffffff, 0.3)
    dirLight.position.set(1500, 800, 3000)
    this.add(dirLight)

    composer.passes = [this.scenePass, this.bloomPass]

    controls.minDistance = 500
    controls.maxDistance = 1600
    controls.enabled = true
    controls.autoRotate = true
    controls.autoRotateSpeed = 1
    controls.enableDamping = true
    controls.dampingFactor = 0.1

    // 帧率
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.top = 0
    this.el.appendChild(stats.domElement)
    
    window.addEventListener('resize', this.resize.bind(this))
    // window.addEventListener('mousemove', this.onMousemove.bind(this))
  }

  animate() {
    if (!this.isPaused) requestAnimationFrame(this.animate.bind(this))
    this.stats.update()
    this.controls.update()
    TweenUpdate()
    Panel.update()
    Fire.update()
    this.composer.render()
  }

  resize() {
    const { clientWidth, clientHeight } = this.el
    this.camera.aspect = clientWidth / clientHeight
    this.renderer.setSize(clientWidth, clientHeight)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.bloomPass.resolution.set(clientWidth / 2, clientHeight / 2)
    this.composer.setSize(clientWidth, clientHeight)
    this.camera.updateProjectionMatrix()
  }

  // onMousemove(event: MouseEvent) {
  //   const { clientWidth, clientHeight } = this.el
  //   const { clientX, clientY } = event
  //   const { mouse, raycaster } = Playground
  //   mouse.x = clientX / clientWidth * 2 - 1
  //   mouse.y = clientY / clientHeight * 2 - 1
  //   raycaster.setFromCamera(mouse, this.camera)
  //   const object = raycaster.intersectObjects(this.children)
  //   console.log(object[0]?.object.uuid)
  // }
}