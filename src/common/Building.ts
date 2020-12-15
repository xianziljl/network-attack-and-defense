import { AdditiveBlending, Box3, BoxBufferGeometry, BufferGeometry, EdgesGeometry, Geometry, LineBasicMaterial, LineSegments, Matrix4, Mesh, MeshLambertMaterial, Object3D, PlaneBufferGeometry, Vector3 } from 'three'
import { BaseObject } from './BaseObject'
import { Fire } from './Fire'

const materials = {
  normal: {
    mesh: new MeshLambertMaterial({ color: 0x2a3d5c }),
    line: new LineBasicMaterial({ color: 0x006bff, blending: AdditiveBlending, transparent: true, opacity: 0.3 }),
    box: new MeshLambertMaterial({ color: 0x2a3d5c, transparent: true, opacity: 0.6, blending: AdditiveBlending, depthWrite: false }),
  },
  red: {
    mesh: new MeshLambertMaterial({ color: 0x350000 }),
    line: new LineBasicMaterial({ color: 0xff2000, blending: AdditiveBlending }),
    box: new MeshLambertMaterial({ color: 0xff2000, transparent: true, opacity: 0.6, blending: AdditiveBlending, depthWrite: false }),
  },
  blue: {
    mesh: new MeshLambertMaterial({ color: 0x002f69 }),
    line: new LineBasicMaterial({ color: 0x006bff, blending: AdditiveBlending }),
    box: new MeshLambertMaterial({ color: 0x006bff, transparent: true, opacity: 0.6, blending: AdditiveBlending, depthWrite: false }),
  }
}

enum Status {
  normal = 1,
  blue = 2,
  red = 3
}

export class Building extends BaseObject {
  mesh: Mesh
  line: LineSegments
  box: Mesh
  size: number
  _status: Status

  constructor(geometry: BufferGeometry | Geometry, size: number = 200) {
    super()
    // 模型
    this.size = size
    const ms = new Mesh(geometry, materials.normal.mesh)
    const msbox = new Box3().setFromObject(ms)
    const boxSize = msbox.getSize(new Vector3())
    if (boxSize.x !== boxSize.y) {
      const scale = new Matrix4().makeScale(size / boxSize.x, size / boxSize.y, size / boxSize.z)
      geometry.applyMatrix4(scale)
    }
    this.add(ms)

    // 描边
    const edges = new EdgesGeometry(ms.geometry)
    const line = new LineSegments(edges, materials.normal.line)
    this.add(line)

    // 盒子
    const boxGeometry = new BoxBufferGeometry(size, size, size)
    boxGeometry.applyMatrix4(new Matrix4().makeTranslation(0, size / 2, 0))
    const boxEdges = new EdgesGeometry(boxGeometry)
    const boxLines = new LineSegments(boxEdges, materials.blue.line)
    const box = new Mesh(boxGeometry, materials.normal.box)
    box.add(boxLines)
    this.add(box)

    box.visible = false
    this.mesh = ms
    this.line = line
    this.box = box
    
  }

  explode() {
    const playground = this.playground
    if (!playground.isPaused) {

      const fire = Fire.getOne()
      fire.position.copy(this.position)
      fire.position.y += this.size / 2
      const scale = this.size / Fire.size * 1.2
      const scaleY = this.size * this.scale.y / Fire.size * 1.5
      fire.scale.set(scale, scaleY, scale)
      playground.add(fire)
      fire.start()
  
      setTimeout(() => {
        const fire1 = Fire.getOne()
        fire1.position.copy(fire.position)
        fire1.scale.copy(fire.scale)
        fire1.rotation.y = -Math.PI / 4
        playground.add(fire1)
        fire1.start()
      }, 800)
    }
  }

  set status (status: Status) {
    this._status = status
    switch (status) {
      case Status.blue:
        this.setMaterial('blue')
        break
      case Status.red:
        this.setMaterial('red')
        break
      default:
        this.setMaterial('normal')
    }
  }
  get status(): Status {
    return this._status
  }

  private setMaterial(mtlstr: string) {
    this.mesh.material = materials[mtlstr].mesh
    this.line.material = materials[mtlstr].line
    this.box.material = materials[mtlstr].box
    const boxBorderMtl = mtlstr === 'normal' ? materials.blue.line : materials[mtlstr].line
    this.box.children[0]['material'] = boxBorderMtl
  }
}