import { Easing, Tween } from '@tweenjs/tween.js'
import { AdditiveBlending, BoxGeometry, BufferGeometry, DoubleSide, Geometry, Group, LineSegments, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshPhysicalMaterial, MeshStandardMaterial, Object3D, PointLight, PointLightHelper, Scene, TextureLoader } from 'three'
import { broadcast } from '../utils/broadcast'
import { Bullet } from '../common/Bullet'
import { PlaygroundCTF } from './PlaygroundCTF'
import { BaseObject } from '../common/BaseObject'
import { TeamCTFPanel } from './TeamCTFPanel'
import { loop } from '../utils/loop'
import { TargetCTF } from './TargetCTF'

const tailMaterial = new MeshBasicMaterial({
  transparent: true,
  blending: AdditiveBlending,
  side: DoubleSide,
  depthWrite: false,
  map: new TextureLoader().load('../assets/imgs/team-tail.png')
})


export class TeamCTF extends BaseObject {
  name: string
  target: TargetCTF | null  // 当前攻击目标
  success: boolean = false

  panel: TeamCTFPanel
  box: LineSegments
  mesh: Mesh
  cpos = new Object3D() // 一个虚拟的点，用于标识特写摄像机位置

  winRecords: string[] = []

  constructor(mesh: Mesh, name: string) {
    super()
    this.name = name
    this.panel = new TeamCTFPanel(this, { y: 55, x: -40 })

    const mtl = mesh.material as MeshStandardMaterial
    const normalMap = mtl.normalMap
    const material = new MeshPhysicalMaterial({
      color: 0x455a69,
      normalMap
    })
    mesh.material = material
    this.mesh = mesh
    mesh.scale.set(0.3, 0.3, 0.3)
    mesh.rotation.y = -Math.PI

    const g = new BoxGeometry(6, 24, 6)
    g.faces.splice(4, 2)
    const tail = new Mesh(g, tailMaterial)
    tail.rotation.x = -Math.PI / 2
    tail.position.set(-20, 40, -55)
    const tail2 = tail.clone()
    tail2.position.x = 20

    this.position.y = 400
    this.cpos.position.set(0, 20, -100)

    this.add(mesh, tail, tail2, this.cpos)
  }

  // public setModel(obj: Mesh) {
  //   const _obj = obj.clone()
  //   _obj.scale.set(0.2, 0.2, 0.2)
  //   _obj.rotation.y = -Math.PI
  //   _obj.position.y = -5
  //   const mtl = _obj.material as MeshStandardMaterial
  //   mtl.color.set(0x888888)
  //   this.add(_obj)
  //   this.obj = obj
  //   this.cpos.position.set(0, 20, -100)
  //   this.add(this.cpos)
  //   this.lookAt(0, 0, 0)
  // }

  private startAttack() {
    const playground = this.playground as PlaygroundCTF
    playground.focus(this)
    this.lookAt(this.target.position)
    const toRotate = { x: this.rotation.x, y: this.rotation.y, z: this.rotation.z }
    this.rotation.set(0, 0, 0)
    new Tween(this.position)
      .to({ y: 200 }, 400)
      .easing(Easing.Quartic.InOut)
      .onComplete(this.attack.bind(this))
      .start()
    new Tween(this.rotation)
      .to(toRotate, 300)
      .start()
  }
  private attack() {
    const { target, success } = this
    const playground = this.playground
    loop({
      interval: 150,
      times: 10,
      onStart: () => {
        setTimeout(() => { target.beAttack(this, success) }, 900)
      },
      callback: () => {
        this.lookAt(target.position)
        Bullet.shoot(playground, this, target)
      },
      onEnd: () => {
        setTimeout(this.endAttack.bind(this), 1100)
      }
    })
  }

  private endAttack() {
    // const { target, success } = this
    // if (success || target.winTeams.length) target.status = 2
    // else target.status = 1

    if (this.winRecords.length >= 3) broadcast(
      'KILL SPREE!!',
      `队伍 <span style="color:#fff">${this.name}</span> 连续攻破<span style="color:#fff">${this.winRecords.length}</span>题!`
    )
    this.target = null
    this.success = false

    new Tween(this.rotation)
      .to({ x: 0, y: 0, z: 0 }, 400)
      .start()
    new Tween(this.position)
      .to({ y: 300 })
      .easing(Easing.Quadratic.InOut)
      .start()
  }

  toAttack(target: TargetCTF, success = false) {
    if (success) this.winRecords.push(target.name)
    else this.winRecords = []

    if (this.target) return
    this.target = target
    this.success = success
    if (this.playground.isPaused) {
      this.target.beAttack(this, success)
      this.target = null
      this.success = false
    } else {
      this.startAttack()
    }
  }

  destroy() {
    this.panel.destroy()
  }
}