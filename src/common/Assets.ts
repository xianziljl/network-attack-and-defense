import { AdditiveBlending, CubeTexture, CubeTextureLoader, DefaultLoadingManager, ImageLoader, LinearEncoding, LogLuvEncoding, Material, MaterialLoader, Mesh, MeshPhongMaterial, MeshStandardMaterial, Object3D, RGBEEncoding, RGBM16Encoding, RGBM7Encoding, Texture, TextureLoader } from 'three'
import { OBJLoader2 } from 'three/examples/jsm/loaders/OBJLoader2'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

const loadUI = document.createElement('div')
loadUI.className = 'load-ui'

DefaultLoadingManager.onStart = () => {
  document.body.appendChild(loadUI)
  loadUI.innerHTML = `<div>LOADING... 0%</div>`
}
DefaultLoadingManager.onProgress = (url, loaded, total) => {
  loadUI.innerHTML = `<div>LOADING... ${(loaded / total * 100).toFixed(2)}%</div>`
}
DefaultLoadingManager.onLoad = () => {
  loadUI.innerHTML = ''
  loadUI.style.opacity = '0'
  setTimeout(() => document.body.removeChild(loadUI), 5000)
}

interface Assets {
  buildings?: Mesh[],
}

export interface CTFAssets extends Assets {
  aerobat?: Mesh,
  heightimg?: HTMLImageElement,
  cubeTexture?: CubeTexture,
  fire?: Texture
}

export function loadCTFAssets(cbk: Function) {
  const assets: CTFAssets = {}

  let count = 9

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
  new OBJLoader2().load('/assets/models/2.obj', obj => {
    if (!assets.buildings) assets.buildings = []
    assets.buildings.push(obj.children[0] as Mesh)
    callback()
  })
  new OBJLoader2().load('/assets/models/3.obj', obj => {
    if (!assets.buildings) assets.buildings = []
    assets.buildings.push(obj.children[0] as Mesh)
    callback()
  })
  new OBJLoader2().load('/assets/models/4.obj', obj => {
    if (!assets.buildings) assets.buildings = []
    assets.buildings.push(obj.children[0] as Mesh)
    callback()
  })
  new OBJLoader2().load('/assets/models/5.obj', obj => {
    if (!assets.buildings) assets.buildings = []
    assets.buildings.push(obj.children[0] as Mesh)
    callback()
  })
  new OBJLoader2().load('/assets/models/6.obj', obj => {
    if (!assets.buildings) assets.buildings = []
    assets.buildings.push(obj.children[0] as Mesh)
    callback()
  })
  new TextureLoader().load('/assets/imgs/fire1.png', texture => {
    assets.fire = texture
    callback()
  })
  new GLTFLoader().load('/assets/models/aerobat.gltf', gltf => {
    const mesh = gltf.scene.children[0].children[0] as Mesh
    assets.aerobat = mesh
    callback()
  })
  // new OBJLoader2().load('/assets/models/bui')
}

export function loadAWDAssets(cbk: Function) {}