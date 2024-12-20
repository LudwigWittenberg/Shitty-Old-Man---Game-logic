import { RANKS }  from './enums/playingcard/RANKS.js'
import { SUITS } from './enums/playingcard/SUITS.js';
import { getValueByName, VALUES } from './enums/playingcard/VALUES.js';

class PlayingCard {
  #rank: RANKS
  #suit: SUITS
  #value: VALUES
  #isHidden: Boolean

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

  get rank():RANKS {
    if (!this.#isHidden) {
      return undefined
    }

    return this.#rank
  }

  get suit(): SUITS {
    if (!this.#isHidden) {
      return undefined
    }

    return this.#suit
  }

  valueOf(): VALUES {
    if (!this.#isHidden) {
      return undefined
    }

    return this.#value
  }

  show(status: boolean) {
    this.#isHidden = status
  }
}

export { PlayingCard }