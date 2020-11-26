import { AmbientLight, AxesHelper, Box3, BoxGeometry, BoxHelper, CubeTextureLoader, DefaultLoadingManager, EdgesGeometry, FogExp2, ImageLoader, Line, LineBasicMaterial, LineSegments, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, SpotLight, SpotLightHelper, Vector2, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader"
import { Stats } from '../utils/stats'
import { MapGrid } from './MapGrid'
import { Target } from './Target'
import { Team } from './team'
import Terrain from './Terrain'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { Assets, loadAssets } from '../utils/assets'

export class Playground extends Scene {
  el: Element

  camera = new PerspectiveCamera(70, 1, 0.1, 5000)
  closeUpCamera = new PerspectiveCamera(75, 1, 0.1, 5000) // 特写相机
  renderer = new WebGLRenderer({ alpha: true, antialias: true })
  composer: EffectComposer
  controls: OrbitControls

  statsUI: Stats
  // loadUI = document.createElement('div')

  mapGrid = new MapGrid()
  gridSize = 200
  teams: Team[] = []
  targets: Target[] = []

  // assets
  buildingModel: Mesh

  // events
  ready: Function = () => {}

  constructor(el: Element) {
    super()
    this.el = el

    loadAssets((assets: Assets) => {
      const { building } = assets
      const box = new Box3().setFromObject(assets.building)
      const boxSize = box.getSize(new Vector3())
      // 缩放到正方形
      if (boxSize.x !== boxSize.y) {
        building.scale.x = this.gridSize / boxSize.x
        building.scale.y = this.gridSize / boxSize.y
        building.scale.z = this.gridSize / boxSize.z
      }
      this.buildingModel = building
      
      this.init(assets)
      if (typeof this.ready === 'function') this.ready()
    })
    this.add(new AxesHelper(1000))
  }

  private init(assets: Assets) {
    this.el.appendChild(this.renderer.domElement)
    this.resize()
    // 雾效果
    this.fog = new FogExp2(0x020a1e, 0.0005)
    // 灯光
    this.add(new AmbientLight(0xffffff, 0.5)) // 环境光
    const spotLight = new SpotLight(0xffffff, 1, 5000, 40)
    spotLight.position.set(500, 1000, 0)
    this.add(spotLight)
    // this.add(new SpotLightHelper(spotLight, 0xaaaaaa))

    // 天空盒
    this.background = assets.cubeTexture

    // 后期处理
    this.composer = new EffectComposer(this.renderer)
    const renderScene = new RenderPass(this, this.camera)
    this.composer.addPass(renderScene)

    const { clientWidth, clientHeight } = this.el
    const bloomPass = new UnrealBloomPass(new Vector2(clientWidth, clientHeight), 1.5, 0.4, 0.85)
    bloomPass.threshold = 0.5
    bloomPass.strength = 0.5
    this.composer.addPass(bloomPass)

    // const effectRgbShift = new ShaderPass(RGBShiftShader)
    // effectRgbShift.uniforms[ 'amount' ].value = 0.001;
    // this.composer.addPass(effectRgbShift)

    // 地形
    const material = new MeshBasicMaterial({
      color: '#00a2ff',
      transparent: true,
      opacity: 0.6,
      wireframe: true
    })
    const terrainGeometry = new Terrain(assets.heightimg)
    const terrain = new Mesh(terrainGeometry, material)
    terrain.position.set(0, -300, -300)
    terrain.scale.set(60, 500, 60)
    this.add(terrain)

    // 控制
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.minDistance = 500
    // this.controls.maxDistance = 1600
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 1
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.1

    // 测试盒子
    // const geometry = new BoxGeometry(10, 1000, 10)
    // const material = new MeshBasicMaterial({ color: 0x00ff00 })
    // const cube = new Mesh(geometry, material)
    // cube.position.y = -150
    // this.add(cube)

    // 地图辅助网格
    // const square = new PlaneGeometry(this.gridSize, this.gridSize)
    // const edges = new EdgesGeometry(square)
    // const squareBorder = new LineSegments(edges, new LineBasicMaterial({ color: 0xffffff }))
    // squareBorder.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2))
    // for (let i = 0; i < 200; i++) {
    //   const sq = squareBorder.clone()
    //   const grid = this.mapGrid[i]
    //   const { x, y, value } = grid
    //   sq.position.set(x * this.gridSize, -300, y * this.gridSize)
    //   if (i > 0) this.add(sq)
    // }

    this.camera.position.z = 1000

    const { camera, renderer, controls, composer } = this
    const self = this
    function animate() {
      requestAnimationFrame(animate)
      composer.render()
      controls.update()
      if (self.statsUI) self.statsUI.update()
    }
    animate()

    window.addEventListener('resize', this.resize.bind(this))
  }

  public setTeams(teams: Team[] = []) {
    teams.forEach(team => {
      this.add(team)
    })
  }

  public clearTeams() { }

  public setTargets(targets: Target[]) {
    targets.forEach(target => this.addTarget(target))
  }

  public addTarget(target: Target) {
    const index = this.targets.length
    const grid = this.mapGrid[index]
    const { x, y, value } = grid
    // target.setBuilding(this.buildingModel)
    target.setBox(this.gridSize, this.gridSize)
    if (index === 0) {
      target.scale.set(2, 1.5, 2)
      target.position.set(0, -300, 0)
    } else {
      target.position.set(x * this.gridSize + this.gridSize / 2, -300, y * this.gridSize + this.gridSize / 2)
      target.scale.y = value / 100
    }
    this.add(target)
    this.targets.push(target)
  }

  public clearTargets() {
    this.targets.forEach(t => {
      this.remove(t)
    })
    this.targets = []
  }

  private resize() {
    const { clientWidth, clientHeight } = this.el
    this.camera.aspect = this.closeUpCamera.aspect = clientWidth / clientHeight
    this.camera.updateProjectionMatrix()
    this.closeUpCamera.updateProjectionMatrix()
    this.renderer.setSize(clientWidth, clientHeight)
  }

  set stateShow(show: boolean) {
    if (show) {
      this.statsUI = new Stats()
      this.statsUI.domElement.style.position = 'absolute'
      this.statsUI.domElement.style.top = 0
      this.el.appendChild(this.statsUI.domElement)
    } else {
      this.statsUI = null
    }
  }
  get stateShow(): boolean {
    return !!this.statsUI
  }
}