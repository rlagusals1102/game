import { EngineManager } from './engine.js'
import { Renderer } from './renderer.js'
import { WorldManager } from './world.js'
import { FruitManager } from './fruit.js'

export class Game {
  constructor() {
    this.engineManager = new EngineManager()
    this.renderer = new Renderer(this.engineManager.engine)
    this.worldManager = new WorldManager(this.engineManager.engine.world)
    this.fruitManager = new FruitManager(this.engineManager.engine)
    this.isGameOver = false
    this.lastSpawnTime = 0
    this.lastAddedFruit = null
    this.SPAWN_DELAY = 10
    this.GAME_OVER_DELAY = 2000
  }

  start() {
    this.renderer.run()
    this.engineManager.run()
    this.addEventListeners()
    this.startGameLoop()
  }

  addEventListeners() {
    const canvas = document.querySelector('canvas')
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e))
    canvas.addEventListener('click', (e) => this.addFruit(e))
  }

  getCanvasRelativePosition(event) {
    const canvas = document.querySelector('canvas')
    const rect = canvas.getBoundingClientRect()
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }
  }

  onMouseMove(e) {
    if (this.isGameOver) return
    const position = this.getCanvasRelativePosition(e)
    this.fruitManager.updateTempFruit(position.x)
  }

  addFruit(e) {
    if (this.isGameOver) return
    const currentTime = Date.now()
    if (currentTime - this.lastSpawnTime < this.SPAWN_DELAY) return
    this.lastSpawnTime = currentTime
    const position = this.getCanvasRelativePosition(e)
    this.lastAddedFruit = this.fruitManager.addFruit(position.x)
  }

  startGameLoop() {
    Matter.Events.on(this.engineManager.engine, 'afterUpdate', () => {
      if (!this.isGameOver && this.checkGameOver()) {
        this.handleGameOver()
      }
    })
  }

  checkGameOver() {
    if (!this.lastAddedFruit) return false
    const currentTime = Date.now()
    if (currentTime - this.lastSpawnTime < this.GAME_OVER_DELAY) return false
    return this.worldManager.isAnyFruitAboveOverLine()
  }

  handleGameOver() {
    this.isGameOver = true
    this.showGameOverMessage()
    this.addRestartButton()
  }

  showGameOverMessage() {
    const gameOverMessage = document.createElement('div')
    gameOverMessage.textContent = '게임 오버!'
    gameOverMessage.style.position = 'absolute'
    gameOverMessage.style.top = '50%'
    gameOverMessage.style.left = '50%'
    gameOverMessage.style.transform = 'translate(-50%, -50%)'
    gameOverMessage.style.fontSize = '48px'
    gameOverMessage.style.color = 'red'
    document.body.appendChild(gameOverMessage)
  }

  addRestartButton() {
    const restartButton = document.createElement('button')
    restartButton.textContent = '재시작'
    restartButton.style.position = 'absolute'
    restartButton.style.top = '60%'
    restartButton.style.left = '50%'
    restartButton.style.transform = 'translate(-50%, -50%)'
    restartButton.style.fontSize = '24px'
    restartButton.addEventListener('click', () => location.reload())
    document.body.appendChild(restartButton)
  }
}
