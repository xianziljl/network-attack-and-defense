import { BoxBufferGeometry, Mesh, MeshBasicMaterial } from 'three'

export class Area extends Mesh{
  constructor() {
    const g = new BoxBufferGeometry(1, 1, 1)
    const m = new MeshBasicMaterial({ color: 0xffffff })
    super(g, m)
  }
}