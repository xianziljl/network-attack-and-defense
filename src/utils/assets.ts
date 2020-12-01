import { AdditiveBlending, CubeTexture, CubeTextureLoader, ImageLoader, LinearEncoding, LogLuvEncoding, Material, MaterialLoader, Mesh, MeshPhongMaterial, MeshStandardMaterial, Object3D, RGBEEncoding, RGBM16Encoding, RGBM7Encoding, Texture, TextureLoader } from 'three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'

export interface Assets {
  building?: Mesh,
  aerobat?: Mesh,
  aerobatMormalMap?: Texture
  heightimg?: HTMLImageElement,
  cubeTexture?: CubeTexture,
  fire?: Texture
}

export function loadAssets(cbk: Function) {
  const assets: Assets = {}

  let count = 5

  function callback() {
    count -= 1
    if (!count) {
      cbk(assets)
    }
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
  new TextureLoader().load('/assets/imgs/fire1.png', texture => {
    assets.fire = texture
    callback()
  })
  new GLTFLoader().load('/assets/models/CBc1_T1(1).gltf', gltf => {
    // gltf.scene.traverse(null)
    const mesh = gltf.scene.children[0].children[0] as Mesh
    assets.aerobat = mesh
    // const mesh = gltf.scene.children[0] as Mesh
    // const mtl = mesh.material as MeshStandardMaterial
    // mtl.blending = AdditiveBlending
    // // mtl.map.encoding = LinearEncoding
    // console.log(mesh)
    
    // assets.aerobat = mesh
    callback()
  })
  // new TextureLoader().load('/assets/models/Cbc1_T1_N.tga', t => {
  //   assets.aerobatMormalMap = t
  //   callback()
  // })
  // new OBJLoader2().load('/assets/models/aerobat.obj', obj => {
  //   assets.aerobat = obj.children[0] as Mesh
  //   callback()
  // })
  // new MTLLoader().load('/assets/models/aerobat.mtl', mtls => {
  //   mtls.preload()
  //   const objLoader = new OBJLoader()
  //   objLoader.setMaterials(mtls)
  //   objLoader.load('/assets/models/aerobat.obj', obj => {
  //     assets.aerobat = obj.children[0] as Mesh
  //     callback()
  //   })
  // })
}