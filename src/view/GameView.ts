import { Player } from "../model/Player.js"

interface GameView {
  addPlayer(): Promise<String>

  exitGame()

  chooseCardToPlay(player: Player, cards, activeCard)

  showWinner(player: Player)
}

export { GameView }