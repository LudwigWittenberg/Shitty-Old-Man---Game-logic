import { Player } from "../model/Player.js"

interface GameView {
  addPlayer(): Promise<String>

  exitGame()

  chooseCardToPlay(player: Player, cards, activeCard, cardsLeft: number)

  showWinner(player: Player)

  menu()

  askAllCardsOfSameRank()
}

export { GameView }