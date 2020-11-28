import { MeshLambertMaterial, LineBasicMaterial, AdditiveBlending, NormalBlending } from 'three'

export const materials = {
  normal: {
    mesh: new MeshLambertMaterial({ color: 0x2a3d5c }),
    line: new LineBasicMaterial({ color: 0x006bff, blending: AdditiveBlending, transparent: true, opacity: 0.3 }),
    box: new MeshLambertMaterial({ color: 0x2a3d5c, transparent: true, opacity: 0.6, blending: AdditiveBlending }),
  },
  red: {
    mesh: new MeshLambertMaterial({ color: 0x350000 }),
    line: new LineBasicMaterial({ color: 0xff2000, blending: AdditiveBlending }),
    box: new MeshLambertMaterial({ color: 0xff2000, transparent: true, opacity: 0.6, blending: AdditiveBlending }),
  },
  blue: {
    mesh: new MeshLambertMaterial({ color: 0x002f69 }),
    line: new LineBasicMaterial({ color: 0x006bff, blending: AdditiveBlending }),
    box: new MeshLambertMaterial({ color: 0x006bff, transparent: true, opacity: 0.6, blending: AdditiveBlending }),
  }
}