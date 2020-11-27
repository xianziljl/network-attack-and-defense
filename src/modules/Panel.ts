import { Object3D, PerspectiveCamera, WebGLRenderer } from 'three'
import { CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer'
import { h } from '../utils/dom'

const HALF_ANGLE = Math.PI / 2
export class Panel {
  static instances: Panel[] = []
  static renderer: WebGLRenderer
  static camera: PerspectiveCamera

  private obj: Object3D
  private el: HTMLDivElement
  private _visible = false

  constructor(obj: Object3D) {
    this.obj = obj
    this.el = h('div') as HTMLDivElement
    this.el.className = 'panel'
    this.el.innerHTML = this.obj.name || '_'
    document.body.appendChild(this.el)
    Panel.instances.push(this)
  }

  static update() {
    Panel.instances.forEach(p => p.update())
  }

  private update() {
    const p = this.obj.position.clone()
    const distance = Panel.camera.position.distanceTo(p)

    p.y += (100 * this.obj.scale.y)
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