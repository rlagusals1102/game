import { EngineManager } from './engine.js';
import { Renderer } from './renderer.js';
import { WorldManager } from './world.js';
import { FruitManager } from './fruit.js';

export class Game {
  constructor() {
    this.engineManager = new EngineManager();
    this.renderer = new Renderer(this.engineManager.engine);
    this.worldManager = new WorldManager(this.engineManager.engine.world);
    this.fruitManager = new FruitManager(this.engineManager.engine);
    this.isGameOver = false;
    this.lastSpawnTime = 0;
    this.lastAddedFruit = null;
    this.SPAWN_DELAY = 10;
    this.GAME_OVER_DELAY = 2000;
    this.tempFruitX = 310; // Initial position of the temporary fruit
  }

  start() {
    this.renderer.run();
    this.engineManager.run();
    this.addEventListeners();
    this.startGameLoop();
  }

  addEventListeners() {
    const canvas = document.querySelector('canvas');
    canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    canvas.addEventListener('click', (e) => this.addFruit(e));
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    document.getElementById('restart-button').addEventListener('click', () => this.restartGame());
  }

  getCanvasRelativePosition(event) {
    const canvas = document.querySelector('canvas');
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }

  onMouseMove(e) {
    if (this.isGameOver) return;
    const position = this.getCanvasRelativePosition(e);
    this.tempFruitX = position.x;
    this.fruitManager.updateTempFruit(this.tempFruitX);
  }

  addFruit() {
    if (this.isGameOver) return;
    const currentTime = Date.now();
    if (currentTime - this.lastSpawnTime < this.SPAWN_DELAY) return;
    this.lastSpawnTime = currentTime;
    this.lastAddedFruit = this.fruitManager.addFruit(this.tempFruitX);
  }

  onKeyDown(e) {
    if (this.isGameOver) return;
    switch (e.key) {
      case 'a': // English 'a'
      case 'ㅁ': // Korean 'ㅁ'
        this.tempFruitX = Math.max(this.tempFruitX - 10, 47); // Move left, ensure it stays within bounds
        this.fruitManager.updateTempFruit(this.tempFruitX);
        break;
      case 'd': // English 'd'
      case 'ㅇ': // Korean 'ㅇ'
        this.tempFruitX = Math.min(this.tempFruitX + 10, 575); // Move right, ensure it stays within bounds
        this.fruitManager.updateTempFruit(this.tempFruitX);
        break;
      case 's': // English 's'
      case 'ㄴ': // Korean 'ㄴ'
        this.addFruit();
        break;
    }
  }

  startGameLoop() {
    Matter.Events.on(this.engineManager.engine, 'afterUpdate', () => {
      if (!this.isGameOver && this.checkGameOver()) {
        this.handleGameOver();
      }
    });
  }

  checkGameOver() {
    if (!this.lastAddedFruit) return false;
    const currentTime = Date.now();
    if (currentTime - this.lastSpawnTime < this.GAME_OVER_DELAY) return false;
    return this.worldManager.isAnyFruitAboveOverLine();
  }

  handleGameOver() {
    this.isGameOver = true;
    this.showGameOverModal();
  }

  showGameOverModal() {
    const gameOverModal = document.getElementById('game-over-modal');
    gameOverModal.classList.add('show');
  }

  restartGame() {
    location.reload();
  }
}