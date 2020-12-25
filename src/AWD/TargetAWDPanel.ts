import { Panel } from '../common/Panel'
import { devices } from './devices'
import { TargetAWD } from './TargetAWD'

export class TargetAWDPanel extends Panel{
  constructor(target: TargetAWD) {
    super(target, { y: target.size * 0.2 }, 5000)
    this.content.classList.add('panel-target-awd')
    this.content.innerHTML = `<div class="icon">${target.icon}</div>
    <div class="f1" style="padding: 3px 10px 0 0;">
      <div>${target.name}</div>
      <div class="bar"><div class="bld"></div></div>
    </div>`
  }
}