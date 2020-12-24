import { BufferGeometry, CubeTexture, CubeTextureLoader, DefaultLoadingManager, Geometry, ImageLoader, LinearEncoding, LogLuvEncoding, Material, MaterialLoader, Matrix4, Mesh, MeshPhongMaterial, MeshStandardMaterial, Object3D, RGBEEncoding, RGBM16Encoding, RGBM7Encoding, Texture, TextureLoader } from 'three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { AssetsLoadingManager } from '../common/LoadingManagers'

export interface AWDAssets {
  buildings?: Array<BufferGeometry | Geometry>,
  // heightimg?: HTMLImageElement,
  cubeTexture?: CubeTexture
  plane1?: Mesh
}

export class AWDAssetsLoader {
  static async load(): Promise<AWDAssets> {
    return new Promise((resolve, reject) => {
      const assets: AWDAssets = {
        buildings: []
      }
    
      let count = 7
    
      function callback() {
        count -= 1
        if (!count) resolve(assets)
      }

      new CubeTextureLoader(AssetsLoadingManager).load(Array(6).fill('/assets/imgs/bg.jpg'), cubeTexture => {
        assets.cubeTexture = cubeTexture
        callback()
      })
      new OBJLoader2(AssetsLoadingManager).load('/assets/models/2.obj', obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2(AssetsLoadingManager).load('/assets/models/3.obj', obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2(AssetsLoadingManager).load('/assets/models/4.obj', obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2(AssetsLoadingManager).load('/assets/models/5.obj', obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2(AssetsLoadingManager).load('/assets/models/6.obj', obj => {
        const mesh = obj.children[0] as Mesh
        const geometry = mesh.geometry
        // 这个模型不是居中的，在这里调整一下
        geometry.applyMatrix4(new Matrix4().makeTranslation(-750, 0, -60))
        assets.buildings.push(geometry)
        callback()
      })
      new GLTFLoader(AssetsLoadingManager).load('/assets/models/002.gltf', gltf => {
        assets.plane1 = gltf.scene.children[0] as Mesh
        callback()
      })
    })
  }
}