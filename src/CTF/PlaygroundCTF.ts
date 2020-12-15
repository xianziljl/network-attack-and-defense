import { AdditiveBlending, BoxGeometry, CircleBufferGeometry, DoubleSide, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Material, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, PerspectiveCamera, PlaneBufferGeometry, Texture, TextureLoader } from 'three'
import { CTFAssets } from '../common/Assets'
import { Fire } from '../common/Fire'
import { Playground } from '../common/Playground'
import { Terrain } from '../common/Terrain'
import { Team } from './Team'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { Panel } from '../common/Panel'
import { MapGrid } from './MapGrid'
import { Tween, Easing } from '@tweenjs/tween.js'
import { TargetCTF } from './TargetCTF'

export class PlaygroundCTF extends Playground {
  // 底部雷达扫描
  scan: Mesh
  // 场景所需资源
  assets: CTFAssets
  // 队伍
  teams: Team[] = []
  teamGroup: Group = new Group()
  // 靶标
  targets: TargetCTF[] = []
  // 特写相机
  focusCamera = new PerspectiveCamera(55, 1, 0.1, 5000)
  // 特写渲染合成
  focusScenePass = new RenderPass(this, this.focusCamera)
  // 当前是否为特写状态
  isFocus = false
  // 当前特写的队伍
  focusTeam: Team
  // 地图网格
  mapGrid = new MapGrid()
  gridSize = 210

  constructor(el: HTMLElement, assets: CTFAssets) {
    super(el)
    if (!assets) throw new Error('缺少场景资源.')
    this.assets = assets

    Panel.camera = this.camera

    // 天空盒
    this.background = assets.cubeTexture

    // 地形
    const material = new LineBasicMaterial({ color: 0x006bff, blending: AdditiveBlending })
    const terrainGeometry = new Terrain(assets.heightimg)
    const edges = new EdgesGeometry(terrainGeometry)
    const terrain = new LineSegments(edges, material)
    terrain.position.set(0, -300, -300)
    terrain.scale.set(60, 700, 60)
    this.add(terrain)
    
    // 雷达扫描
    const g = new PlaneBufferGeometry(1800, 1800)
    g.applyMatrix4(new Matrix4().makeRotationX(-Math.PI / 2))
    const m = new MeshBasicMaterial({
      transparent: true,
      blending: AdditiveBlending,
      map: assets.scanTexture
    })
    this.scan = new Mesh(g, m)
    this.scan.position.y = -320
    this.add(this.scan)

    // 地板
    const pg = g.clone()
    const pm = new MeshLambertMaterial({ color: 0x2a3d5c, side: DoubleSide })
    const mesh = new Mesh(pg, pm)
    mesh.scale.set(3, 1, 3)
    mesh.position.y = -350
    this.add(mesh)

    // 添加队伍组
    this.add(this.teamGroup)
    
    this.animate()
  }

  setTeams(teams: Team[] = []) {
    this.clearTeams()
    teams.forEach(team => this.addTeam(team))
  }

  addTeam(team: Team) {
  }
  
  clearTeams() {
    this.teams.forEach(t => {
      this.teamGroup.remove(t)
      t.destroy()
    })
    this.teams = []
  }

  setTargets(targets: TargetCTF[] = []) {
    this.clearTargets()
    targets.forEach(item => this.addTarget(item))
  }

  addTarget(target: TargetCTF) {
    const index = this.targets.length
    const grid = this.mapGrid[index]
    const { x, y, value } = grid
    if (index === 0) {
      target.scale.set(2, 2, 2)
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
    const lineMtl = target.line.material as Material
    lineMtl.opacity = 0.5
    new Tween(lineMtl)
      .delay((index + 1) * 100 + 3000)
      .to({ opacity: 0.3 }, 2500)
      .start()
    this.targets.push(target)
  }

  clearTargets() {
    this.targets.forEach(t => {
      this.remove(t)
      t.destroy()
    })
    this.targets = []
  }

  focus(team: Team) {
    if (this.isFocus || !team || this.focusTeam) return
    this.focusTeam = team
    Panel.camera = this.focusCamera
    this.composer.passes = [this.focusScenePass, this.bloomPass]
    this.isFocus = true
    this.controls.enabled = false
    setTimeout(this.unFocus, 3000)
  }

  unFocus() {
    Panel.camera = this.camera
    this.composer.passes = [this.scenePass, this.bloomPass]
    this.focusTeam = null
    this.controls.enabled = true
    // 延迟 2秒，避免频繁特写
    setTimeout(() => {
      this.isFocus = false
    }, 2000)
  }

  animate() {
    super.animate()
    this.scan.rotation.y += 0.04
    Panel.update()
    Fire.update()
  }
}