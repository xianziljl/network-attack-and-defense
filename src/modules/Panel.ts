import { Object3D, PerspectiveCamera, WebGLRenderer } from 'three'
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { h } from '../utils/dom'
import { Target } from './Target'
import { Team } from './Team'

const HALF_ANGLE = Math.PI / 2

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

  constructor(obj: Target | Team, offset?: PanelOffset) {
    this.obj = obj
    this.el = h('div') as HTMLDivElement
    this.el.className = 'panel'
    this.content = h('div') as HTMLDivElement
    this.content.className = 'panel-content'
    this.content.innerHTML = this.obj.name || '_'
    this.el.appendChild(this.content)
    document.body.appendChild(this.el)
    Panel.instances.push(this)

    this.offset = offset || { x: 0, y: 0, z: 0 }
  }

  static update() {
    Panel.instances.forEach(p => p.update())
  }

  private update() {
    const p = this.obj.position.clone()
    p.applyMatrix4(this.obj.parent.matrixWorld)
    const distance = Panel.camera.position.distanceTo(p)

    p.y += (this.offset.y * this.obj.scale.y)
    const v = p.project(Panel.camera)

    v.x = (v.x + 1) / 2 * window.innerWidth
    v.y = -(v.y - 1) / 2 * window.innerHeight
    
    let style = `left: ${v.x}px;top: ${v.y}px;`
    if (distance > 1200) style += `transform: scale(0);opacity: 0;`
    else style += `transform: scale(1);opacity: 1;`

    this.el.setAttribute('style', style)
  }

  public destroy() {
    document.body.removeChild(this.el)
    this.el = null
  }

  get visible() {
    return this._visible
  }
  set visible(visible) {
    this._visible = !!visible
    this.el.style.visibility = this._visible ? 'visible' : 'hidden'
  }

  // show() {
  //   this.update()
  //   document.body.appendChild(this.el)
  // }

  // hide() {
  //   document.body.removeChild(this.el)
  // }
}