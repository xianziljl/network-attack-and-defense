import { AdditiveBlending, BoxGeometry, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Loader, Matrix4, Mesh, MeshLambertMaterial, MeshPhongMaterial, Object3D, ObjectLoader } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { Panel } from './Panel'
import { Team } from './Team'

enum TargetStatus {
  normal = 1,
  attacked = 2
}

export class Target extends Object3D {
  panel = new Panel()
  lines: LineSegments
  mesh: Mesh

  name: string
  score: number
  status = TargetStatus.normal
  winTeams: Team[]

  static loader = new OBJLoader2()
  static meshMaterial = new MeshLambertMaterial({
    color: 0x2a3d5c
    // transparent: true,
    // opacity: 1
  })
  static lineMaterial = new LineBasicMaterial({
    color: 0x006bff,
    blending: AdditiveBlending
  })

  // name 靶标名称
  // score 分值，设为 0 则此靶标只做装饰
  constructor(name: string, score = 0) {
    super()
    this.name = name
    this.score = score
    
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
      blending: AdditiveBlending,
      transparent: true,
      opacity: 0.2
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
    const lines = new LineSegments(edges, Target.lineMaterial)
    this.add(lines)
  }

  destroy() {
    //   this.destroy()
  }
}