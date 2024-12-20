import { PlayingCard } from "./PlayingCard.js"

class Player {
  #name: string
  #hand: PlayingCard[]
  #tableCards: PlayingCard[][]
  #tableCardsAvailble: boolean[][]

  constructor(name: string) {
    this.#setName(name)
    this.#hand = []
    this.#tableCards = [
      [null, null, null],
      [null, null, null]
    ]
    this.#tableCardsAvailble = [
      [false, false, false],
      [false, false, false]
    ]
  }

  #setName(name: string) {
    if (!this.#isValidName(name)) {
      throw new Error('Invalid name')
    }

    this.#name = name
  }

  #isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-Z0-9 ]+$/
    return name.length > 0 && nameRegex.test(name)
  }

  get name() {
    return this.#name
  }

  addToHand(card: PlayingCard) {
    this.#hand.push(card)

    this.#sortHand()
  }

  #sortHand() {
    this.#hand.sort((a, b) => a.valueOf() - b.valueOf())
  }

  removeFromHand(card: PlayingCard) {
    const index = this.#hand.findIndex(cardOnHand => cardOnHand.suit === card.suit && cardOnHand.rank === card.rank)
    if (index !== -1) {
      this.#hand.splice(index, 1);
    }

    if (this.#hand.length === 0) {
      this.#tableCardsAvailble = [
        [false, false, false],
        [true, true, true]
      ]
    }
  }

  getHand() {
    return this.#hand
  }

  addTableCards(card: PlayingCard) {
    const LAYERS = 2
    const MAX_CARDS = 3

    for (let i = 0; i < LAYERS; i++) {
      for (let j = 0; j < MAX_CARDS; j++) {
        if (this.#tableCards[i][j] === null) {
          this.#tableCards[i][j] = card
          return
        }
      }
    }
  }

  removeTableCard(card: PlayingCard) {
    const LAYERS = 2
    const MAX_CARDS = 3

    for (let i = 0; i < LAYERS; i++) {
      for (let j = 0; j < MAX_CARDS; j++) {
        if (this.#tableCards[i][j] === card) {
          if (this.#tableCardsAvailble[i][j]) {
            const index = this.#hand.findIndex(cardOnHand => cardOnHand.suit === card.suit && cardOnHand.rank === card.rank)
            if (index !== -1) {
              this.#hand.splice(index, 1);
            }
          }
        }
      }
    }
  }

  getTableCards() {
    return this.#tableCards
  }

}

export { Player }