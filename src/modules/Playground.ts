import { AmbientLight, AxesHelper, Box3, BoxGeometry, BoxHelper, CircleBufferGeometry, CircleGeometry, CubeTextureLoader, CylinderGeometry, DefaultLoadingManager, DirectionalLight, DirectionalLightHelper, DoubleSide, EdgesGeometry, FogExp2, Group, ImageLoader, Line, LineBasicMaterial, LineSegments, Loader, Material, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, PointLight, PointLightHelper, Raycaster, Scene, SpotLight, SpotLightHelper, Vector2, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { HueSaturationShader } from 'three/examples/jsm/shaders/HueSaturationShader'
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { CopyShader } from 'three/examples/jsm/shaders/CopyShader'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { Stats } from '../utils/stats'
import { MapGrid } from './MapGrid'
import { Target } from './Target'
import { Team } from './team'
import Terrain from './Terrain'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { Assets, loadAssets } from '../utils/assets'
import { Tween, Easing, update as TweenUpdate} from '@tweenjs/tween.js'
import { Panel } from './Panel'
import { Bullet } from './Bullet'
import { Fire } from './Fire'
import { getRandom } from '../utils/getRandom'

export class Playground extends Scene {
  el: Element

  camera = new PerspectiveCamera(70, 1, 0.1, 5000)
  controlCamera = new PerspectiveCamera(70, 1, 0.1, 5000) // 特写相机
  renderer = new WebGLRenderer({ antialias: false })
  renderScene: RenderPass
  composer: EffectComposer
  controls: OrbitControls
  raycaster = new Raycaster()
  teamModels = new Group()

  statsUI: Stats
  loadUI = document.createElement('div')

  mapGrid = new MapGrid()
  gridSize = 200
  teams: Team[] = []
  targets: Target[] = []

  assets: Assets

  // events
  ready: Function = () => { }

  constructor(el: HTMLElement) {
    super()
    this.el = el

    this.loadUI.className = 'load-ui'
    this.el.appendChild(this.loadUI)

    DefaultLoadingManager.onStart = () => {
      this.loadUI.innerHTML = `<div>LOADING... 0%</div>`
    }
    DefaultLoadingManager.onProgress = (url, loaded, total) => {
      this.loadUI.innerHTML = `<div>LOADING... ${(loaded / total * 100).toFixed(2)}%</div>`
    }

    console.log('load assets')
    loadAssets((assets: Assets) => {
      console.log('assets:', assets)
      this.assets = assets
      
      this.loadUI.innerHTML = ''
      this.loadUI.style.opacity = '0'
      setTimeout(() => this.el.removeChild(this.loadUI), 5000)

      Fire.texture = assets.fire

      assets.buildings.forEach(building => {
        const buildingGeometry = building.geometry
        const box = new Box3().setFromObject(building)
        const boxSize = box.getSize(new Vector3())
        // 缩放到正方形
        if (boxSize.x !== boxSize.y) {
          const scale = new Matrix4().makeScale(this.gridSize / boxSize.x, this.gridSize / boxSize.y, this.gridSize / boxSize.z)
          buildingGeometry.applyMatrix4(scale)
        }
      })

      // assets.aerobat.material = new MeshPhongMaterial({
      //   color: 0x888888,
      //   normalMap: assets.aerobatMormalMap
      // })
      this.init(assets)
      if (typeof this.ready === 'function') this.ready()
    })
  }

  private init(assets: Assets) {
    this.el.appendChild(this.renderer.domElement)
    this.resize()
    this.camera.position.z = 1000
    this.camera.position.y = -100
    this.camera.lookAt(0, 0, 0)
    this.camera.updateProjectionMatrix()
    this.camera.updateMatrixWorld(true)
    // 雾效果
    this.fog = new FogExp2(0x0f1022, 0.0005)
    // 灯光
    this.add(new AmbientLight(0xffffff, 0.3)) // 环境光
    const dirLight = new DirectionalLight(0xffffff, 0.3)
    dirLight.position.set(1500, 800, 3000)
    this.add(dirLight)
    // this.add(new DirectionalLightHelper(dirLight, 0xaaaaaa))

    const plight1 = new PointLight(0x0090ff, 2, 1000)
    const plight2 = new PointLight(0x00d2ff, 1, 1000)
    plight1.position.set(600, 400, 0)
    plight2.position.set(-600, 400, 0)
    this.add(plight1, plight2)
    // this.add(new PointLightHelper(plight1, 30), new PointLightHelper(plight2, 30))
    // plight1.lookAt(0, 500, 0)
    // plight1.lookAt(0, 500, 0)

    // 天空盒
    this.background = assets.cubeTexture
    // 地板
    const planeGeometry = new CircleBufferGeometry(2000, 2000, 100, 32)
    const planeMaterial = new MeshLambertMaterial({ color: 0x2a3d5c }) //, 0x2a3d5c, transparent: true, opacity: 0.5 
    const planeMesh = new Mesh(planeGeometry, planeMaterial)
    // planeMaterial.depthWrite = false
    planeMaterial.side = DoubleSide
    planeMesh.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2))
    // planeMesh.scale.set(5000, 5000, 5000)
    planeMesh.position.y = -320
    this.add(planeMesh)
    // 地形
    const material = new MeshBasicMaterial({
      color: 0x006bff,
      transparent: true,
      opacity: 0.4,
      wireframe: true
    })
    const terrainGeometry = new Terrain(assets.heightimg)
    const terrain = new Mesh(terrainGeometry, material)
    terrain.position.set(0, -300, -300)
    terrain.scale.set(60, 500, 60)
    this.add(terrain)

    // 后期处理
    this.renderer.autoClear = false
    this.composer = new EffectComposer(this.renderer)
    this.renderScene = new RenderPass(this, this.camera)
    this.composer.addPass(this.renderScene)

    // const hue = new ShaderPass(HueSaturationShader)
    // this.composer.addPass(hue)
    // 抗锯齿
    // const fxaaPass = new ShaderPass(FXAAShader)
    // this.composer.addPass(fxaaPass)
    // const pixelRatio = this.renderer.getPixelRatio()

    // fxaaPass.material.uniforms['resolution'].value.x = 1 / (this.el.clientWidth * pixelRatio)
    // fxaaPass.material.uniforms['resolution'].value.y = 1 / (this.el.clientHeight * pixelRatio)
    // this.composer.addPass(fxaaPass)

    // 泛光效果
    const { clientWidth, clientHeight } = this.el
    const bloomPass = new UnrealBloomPass(new Vector2(clientWidth, clientHeight), 1, 1.2, 0.23) // 半径，强度，门槛
    this.composer.addPass(bloomPass)

    // 控制

    // 测试盒子
    // const geometry = new BoxGeometry(10, 10, 10)
    // const mt = new MeshBasicMaterial({ color: 0x00ff00 })
    // const cube = new Mesh(geometry, mt)
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

    Panel.camera = this.camera
    Panel.renderer = this.renderer
    this.initControls()
    requestAnimationFrame(this.animate.bind(this))

    window.addEventListener('resize', this.resize.bind(this))

    console.log(Bullet.pool)

    // document.body.addEventListener('dblclick', this.startAnim.bind(this))
  }

  private initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    // this.controls.minDistance = 500
    // this.controls.maxDistance = 1600
    this.controls.enabled = true
    this.controls.autoRotate = true
    this.controls.autoRotateSpeed = 1
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.1
  }

  public setTeams(teams: Team[] = []) {
    this.clearTeams()
    teams.forEach(team => this.addTeam(team))
    this.add(this.teamModels)
  }
  public addTeam(team: Team) {
    const index = this.teams.length + 1
    const grid = this.mapGrid[index]
    const { x, y } = grid
    team.setModel(this.assets.aerobat)
    team.position.set(x * this.gridSize + this.gridSize / 2, 300, y * this.gridSize + this.gridSize / 2)
    this.teamModels.add(team)
    this.teams.push(team)
  }
  public clearTeams() {
    this.teams.forEach(t => this.teamModels.remove(t))
    this.remove(this.teamModels)
    this.teams = []
  }

  public setTargets(targets: Target[]) {
    this.clearTargets()
    targets.forEach(target => this.addTarget(target))
  }

  public addTarget(target: Target) {
    const index = this.targets.length
    const grid = this.mapGrid[index]
    const { x, y, value } = grid
    const i = getRandom(0, this.assets.buildings.length - 1)
    target.setBuilding(this.assets.buildings[i].geometry, this.gridSize)
    // target.setBox(this.gridSize, this.gridSize)
    if (index === 0) {
      target.scale.set(2, 1.5, 2)
      target.position.set(0, -800, 0)
    } else {
      target.position.set(x * this.gridSize + this.gridSize / 2, -800, y * this.gridSize + this.gridSize / 2)
      target.scale.y = value / 100
    }
    this.add(target)
    const p = target.position
    new Tween(p)
      .delay((index + 1) * 50)
      .to({ x: p.x, y: -300, z: p.z }, 2500)
      .easing(Easing.Quadratic.Out)
      .start()
    const lineMtl = target.lines.material as Material
    lineMtl.opacity = 0.5
    new Tween(lineMtl)
      .delay((index + 1) * 100 + 3000)
      .to({ opacity: 0.3 }, 2500)
      .start()
    this.targets.push(target)
  }

  public clearTargets() {
    this.targets.forEach(t => this.remove(t))
    this.targets = []
  }

  private resize() {
    const { clientWidth, clientHeight } = this.el
    this.camera.aspect = clientWidth / clientHeight
    this.camera.updateProjectionMatrix()
    // this.controlCamera.updateProjectionMatrix()
    this.renderer.setPixelRatio(window.devicePixelRatio)
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

  animate() {
    requestAnimationFrame(this.animate.bind(this))
    this.teamModels.rotation.y -= 0.006
    this.controls.update()
    TweenUpdate()
    Panel.update()
    Fire.update()
    this.composer.render()
    if (this.statsUI) this.statsUI.update()

    // document.getElementById('b').innerText = Bullet.pool.length.toString()
    // document.getElementById('f').innerText = Fire.pool.length.toString()
    // document.getElementById('t').innerText = this.teams.length.toString()
    // document.getElementById('ta').innerText = this.targets.length.toString()
  }
}