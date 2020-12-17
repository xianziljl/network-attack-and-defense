import { DoubleSide, Mesh, MeshLambertMaterial, MeshStandardMaterial, PointLight, PointLightHelper, PointLightShadow } from 'three'
import { Building } from '../common/Building'
import { Playground } from '../common/Playground'
import { Terrain } from '../common/Terrain'
import { AWDAssets } from './AWDAssets'

export class PlaygroundAWD extends Playground {
  assets: AWDAssets

  constructor(el: HTMLElement, assets: AWDAssets) {
    super(el)
    this.assets = assets

    this.background = assets.cubeTexture

    this.camera.fov = 60
    this.camera.position.y = 800

    const plane = assets.plane1
    const mtl = plane.material as MeshStandardMaterial
    mtl.roughness = 0.9
    mtl.side = DoubleSide
    plane.scale.set(5, 5, 5)
    this.add(plane)

    const blueLight = new PointLight(0x2937ff, 2, 1500)
    const redLight = new PointLight(0xff0000, 1.6, 900)
    const whiteLight = new PointLight(0xffffff, 0.03)

    console.log(redLight)

    whiteLight.position.set(0, 1000, 0)
    blueLight.position.set(700, 500, 0)
    redLight.position.set(-600, 300, 0)
    this.add(redLight, blueLight, whiteLight)
    this.add(
      new PointLightHelper(redLight, 50),
      new PointLightHelper(blueLight, 50),
      new PointLightHelper(whiteLight, 50)
    )

    const building = new Building(assets.buildings[2])
    building.position.y = 10
    this.add(building)
    
    this.controls.autoRotate = false

    this.camera.lookAt(0, 300, 0)

    this.resize()
    this.animate()
  }
}