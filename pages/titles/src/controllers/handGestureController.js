import { prepareRunChecker } from '../../../../lib/shared/util.js'

const { shouldRun: scrollShouldRun } = prepareRunChecker({ timerDelay: 200 })
const { shouldRun: clickShouldRun } = prepareRunChecker({ timerDelay: 300 })

export default class HandGestureController {
  #camera
  #view
  #service
  #lastPosition = {
    direction: '',
    y: 0,
  }

  constructor({ view, service, camera }) {
    this.#service = service
    this.#view = view
    this.#camera = camera
  }

  async init() {
    return this.#loop()
  }

  #scrollPage(direction) {
    const pixelsPerScroll = 100
    if (this.#lastPosition.direction === direction) {
      this.#lastPosition.y =
        direction === 'scroll-down'
          ? this.#lastPosition.y + pixelsPerScroll
          : this.#lastPosition.y - pixelsPerScroll
    } else {
      this.#lastPosition.direction = direction
    }

    this.#view.scrollPage(this.#lastPosition.y)
  }

  async #estimateHands() {
    try {
      const hands = await this.#service.estimateHands(this.#camera.video)
      this.#view.clearCanvas()
      if (hands?.length) this.#view.drawResults(hands)

      for await (const { event, x, y } of this.#service.detectGestures(hands)) {
        if (event.includes('click')) {
          if (!clickShouldRun()) continue
          this.#view.clickOnElement(x, y)
          continue
        }
        if (event.includes('scroll')) {
          if (!scrollShouldRun()) continue
          this.#scrollPage(event)
        }
      }
    } catch (error) {
      console.error('deu ruim**', error)
    }
  }

  async #loop() {
    await this.#service.initializeDetector()
    await this.#estimateHands()
    this.#view.loop(this.#loop.bind(this))
  }

  static async initialize(deps) {
    const controller = new HandGestureController(deps)
    return controller.init()
  }
}
