export default class Controller {
  #view
  #camera
  #worker
  #blinks = 0
  constructor({ view, worker, camera }) {
    this.#view = view
    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
    this.#camera = camera
    this.#worker = this.#configureWorker(worker)
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('not yet detecting eye blink! click in the button to start')
    return controller.init()
  }

  #configureWorker(worker) {
    let ready = false
    worker.onmessage = ({ data }) => {
      if (data === 'READY') {
        console.log('worker is ready!')
        this.#view.enableBtn()
        ready = true
        return
      }
      const blinked = data.blinked
      this.#blinks += blinked
      this.#view.togglePlayVideo()
    }

    return {
      send(msg) {
        if (!ready) return
        worker.postMessage(msg)
      },
    }
  }

  loop() {
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video)
    this.#worker.send(img)
    this.log('detecting eye blink ...')
    setTimeout(() => this.loop(), 100)
  }

  async init() {
    console.log('init!!')
  }

  log(text) {
    const times = `    - blinked times: ${this.#blinks}`
    this.#view.log(`status: ${text}`.concat(this.#blinks ? times : ''))
  }

  onBtnStart() {
    this.log('initializing detection ...')
    this.#blinks = 0
    this.loop()
  }
}
