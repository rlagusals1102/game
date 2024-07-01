const { Render } = Matter

export class Renderer {
  constructor(engine) {
    this.render = Render.create({
      engine,
      element: document.getElementById('game-container'),
      options: {
        wireframes: false,
        background: '#F7F4C8',
        width: 620,
        height: 850,
      },
    })
  }

  run() {
    Render.run(this.render)
  }
}
