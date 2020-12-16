import { Object3D, PerspectiveCamera, WebGLRenderer } from 'three'
import { h } from '../utils/dom'

export interface PanelOffset {
  x?: number
  y?: number
  z?: number
}
export class Panel {
  static instances: Panel[] = []
  static renderer: WebGLRenderer
  static camera: PerspectiveCamera

  public obj: Object3D
  public el: HTMLDivElement
  private _visible = false
  public offset: PanelOffset
  public content: HTMLDivElement

  constructor(obj: Object3D, offset?: PanelOffset, elselector: string = '.playground') {
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
    
    let style = `transform: translate3d(${v.x}px, ${v.y}px, 0);`
    if (distance > 1200 || distance <= 0) style += `visibility: hidden;`
    else style += `visibility: visible;`

    this.el.setAttribute('style', style)
  }

  public destroy() {
    document.body.removeChild(this.el)
    this.el = null
  }
}

