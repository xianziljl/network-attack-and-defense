import { CubeTexture, CubeTextureLoader, ImageLoader, Mesh } from 'three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'

export interface Assets {
  building?: Mesh,
  heightimg?: HTMLImageElement,
  cubeTexture?: CubeTexture
}

export function loadAssets(cbk: Function) {
  const assets: Assets = {}

  const objLoader = new OBJLoader2()
  const imgLoader = new ImageLoader()
  const cubeTextureLoader = new CubeTextureLoader()

  let count = 3

  function callback() {
    count -= 1
    if (!count) cbk(assets)
  }

  imgLoader.load('/assets/imgs/heigh2.jpg', img => {
    assets.heightimg = img
    callback()
  })
  objLoader.load('/assets/models/building04.obj', obj => {
    assets.building = obj.children[0] as Mesh
    callback()
  })
  cubeTextureLoader.load(Array(6).fill('/assets/imgs/bg.png'), cubeTexture => {
    assets.cubeTexture = cubeTexture
    callback()
  })
}