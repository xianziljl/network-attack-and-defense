import { Easing, Tween } from '@tweenjs/tween.js'
import { BoxGeometry, Group, LineSegments, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, PointLight, PointLightHelper, Scene } from 'three'
import { broadcast } from '../utils/broadcast'
import { Bullet } from '../common/Bullet'
import { Panel, TeamPanel } from '../common/Panel'
import { Playground } from '../common/Playground'
import { Target } from './_Target'
import { PlaygroundCTF } from './PlaygroundCTF'
import { BaseObject } from '../common/BaseObject'

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


export class Team extends BaseObject {
  name: string
  target: Target | null  // 当前攻击目标
  success: boolean = false

  panel: TeamPanel
  box: LineSegments
  obj: Mesh
  cpos = new Object3D() // 一个虚拟的点，用于标识特写摄像机位置

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
    this.obj = obj
    this.cpos.position.set(0, 20, -100)
    this.add(this.cpos)
    this.lookAt(0, 0, 0)
  }

  private startAttack() {
    this.playground.focus(this)
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
    const scene = this.playground
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

  toAttack(target: Target, success = false) {
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