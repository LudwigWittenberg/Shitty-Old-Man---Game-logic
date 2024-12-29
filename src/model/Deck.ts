import { RANKS } from "./enums/playingcard/RANKS.js"
import { SUITS } from "./enums/playingcard/SUITS.js"
import { PlayingCard } from './PlayingCard.js'

/**
 * Represent the Deck class.
 * With 52 PlayingCards.
 */
class Deck {
  #cards: PlayingCard[]

  constructor() {
    this.#cards = []

    this.#createDeck()
  }

  #createDeck() {
    for (const suit of Object.values(SUITS)) {
      for (const rank of Object.values(RANKS)) {
        const playingcard = new PlayingCard(rank, suit)
        playingcard.show(false)

        this.#cards.push(playingcard)
      }
    }
  }

  /**
   * Will deal the last card in the deck.
   * 
   * @returns {PlayingCard} - The last card in the array.
   */
  dealCard(): PlayingCard {
    if (this.cardsLeft <= 0) {
      throw new Error('No cards left in the deck')
    } else {
      return this.#cards.pop()
    }
  }
 
  /**
   * Will return the amount of cards left in the deck.
   *
   * @returns {number} - The amount of cards left in the deck.
   */
  get cardsLeft(): number {
    return this.#cards.length
  }

  /**
   * Shuffle tha deck after the fishermanyields array.
   */
  shuffle() {
    for (let i = this.#cards.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1))
      ;[this.#cards[i], this.#cards[randomIndex]] = [this.#cards[randomIndex], this.#cards[i]]
    }

  }

  /**
   * Adds a card to the deck.
   * 
   * @param {PlayingCard} card - The card to be added.
   */
  add(card: PlayingCard) {
    this.#cards.push(card)
  }
}

export { Deck }