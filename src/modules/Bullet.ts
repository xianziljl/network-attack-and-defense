import { Easing, Tween } from '@tweenjs/tween.js'
import { BoxBufferGeometry, Mesh, MeshBasicMaterial, Object3D, Scene } from 'three'

const mtl = new MeshBasicMaterial({ color: 0xffff00 })

export class Bullet extends Mesh {
  static pool: Bullet[] = []

  public used: boolean

  constructor() {
    const g = new BoxBufferGeometry(3, 3, 30)
    super(g, mtl)
    this.used = false
    Bullet.pool.push(this)
  }

  static shoot(playground: Scene, from: Object3D, to: Object3D) {
    const bullet = Bullet.pool.find(b => !b.used) || new Bullet()
    bullet.used = true
    const sp = from.position.clone()
    const ep = to.position.clone()
    sp.applyMatrix4(from.parent.matrixWorld)
    ep.applyMatrix4(playground.matrixWorld)
    bullet.position.set(sp.x, sp.y, sp.z)
    bullet.lookAt(to.position)
    playground.add(bullet)
    new Tween(bullet.position)
      .to(ep, 1000)
      .easing(Easing.Quadratic.In)
      .onComplete(() => {
        bullet.used = false
        playground.remove(bullet)
      })
      .start()
  }
}