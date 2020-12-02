import { AdditiveBlending, BoxBufferGeometry, BoxGeometry, BufferGeometry, Color, EdgesGeometry, Geometry, Group, LineBasicMaterial, LineSegments, Loader, Matrix4, Mesh, MeshLambertMaterial, MeshPhongMaterial, NormalBlending, Object3D, ObjectLoader, PointLight, PointLightHelper, Scene } from 'three'
import { Panel, TargetPanel } from './Panel'
import { Team } from './Team'
import { Tween } from '@tweenjs/tween.js'
import { materials } from './materials'
import { Fire } from './Fire'

enum TargetStatus {
  normal = 1,
  blue = 2,
  red = 3
}

const colorRed = new Color(0xff0000)
const colorBlue = new Color(0x0020ff)

export class Target extends Object3D {
  panel: TargetPanel
  lines: LineSegments
  box: Mesh
  mesh: Mesh
  light = new PointLight(colorRed, 0.8, 350)

  name: string
  score: number
  winTeams: Team[] = []
  private _status = TargetStatus.normal
  

  // name 靶标名称
  // score 分值，设为 0 则此靶标只做装饰
  constructor(name: string, score = 0) {
    super()
    this.name = name
    this.score = score
    const panel = new TargetPanel(this, { y: 200 })
    this.panel = panel
  }

  public setBuilding(geometry: BufferGeometry | Geometry, size: number) {
    const ms = new Mesh(geometry, materials.normal.mesh)
    this.add(ms)
    this.mesh = ms

    const edges = new EdgesGeometry(ms.geometry)
    const lines = new LineSegments(edges, materials.normal.line)
    lines.scale.set(ms.scale.x, ms.scale.y, ms.scale.z)
    this.add(lines)
    this.lines = lines

    const boxGeometry = new BoxBufferGeometry(size, size, size)
    boxGeometry.applyMatrix4(new Matrix4().makeTranslation(0, size / 2, 0))
    const boxEdges = new EdgesGeometry(boxGeometry)
    const boxLines = new LineSegments(boxEdges, materials.blue.line)
    const box = new Mesh(boxGeometry, materials.normal.box)
    box.add(boxLines)
    box.visible = false
    this.add(box)
    this.box = box
    
    this.panel.el.addEventListener('mouseenter', () => this.box.visible = true)
    this.panel.el.addEventListener('mouseleave', () => this.box.visible = false)
  }

  set status (status: TargetStatus) {
    this._status = status
    switch (status) {
      case TargetStatus.blue:
        this.setMaterial('blue')
        // this.light.color = colorBlue
        this.remove(this.light)
        break

      case TargetStatus.red:
        this.setMaterial('red')
        this.light.color = colorRed
        this.add(this.light)
        break

      default:
        this.setMaterial('normal')
        this.remove(this.light)
    }
  }
  get status(): TargetStatus {
    return this._status
  }
  
  private getScene(): Scene {
    let scene = this.parent
    while (scene && scene.type !== 'Scene') {
      scene = scene.parent
    }
    return scene as Scene
  }

  private setMaterial(mtlstr: string) {
    this.mesh.material = materials[mtlstr].mesh
    this.lines.material = materials[mtlstr].line
    this.box.material = materials[mtlstr].box
    const boxBorderMtl = mtlstr === 'normal' ? materials.blue.line : materials[mtlstr].line
    this.box.children[0]['material'] = boxBorderMtl
  }

  public beAttack(team: Team, success: boolean) {
    const fire = Fire.getOne()
    fire.position.copy(this.position)
    fire.scale.set(this.scale.x, this.scale.y * 1.5, this.scale.z)
    fire.position.y += Fire.size * this.scale.y / 3
    const scene = this.getScene()
    scene.add(fire)
    fire.start()
    const fire1 = Fire.getOne()
    fire1.position.copy(fire.position)
    fire1.scale.copy(fire.scale)
    fire1.rotation.y = -Math.PI / 4
    scene.add(fire1)
    this.panel.type = 2 // 显示详情
    setTimeout(() => {
      this.panel.type = 1
    }, 5000)
    setTimeout(() => {
      fire1.start()
    }, 600)
    if (success) {
      this.status = 2
      this.panel.addItem(team.name)
      if (!this.winTeams.includes(team)) this.winTeams.push(team)
    } else {
      this.status = 3
    }
  }

  destroy() {
    this.panel.destroy()
  }
}