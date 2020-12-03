import { Mesh, Material, Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, PointLight, Vector2, PointLightHelper, BoxGeometry, AmbientLight, MeshBasicMaterial, Color } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

export class TeamInfo extends Scene {
  el: HTMLElement

  camera = new PerspectiveCamera(50, 1, 0.1, 5000)
  renderer = new WebGLRenderer({ antialias: false })
  aerobat: Mesh
  composer: EffectComposer

  isPaused = true

  controls: OrbitControls

  constructor(el: HTMLElement) {
    super()
    this.el = el
    this.el.appendChild(this.renderer.domElement)
    this.camera.position.set(400, 400, 400)
    this.camera.lookAt(0, 0, 0)
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.camera.updateProjectionMatrix()
    this.camera.updateMatrixWorld(true)
    this.add(new AmbientLight(0xffffff, 0.3)) // 环境光
    const plight1 = new PointLight(0x0090ff, 2.5, 1000)
    const plight2 = new PointLight(0xff0000, 1, 1000)
    plight1.position.set(300, 200, 0)
    plight2.position.set(-300, 200, 0)
    this.add(plight1, plight2)
    // this.add(new PointLightHelper(plight1), new PointLightHelper(plight2))
  
    this.resize()

    this.renderer.autoClear = false
    this.composer = new EffectComposer(this.renderer)
    const renderScene = new RenderPass(this, this.camera)
    // 泛光效果
    const bloomPass = new UnrealBloomPass(new Vector2(this.el.clientWidth, this.el.clientHeight), 1, 0.5, 0.23) // 半径，强度，门槛
    this.composer.passes = [renderScene, bloomPass]
    this.addAerobat()
    this.initControls()
    // this.animate()

    window.addEventListener('resize', this.resize.bind(this))
  }
  addAerobat() {
    // const mesh = new Mesh(new BoxGeometry(100, 100, 100, 0x00ffff))
    // this.add(mesh)
    new GLTFLoader().load('/assets/models/aerobat.gltf', gltf => {
      const mesh = gltf.scene.children[0].children[0] as Mesh
      const mtl = mesh.material as MeshBasicMaterial
      mtl.color = new Color(0x444444)
      this.aerobat = mesh
      this.add(mesh)
    })
  }

  show() {
    if (!this.isPaused) return
    this.isPaused = false
    this.animate()
    this.el.classList.remove('hide')
    this.el.classList.add('show')
  }

  hide() {
    this.isPaused = true
    this.el.classList.remove('show')
    this.el.classList.add('hide')
  }

  private resize() {
    const { clientWidth, clientHeight } = this.el
    this.camera.aspect = clientWidth / clientHeight
    this.camera.updateProjectionMatrix()
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.renderer.setSize(clientWidth, clientHeight)
  }

  animate() {
    if (!this.isPaused) requestAnimationFrame(this.animate.bind(this))
    this.controls.update()
    this.composer.render()
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.minDistance = 500
    // this.controls.maxDistance = 1600
    this.controls.enabled = true
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 3
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.1
  }
}