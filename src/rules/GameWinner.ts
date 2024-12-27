import { Player } from '../Player.js'
import { PlayingCard } from '../PlayingCard.js'
import { DeterminateWinner } from './interfaces/DeterminateWinner.js'

/**
 * Determinate who is the winnder and returns it.
 * If there is no winner the game continues.
 */
class GameWinner implements DeterminateWinner {
    /**
   * Will determinate who the winner is.
   * 
   * @param {Player} players - All players in the game.
   */
  checkWinner(players: Player[]): Player {
    let winner
    for (const player of players) {
      if (this.#checkCards(player)) {
        winner = player
      }
    }

    return winner
  }

  #checkCards(player: Player) {
    if (
      this.#handIsEmpty(player) &&
      this.#tableCardsIsEmpty(player)  
    ) {
      return true
    }

    return false
  }

  #handIsEmpty(player: Player) {
    const cardsLeft = player.getHand().length
    const EMPTY = 0

    return cardsLeft === EMPTY
  }

  #tableCardsIsEmpty(player: Player) {
    let cardsLeft = 6
    const EMPTY = 0
    const tableCards = player.getTableCards()

    for (const layer of tableCards) {
      for (const card of layer) {
        if (this.#isNull(card)) {
          cardsLeft--
        }
      }
    }

    if (cardsLeft === EMPTY) {
      return true
    }

    return false
  }

  #isNull(card: PlayingCard) {
    return card === null
  }
}

export { GameWinner }