import { Easing, Tween } from '@tweenjs/tween.js'
import { BoxGeometry, Group, LineSegments, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, PointLight, PointLightHelper, Scene } from 'three'
import { broadcast } from '../utils/broadcast'
import { Bullet } from './Bullet'
import { Panel, TeamPanel } from './Panel'
import { Target } from './Target'

function loop(option: { interval: number, times: number, callback: Function, onStart?: Function, onEnd?: Function }) {
  let _times = option.times || 1
  let timer
  function fn() {
    option.callback()
    timer = setTimeout(() => {
      _times -= 1
      if (_times <= 0) {
        clearTimeout(timer)
        option.onEnd && option.onEnd()
      } else {
        option.callback()
        fn()
      }
    }, option.interval)
  }
  option.onStart && option.onStart()
  fn()
}


export class Team extends Object3D {
  name: string
  target: Target | null  // 当前攻击目标
  success: boolean = false

  panel: TeamPanel
  box: LineSegments

  winRecords: string[] = []

  constructor(name: string) {
    super()
    this.name = name
    this.panel = new TeamPanel(this, { y: 15, x: -40 })
  }

  public setModel(obj: Mesh) {
    const _obj = obj.clone()
    _obj.scale.set(0.2, 0.2, 0.2)
    _obj.rotation.y = -Math.PI
    _obj.position.y = -5
    const mtl = _obj.material as MeshStandardMaterial
    mtl.color.set(0x888888)
    this.add(_obj)
    this.lookAt(0, 0, 0)
  }

  private getScene(): Scene {
    let scene = this.parent
    while (scene && scene.type !== 'Scene') {
      scene = scene.parent
    }
    return scene as Scene
  }

  private startAttack() {
    this.lookAt(this.target.position)
    const toRotate = { x: this.rotation.x, y: this.rotation.y, z: this.rotation.z }
    this.rotation.set(0, 0, 0)
    new Tween(this.position)
      .to({ y: 200 }, 400)
      .easing(Easing.Quartic.InOut)
      // .onUpdate(() => {
      //   this.lookAt(this.target.position)
      // })
      .onComplete(this.attack.bind(this))
      .start()
    new Tween(this.rotation)
      .to(toRotate, 300)
      .start()
  }
  private attack() {
    const { target, success } = this
    const scene = this.getScene()
    if (!scene) return
    loop({
      interval: 150,
      times: 10,
      onStart: () => {
        setTimeout(() => { target.beAttack(this, success) }, 900)
      },
      callback: () => {
        this.lookAt(target.position)
        Bullet.shoot(scene, this, target)
      },
      onEnd: () => {
        setTimeout(this.endAttack.bind(this), 1100)
      }
    })
  }

  private endAttack() {
    const { target, success } = this
    if (success || target.winTeams.length) target.status = 2
    else target.status = 1

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

  toAttack(target: Target, success = false) {
    if (success) this.winRecords.push(target.name)
    else this.winRecords = []

    if (this.target) return
    this.target = target
    this.success = success
    this.startAttack()
  }
}