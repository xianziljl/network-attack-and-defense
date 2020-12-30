import { BufferGeometry, CubeTexture, CubeTextureLoader, DefaultLoadingManager, Geometry, ImageLoader, LinearEncoding, LogLuvEncoding, Material, MaterialLoader, Matrix4, Mesh, MeshPhongMaterial, MeshStandardMaterial, Object3D, RGBEEncoding, RGBM16Encoding, RGBM7Encoding, Texture, TextureLoader } from 'three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { AssetsLoadingManager } from '../common/LoadingManagers'
import { imgsDir, modelsDir } from '../consts'

export interface CTFAssets {
  buildings?: Array<BufferGeometry | Geometry>,
  aerobat?: Mesh,
  scanTexture?: Texture,
  heightimg?: HTMLImageElement,
  cubeTexture?: CubeTexture
}

export class CTFAssetsLoader {
  static async load(): Promise<CTFAssets> {
    return new Promise((resolve, reject) => {
      const assets: CTFAssets = {
        buildings: []
      }
    
      let count = 9
    
      function callback() {
        count -= 1
        if (!count) resolve(assets)
      }

      new ImageLoader(AssetsLoadingManager).load(`${imgsDir}/heigh2.jpg`, img => {
        assets.heightimg = img
        callback()
      })
      new TextureLoader(AssetsLoadingManager).load(`${imgsDir}/scan.png`, texture => {
        assets.scanTexture = texture
        callback()
      })
      new CubeTextureLoader(AssetsLoadingManager).load(Array(6).fill(`${imgsDir}/bg.jpg`), cubeTexture => {
        assets.cubeTexture = cubeTexture
        callback()
      })
      new OBJLoader2(AssetsLoadingManager).load(`${modelsDir}/2.obj`, obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2(AssetsLoadingManager).load(`${modelsDir}/3.obj`, obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2(AssetsLoadingManager).load(`${modelsDir}/4.obj`, obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2(AssetsLoadingManager).load(`${modelsDir}/5.obj`, obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2(AssetsLoadingManager).load(`${modelsDir}/6.obj`, obj => {
        const mesh = obj.children[0] as Mesh
        const geometry = mesh.geometry
        // 这个模型不是居中的，在这里调整一下
        geometry.applyMatrix4(new Matrix4().makeTranslation(-750, 0, -60))
        assets.buildings.push(geometry)
        callback()
      })
      new GLTFLoader(AssetsLoadingManager).load(`${modelsDir}/aerobat.gltf`, gltf => {
        const mesh = gltf.scene.children[0].children[0] as Mesh
        assets.aerobat = mesh
        callback()
      })
    })
  }
}