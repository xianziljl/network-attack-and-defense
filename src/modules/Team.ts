import { Group, Object3D } from 'three'
import { Panel } from './Panel'
import { Target } from './Target'

export class Team extends Group {
  name: string
  target: Target | null  // 当前攻击目标
  body: Object3D
  panel: Panel

  constructor(name: string) {
    super()
    this.name = name
    this.panel = new Panel(this)
  }

  toAttack(target: Target) {}
}