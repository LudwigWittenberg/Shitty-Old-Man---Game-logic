import { CardObserver } from "./Observers/CardObserver.js"
import { ListenNewCard } from "./Observers/ListenNewCard.js"
import { PlayingCard } from "./PlayingCard.js"

class Player implements CardObserver {
  #name: string
  #hand: PlayingCard[]
  #tableCards
  #tableCardsAvailble
  subscribers: ListenNewCard[]

  constructor(name: string) {
    this.#setName(name)
    this.#hand = []
    this.#tableCards = []
    this.#tableCardsAvailble = []
    this.subscribers = []
  }

  /**
   * Adds an observer to the list of subscribers.
   * 
   * @param {ListenNewCard} observer - The observer to be added.
   */
  addObserver(observer: ListenNewCard) {
    this.subscribers.push(observer)
  }

  /**
   * Removes an observer from the list of subscribers.
   * 
   * @param {ListenNewCard} observer - The observer to be removed.
   */
  removeObserver(observer: ListenNewCard) {
    this.subscribers = this.subscribers.filter(subscriber => subscriber !== observer);
  }

  /**
   * Notifies all observers with the provided card.
   * 
   * @param {PlayingCard} card - The card to be sent to the observers.
   */
  notifyObservers(card: PlayingCard) {
    for (const subscriber of this.subscribers) {
      subscriber.update(this, card)
    }
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

  /**
   * Returns tha name of the current player.
   *
   * @returns {string} The name of the player.
   */
  get name(): string {
    return this.#name
  }

  /**
   * Will add a playingcard to the players hand.
   * 
   * @param {PlayingCard} card - A card that the player have. 
   */
  addToHand(card: PlayingCard) {
    this.#hand.push(card)

    this.notifyObservers(card)

    this.#sortHand()

    if (this.#hand.length === 1) {
      this.#changeAvailability(false)
    }
  }

  #sortHand() {
    this.#hand.sort((a, b) => Number(a.valueOf()) - Number(b.valueOf()))
  }

  playCard(card: PlayingCard) {
    if (this.#hand.length === 0) {
      this.#removeFromTable(card)
    } else {
      this.#removeFromHand(card)
    }
  }

  /**
   * Will remove a card from the hand.
   * 
   * @param {PlayingCard} card - The card to be removed. 
   */
  #removeFromHand(cardToRemove: PlayingCard) {
    let cardFound = false

    this.#hand = this.#hand.filter(card => {
      const isMatch = card.rank === cardToRemove.rank && card.suit === cardToRemove.suit
      if (isMatch) {
        cardFound = true // Mark as found
      }
      return !isMatch // Keep cards that don't match
    })

    if (!cardFound) {
      throw new Error("Card not found in hand")
    }

    this.#isHandEmpty()
  }

  #isHandEmpty() {
    const handLength = this.#hand.length

    if (handLength === 0) {
      this.#changeAvailability(true)
    }
  }

  #changeAvailability(status: boolean) {
    const NUM_OF_CARDS = 3

    // fix the index values.
    let LAST_LAYER = this.#tableCards.length - 1
    let layerToChange = this.#tableCards.length - 1

    // check if the top layer have cards or not.
    if (this.#tableCards[LAST_LAYER].every(card => card === null)) {
      layerToChange -= 1
    }

    // change the status of each card in to top layer.
    for (let i = 0; i < NUM_OF_CARDS; i++) {
      if (this.#tableCardsAvailble[layerToChange]) {
        this.#tableCardsAvailble[layerToChange][i] = status
      }
    }
  }

  /**
   * Returns tha players current hand.
   * 
   * @returns {PlayingCard[]} - The players hand.
   */
  getHand() {
    return this.#hand
  }

  setStartTableSettings(settings) {
    this.#tableCardsAvailble = settings

    this.#initzalizeTableCardsArray()
  }

  #initzalizeTableCardsArray() {
    for (let i = 0; i < this.#tableCardsAvailble.length; i++) {
      this.#tableCards.push([])

      // starts with every card place null
      for (let col = 0; col < this.#tableCardsAvailble[i].length; col++) {
        this.#tableCards[i].push(null)
      }
    }
  }

  /**
   * Returns the card availability.
   * 
   * @returns {boolean} The availability for each card
   */
  getTableSettings() {
    return this.#tableCardsAvailble
  }

  /**
   * Add new card to the players table.
   * 
   * @param {PlayingCard} card The card to be placed at the table.
   */
  addTableCard(card: PlayingCard) {
    const LAYERS = this.#tableCards.length
    const NUM_OF_CARDS = 3

    // add a card to a specific place in the array.
    // start from 0 0 to what ever the settings says.
    for (let i = 0; i < LAYERS; i++) {
      for (let index = 0; index < NUM_OF_CARDS; index++) {
        if (this.#tableCards[i][index] === null) {
          this.#tableCards[i][index] = card
          this.notifyObservers(card)
          return
        }
      }
    }
  }

  /**
   * Returns tha table cards that have been dealt in the begining.
   * 
   * @returns {PlayingCard} - All the players table cards.
   */
  getTableCards() {
    return this.#tableCards
  }

  /**
   * Remove a specific card from the table. Only card that is availbe will be removed.
   * replaced that spot with null to identifie that spot hase been removed.
   * 
   * @param card 
   */
  #removeFromTable(card: PlayingCard) {
    for (let row = 0; row < this.#tableCards.length; row++) {
      for (let colIndex = 0; colIndex < this.#tableCards[row].length; colIndex++) {
        if (this.#tableCards[row][colIndex] === card) {
          if (this.#tableCardsAvailble[row][colIndex]) {
            this.#tableCards[row][colIndex] = null
          }
        }
      }

      this.#everyCardIsNull(row)
    }
  }

  #everyCardIsNull(index: number) {
    if (this.#tableCards[index].every(card => card === null)) {
      this.#changeAvailability(true)
    }
  }
}

export { Player }