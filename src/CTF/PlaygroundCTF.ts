import { Group, PerspectiveCamera } from 'three'
import { Playground } from '../common/Playground'
import { Target } from '../common/Target'

export class PlaygroundCTF extends Playground {
  teams = new Group()
  targets: Target[] = []
  focusCamera = new PerspectiveCamera(55, 1, 0.1, 5000) // 特写相机

  constructor(el: HTMLElement) {
    super(el)
  }
}