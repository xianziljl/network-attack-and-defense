import { BoxGeometry, Group, Mesh, MeshBasicMaterial, PerspectiveCamera } from 'three'
import { Playground } from '../common/Playground'
import { Target } from '../common/Target'

export class PlaygroundCTF extends Playground {
  teams = new Group()
  targets: Target[] = []
  focusCamera = new PerspectiveCamera(55, 1, 0.1, 5000) // 特写相机

  constructor(el: HTMLElement) {
    super(el)

    const g = new BoxGeometry(100, 100, 100)
    const m = new MeshBasicMaterial({ color: 0x00ffff })
    const mesh = new Mesh(g, m)
    this.add(mesh)
    this.animate()
  }

  animate() {
    super.animate()
  }
}