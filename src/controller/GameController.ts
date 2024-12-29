import { Game } from "../model/Game.js"
import { Player } from "../model/Player.js"
import { GameView } from '../view/GameView.js'

class GameController {
  #game: Game
  #view: GameView

  constructor(view: GameView) {
    this.#game = new Game()
    this.#view = view
  }

  async run() {
    // To add 2 players
    await this.#addPlayers()
    await this.#addPlayers()

    await this.#startGame()

    this.#view.exitGame()
  }

  async #addPlayers() {
    const name = await this.#view.addPlayer()

    this.#game.addPlayer(name.toString())
  }

  async #startGame() {
    this.#game.startGame()

    const players = this.#game.getPlayers()

    // show all cards
    // for (const player of players) {
    //   const playerCards = this.#game.getPlayerAllCards(player)
    //   this.#view.showPlayerCard(player, playerCards)
    // }
    let winner

    do {
      const player = this.#game.getCurrentPlayer()

      await this.#playRounds(player)

      winner = this.#game.doWeHaveAWinner(player)
    } while (!winner)

      this.#view.showWinner(winner)
  }

  async #playRounds(player: Player) {
    let validMove

    while (!validMove) {
      const playerCards = this.#game.getPlayerAllCards(player)
      const lastCard = this.#game.getLastCard()
      const cardToPlay = await this.#view.chooseCardToPlay(player, playerCards, lastCard)
  
      const cards = [cardToPlay]
      
      validMove = this.#game.playRound(player, cards)

      console.log('VALID MOVE ', validMove)
    }
    // show cards
  }
}

export { GameController }