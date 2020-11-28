import { BoxGeometry, Group, LineSegments, Mesh, MeshBasicMaterial, Object3D, Scene } from 'three'
import { Bullet } from './Bullet'
import { Panel } from './Panel'
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
  body: Object3D
  panel: Panel
  box: LineSegments

  constructor(name: string) {
    super()
    this.name = name
    this.panel = new Panel(this, { y: 20 })
  }

  public setModel(mesh: Mesh) {
    const g = new BoxGeometry(10, 10, 10)
    const m = new MeshBasicMaterial({ color: 0x00ff00 })
    const ms = new Mesh(g, m)
    this.add(ms)
  }

  private getScene(): Scene {
    let scene = this.parent
    while (scene && scene.type !== 'Scene') {
      scene = scene.parent
    }
    return scene as Scene
  }

  toAttack(target: Target, success = false) {
    const scene = this.getScene()
    if (!scene) return
    loop({
      interval: 150,
      times: 10,
      onStart:() => {
        setTimeout(() => { target.beAttack(this, success) }, 900)
      },
      callback:() => {
        Bullet.shoot(scene, this, target)
      },
      onEnd:() => {
        setTimeout(() => {
          if (success || target.winTeams.length) target.status = 2
          else target.status = 1
        }, 1100)
      }
    })
  }
}