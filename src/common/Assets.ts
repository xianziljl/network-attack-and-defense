import { AdditiveBlending, BufferGeometry, CubeTexture, CubeTextureLoader, DefaultLoadingManager, Geometry, ImageLoader, LinearEncoding, LogLuvEncoding, Material, MaterialLoader, Mesh, MeshPhongMaterial, MeshStandardMaterial, Object3D, RGBEEncoding, RGBM16Encoding, RGBM7Encoding, Texture, TextureLoader } from 'three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loadUI = document.createElement('div')
loadUI.className = 'load-ui'

DefaultLoadingManager.onProgress = (url, loaded, total) => {
  if (!document.querySelector('.load-ui')) document.body.appendChild(loadUI)
  loadUI.innerHTML = `<div>LOADING... ${(loaded / total * 100).toFixed(2)}%</div>`
}
DefaultLoadingManager.onLoad = () => {
  console.log('assets loaded.')
  loadUI.innerHTML = ''
  loadUI.style.opacity = '0'
  setTimeout(() => document.body.removeChild(loadUI), 5000)
}
DefaultLoadingManager.onError = (url) => {
  console.log('load assets error.')
  loadUI.innerHTML = `<div>Load assets error: ${url}</div>`
}

export interface CTFAssets {
  buildings?: Array<BufferGeometry | Geometry>,
  aerobat?: Mesh,
  scanTexture?: Texture,
  heightimg?: HTMLImageElement,
  cubeTexture?: CubeTexture
}

export class CTFAssets {
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

      new ImageLoader().load('/assets/imgs/heigh2.jpg', img => {
        assets.heightimg = img
        callback()
      })
      new TextureLoader().load('/assets/imgs/scan.png', texture => {
        assets.scanTexture = texture
        callback()
      })
      new CubeTextureLoader().load(Array(6).fill('/assets/imgs/bg.jpg'), cubeTexture => {
        assets.cubeTexture = cubeTexture
        callback()
      })
      new OBJLoader2().load('/assets/models/2.obj', obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2().load('/assets/models/3.obj', obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2().load('/assets/models/4.obj', obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2().load('/assets/models/5.obj', obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new OBJLoader2().load('/assets/models/6.obj', obj => {
        const mesh = obj.children[0] as Mesh
        assets.buildings.push(mesh.geometry)
        callback()
      })
      new GLTFLoader().load('/assets/models/aerobat.gltf', gltf => {
        const mesh = gltf.scene.children[0].children[0] as Mesh
        assets.aerobat = mesh
        callback()
      })
    })
  }
}