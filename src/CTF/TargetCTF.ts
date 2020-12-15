import { BufferGeometry, Geometry } from 'three'
import { Building } from '../common/Building'
import { TargetCTFPanel } from './TargetCTFPanel'
import { Team } from './Team'


export class TargetCTF extends Building{
  name: string
  score: number
  panel: TargetCTFPanel
  // 获胜队伍
  winTeams: Team[] = []

  constructor(geometry: BufferGeometry | Geometry, name: string, score: number) {
    super(geometry)
    this.name = name
    this.score = score
    this.panel = new TargetCTFPanel(this, { y: 200 })
  }

  beAttack(team: Team, success: boolean) {
    // 记录数据
    if (success) {
      this.panel.addItem(team.name)
      if (!this.winTeams.includes(team)) this.winTeams.push(team)
    }

    setTimeout(() => {
      // 执行爆炸、变色、显示面板
      this.explode()
      this.status = success ? 2 : 3
      this.panel.type = 2

      setTimeout(() => {
        // 结束
        this.panel.type = 1
        this.status = success || this.winTeams.length ? 2 : 1
      }, 4000)
    }, 1000)
  }

  destroy() {
    this.panel.destroy()
  }
}