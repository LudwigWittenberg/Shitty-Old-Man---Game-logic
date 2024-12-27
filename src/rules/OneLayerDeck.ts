import { Deck } from '../Deck.js'
import { Player } from '../Player.js'
import { StartDeck } from './interfaces/StartDeck.js'

/**
 * This will deal one layer start deck.
 * 3 hidden cards, 3 visible cards on the table. And 3 cards on the hand.
 */
class OneLayerDeck implements StartDeck{
  #amountOfCards 

  constructor() {
    this.#amountOfCards = 3
  }

  /**
   * Deals out the start cards for each new round.
   * 
   * @param {Deck} deck - The deck that have all cards 
   * @param {Player} players - All players that want to play. 
   */
  dealStartDeck(deck: Deck, players: Player[]) {
    this.#dealOneLayer(deck, players, false)
    this.#dealOneLayer(deck, players, true)

    this.#dealHandCards(deck, players, true)
  }

  #dealOneLayer(deck: Deck, players: Player[], status: boolean) {
    for (let i = 0; i < this.#amountOfCards; i++) { 
      this.#dealCardToPlayerTable(deck, players, status)
    }
  }

  #dealCardToPlayerTable(deck: Deck, players: Player[], status: boolean) {
    for (const player of players) {
      const card = deck.dealCard()
      card.show(status)
      player.addTableCard(card)
    }
  }

  #dealHandCards(deck: Deck, players: Player[], status: boolean) {
    for (let i = 0; i < this.#amountOfCards; i++) { 
      this.#dealToHand(deck, players, status)
    }
  }

  #dealToHand(deck: Deck, players: Player[], status: boolean) {
    for (const player of players) {
      const card = deck.dealCard()
      card.show(status)
      player.addToHand(card)
    }
  }
}

export { OneLayerDeck }