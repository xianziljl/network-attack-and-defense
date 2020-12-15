import { PerspectiveCamera, WebGLRenderer } from 'three'
import { h } from '../utils/dom'
import { Target } from './Target'
import { Team } from '../modules/Team'

export interface PanelOffset {
  x?: number
  y?: number
  z?: number
}
export class Panel {
  static instances: Panel[] = []
  static renderer: WebGLRenderer
  static camera: PerspectiveCamera

  public obj: Target | Team
  public el: HTMLDivElement
  private _visible = false
  public offset: PanelOffset
  public content: HTMLDivElement

  constructor(obj: Target | Team, offset?: PanelOffset, elselector: string = '.playground') {
    this.obj = obj
    this.el = h('div') as HTMLDivElement
    this.el.className = 'panel'
    this.content = h('div') as HTMLDivElement
    this.content.className = 'panel-content'
    this.content.innerHTML = this.obj.name || '_'
    this.el.appendChild(this.content)
    document.querySelector(elselector).appendChild(this.el)
    Panel.instances.push(this)

    this.offset = offset || { x: 0, y: 0, z: 0 }
  }

  static update() {
    Panel.instances.forEach(p => p.update())
  }

  public update() {
    const p = this.obj.position.clone()
    this.obj.getWorldPosition(p)
    const distance = Panel.camera.position.distanceTo(p)

    p.y += (this.offset.y * this.obj.scale.y)
    const v = p.project(Panel.camera)

    v.x = (v.x + 1) / 2 * window.innerWidth
    v.y = -(v.y - 1) / 2 * window.innerHeight
    
    let style = `left: ${v.x}px;top: ${v.y}px;`
    if (distance > 1200 || distance <= 0) style += `transform: scale(0);opacity: 0;`
    else style += `transform: scale(1);opacity: 1;`

    this.el.setAttribute('style', style)
  }

  public destroy() {
    document.body.removeChild(this.el)
    this.el = null
  }
}

export class TeamPanel extends Panel {
  constructor(obj: Team, offset?: PanelOffset) {
    super(obj, offset)
    this.content.classList.add('panel-team')
  }
}

export class TargetPanel extends Panel {
  titleEl: HTMLDivElement
  listEl: HTMLDivElement
  private _type: 1 | 2 = 1
  constructor(target: Target, offset?: PanelOffset) {
    super(target, offset)
    this.content.innerHTML = ''
    this.content.classList.add('panel-target')
    this.titleEl = h('div') as HTMLDivElement
    this.titleEl.className = 'panel-target-title'
    this.titleEl.innerHTML = `<span class="name">${target.name}</span><span class="score">${target.score}分</span>`

    this.listEl = h('div') as HTMLDivElement
    this.listEl.className = 'panel-target-list'
    this.content.appendChild(this.titleEl)
    this.content.appendChild(this.listEl)
  }
  addItem(name: string) {
    const count = this.listEl.childElementCount
    if (count === 3) return
    const item = h('div')
    item.className = 'panel-target-item'
    item.innerHTML = `<span class="top">TOP0${count + 1}</span><span class="tname">${name}</span>`
    this.listEl.appendChild(item)
  }

  set type(type: 1 | 2) {
    this.content.classList.remove(`panel-target-type-${type === 1 ? 2 : 1}`)
    this.content.classList.add(`panel-target-type-${type}`)
    this._type = type
  }
  get type() {
    return this._type
  }

  update() {
    super.update()
    if (this._type === 2) {
      this.el.style.opacity = '1'
      this.el.style.transform = 'scale(1)'
    }
  }
}