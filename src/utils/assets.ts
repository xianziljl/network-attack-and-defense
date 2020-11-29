import { CubeTexture, CubeTextureLoader, ImageLoader, Mesh, Object3D, Texture, TextureLoader } from 'three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'

export interface Assets {
  building?: Mesh,
  aerobat?: Mesh,
  heightimg?: HTMLImageElement,
  cubeTexture?: CubeTexture,
  fire?: Texture
}

export function loadAssets(cbk: Function) {
  const assets: Assets = {}

  let count = 5

  function callback() {
    count -= 1
    if (!count) cbk(assets)
  }

  new ImageLoader().load('/assets/imgs/heigh2.jpg', img => {
    assets.heightimg = img
    callback()
  })
  new CubeTextureLoader().load(Array(6).fill('/assets/imgs/bg.jpg'), cubeTexture => {
    assets.cubeTexture = cubeTexture
    callback()
  })
  new OBJLoader2().load('/assets/models/building-5.obj', obj => {
    assets.building = obj.children[0] as Mesh
    callback()
  })
  new OBJLoader2().load('/assets/models/aerobat.obj', obj => {
    assets.aerobat = obj.children[0] as Mesh
    callback()
  })
  new TextureLoader().load('/assets/imgs/fire.png', texture => {
    assets.fire = texture
    callback()
  })
}