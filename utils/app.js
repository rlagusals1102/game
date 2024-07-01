import { Game } from './game.js'
import { Tutorial } from './tutorial.js'

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game()
  game.start()

  window.addEventListener('load', () => {
    const tutorial = new Tutorial()
    if (!tutorial.isTutorialCompleted()) {
      tutorial.showTutorial()
    }
  })
})
