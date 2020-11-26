import { AdditiveBlending, BoxGeometry, Color, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Loader, Matrix4, Mesh, MeshLambertMaterial, MeshPhongMaterial, NormalBlending, Object3D, ObjectLoader, PointLight, PointLightHelper } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { Panel } from './Panel'
import { Team } from './Team'
import { Tween } from '@tweenjs/tween.js'

enum TargetStatus {
  normal = 1,
  blue = 2,
  red = 3
}

export class Target extends Object3D {
  panel = new Panel()
  lines: LineSegments
  mesh: Mesh
  light = new PointLight(0xff0000, 0, 400, 0.2)

  name: string
  score: number
  private _status = TargetStatus.normal
  private winTeams: Team[]

  static loader = new OBJLoader2()
  static meshMaterial = new MeshLambertMaterial({ color: 0x2a3d5c })
  

  // name 靶标名称
  // score 分值，设为 0 则此靶标只做装饰
  constructor(name: string, score = 0) {
    super()
    this.name = name
    this.score = score

    this.add(this.light)

    // this.add(new PointLightHelper(this.light, 50))
    
    // this.createBox()
    // this.createBuilding()
  }

  public setBuilding(mesh: Mesh) {
    mesh.material = Target.meshMaterial
    const ms = mesh.clone()
    this.add(ms)
    this.mesh = ms

    const edges = new EdgesGeometry(mesh.geometry)
    const lines = new LineSegments(edges, new LineBasicMaterial({
      color: 0x006bff,
      blending: NormalBlending,
      transparent: true,
      opacity: this.score ? 1 : 0.3
    }))
    lines.scale.set(mesh.scale.x, mesh.scale.y, mesh.scale.z)
    this.add(lines)
    this.lines = lines
  }

  public setBox(w: number, h: number) {
    const geometry = new BoxGeometry(w, h, w)
    const material = Target.meshMaterial
    const translate = new Matrix4().makeTranslation(0, 300 / 2, 0)
    geometry.applyMatrix4(translate)
    const mesh = new Mesh(geometry, material)
    this.mesh = mesh
    this.add(mesh)

    // 描边
    const edges = new EdgesGeometry(geometry)
    const lines = new LineSegments(edges, new LineBasicMaterial({
      color: 0x006bff,
      blending: AdditiveBlending,
      transparent: true,
      opacity: this.score ? 1 : 0.2
    }))
    this.add(lines)
    this.lines = lines
  }

  set status (status: TargetStatus) {
    this._status = status
    const material = this.lines.material as LineBasicMaterial

    // 颜色动画 color = new Color(color.getHex()) 调整 rgb 值后
    // this.material.color = color
    switch (status) {
      case TargetStatus.blue:
        material.color.set(0x0077ff)
        this.light.color.set(0x006bff)
        this.light.intensity = 0.8
        material.opacity = 1
        break

      case TargetStatus.red:
        material.color.set(0xff0000)
        this.light.intensity = 1
        material.opacity = 0.8
        break

      default:
        material.color.set(0x006bff)
        this.light.intensity = 0
        material.opacity = 0.2
    }
  }
  get status(): TargetStatus {
    return this._status
  }

  destroy() {
    //   this.destroy()
  }
}