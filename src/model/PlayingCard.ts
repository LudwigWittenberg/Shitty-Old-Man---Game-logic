import { HIDDEN } from './enums/playingcard/HIDDEN.js'
import { RANKS } from './enums/playingcard/RANKS.js'
import { SUITS } from './enums/playingcard/SUITS.js'
import { getValueByName, VALUES } from './enums/playingcard/VALUES.js'

/**
 * Represents a playing card with a rank, suit, and value.
 * The card can be shown or hidden.
 */
class PlayingCard {
  #rank: RANKS
  #suit: SUITS
  #value: VALUES
  #isHidden: boolean

  constructor(rank: RANKS, suit: SUITS) {
    this.#setRank(rank)
    this.#setSuit(suit)
    this.#setValue()
    this.#isHidden = false
  }

  #setRank(rank) {
    this.#rank = rank
  }

  #setSuit(suit) {
    this.#suit = suit
  }

  #setValue() {
    this.#value = getValueByName(this.#rank)
  }

  /**
   * Returns the cards rank if the card is not hidden.
   *
   * @returns The cards rank.
   */
  get rank() {
    if (!this.#isHidden) {
      return HIDDEN.HIDDEN
    }

    return this.#rank
  }

  /**
   * Returns the cards suit if the card is not hidden.
   *
   * @returns The cards suit.
   */
  get suit() {
    if (!this.#isHidden) {
      return HIDDEN.HIDDEN
    }

    return this.#suit
  }

  /**
   * Returns the cards value if the card is not hidden.
   *
   * @returns The cards value.
   */
  valueOf() {
    if (!this.#isHidden) {
      return HIDDEN.HIDDEN
    }

    return this.#value
  }

  /**
   * Sets the option if the card is hidden or not.
   */
  show(status: boolean) {
    this.#isHidden = status
  }
}

export { PlayingCard }
