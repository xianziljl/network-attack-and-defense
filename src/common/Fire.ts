import { AdditiveBlending, DoubleSide, Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry, Texture, TextureLoader } from 'three'
import { BaseObject } from './BaseObject'

export class Fire extends BaseObject {
  static pool: Fire[] = []
  static size = 100
  static texture: Texture = new TextureLoader().load('/assets/imgs/fire1.png')

  index = 0
  isUpdate = 0
  texture: Texture

  constructor() {
    super()
    const g = new PlaneBufferGeometry(Fire.size, Fire.size)
    const m = new MeshBasicMaterial()
    const texture = Fire.texture.clone()
    texture.needsUpdate = true // 不加这个 clone 无效
    texture.repeat.set(1 / 4, 1 / 4)
    texture.offset.x = 0 / 4
    texture.offset.y = 3 / 4
    m.side = DoubleSide
    m.transparent = true
    m.depthWrite = false
    m.map = texture
    m.blending = AdditiveBlending
    const mesh = new Mesh(g, m)
    const mesh1 = new Mesh(g, m)
    const mesh2 = new Mesh(g, m)
    mesh1.rotation.y = -Math.PI / 2
    mesh2.rotation.x = Math.PI / 2
    mesh2.position.y = -10
    this.add(mesh, mesh1, mesh2)
    this.texture = texture
    Fire.pool.push(this)
    this.visible = false
  }

  start() {
    this.visible = true
  }

  update() {
    if (this.isUpdate > 6) this.isUpdate = 0
    if (this.isUpdate === 0) {
      const { index, texture } = this
      const x = ~~(index % 4)
      const y = 3 - ~~(index / 4)
      texture.offset.x = x / 4
      texture.offset.y = y / 4
      this.index += 1
      if (this.index === 16) {
        this.index = 0
        this.visible = false
        this.playground.remove(this)
      }
    }
    this.isUpdate += 1
  }

  static update() {
    Fire.pool.forEach(f => {
      if (f.visible) f.update()
    })
  }

  static getOne() {
    return Fire.pool.find(f => !f.visible) || new Fire()
  }
}