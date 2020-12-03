import { Camera, PerspectiveCamera, WebGLRenderer } from 'three'

export const camera = new PerspectiveCamera(72, 1, 0.1, 5000)
export const focusCamera = new PerspectiveCamera(55, 1, 0.1, 5000) // 特写相机
export const renderer = new WebGLRenderer({ antialias: false })