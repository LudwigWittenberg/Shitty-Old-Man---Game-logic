import { MENU } from "../enums/MENU.js";
import { GameView } from "../view/GameView.js";

class GameController {
  #gameView: GameView

  constructor(gameView: GameView) {
    this.#gameView = gameView
  }

  async start() {
    let mainMenuLoop = true

    while(mainMenuLoop) {
      const menuChoice = await this.#gameView.mainMenu()

      switch(menuChoice) {
        case MENU.GAMERULES:
          await this.#gameView.showGameRules()
          break
        case MENU.ADD_PLAYER:
          await this.#addPlayer()
          break
        case MENU.START:
          await this.#startGame()
          break
        case MENU.EXIT:
          this.#gameView.exitGame()
          mainMenuLoop = false
          break
      }
    }
  }

  async #addPlayer() {
    const playerName = await this.#gameView.addPlayer()

    // TODO: ADD PLAYER TO THE GAME
    console.log('Player added')
  }

    #startGame() {
    // TODO: Start the game
  }
}

export { GameController }
