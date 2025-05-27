import { MENU } from "../enums/MENU.js"

interface GameView {
  addPlayer(): Promise<String>

  exitGame() : void

  mainMenu(): Promise<MENU>

  showGameRules() : void
}

export { GameView }