import { Deck } from "./Deck.js"
import { Player } from "./Player.js"
import { PlayingCard } from "./PlayingCard.js"
import { RulesFactory } from "./rules/RulesFactory.js"

class Game {
  #players: Player[]
  #deck: Deck
  #discardPile: PlayingCard[]
  #activePile: PlayingCard[]
  #rulesFactory: RulesFactory

  constructor() {
    this.#players = []
    this.#discardPile = []
    this.#activePile = []

    this.#initializeDeck()
    this.#rulesFactory = new RulesFactory()
  }

  #initializeDeck() {
    this.#deck = new Deck()

    this.#deck.shuffle()
  }

  startGame() {
    this.#dealOutStartDeck()

    this.#run()
  }

  #dealOutStartDeck() {
    const dealTableCards = this.#rulesFactory.getStartDeck()

    dealTableCards.dealStartDeck(this.#deck, this.#players)
  }

  #run() {
    let winner

    while(winner) {
      winner = this.#playRound()
    }

    console.log(winner)
  }

  #playRound() {
    let validMove = false

    do {
      
    } while (validMove)
  }

  addPlayer(name: string) {
    const player = new Player(name)

    const startDeckSettings = this.#getStartDeckSettings()

    player.setStartTableSettings(startDeckSettings)

    this.#players.push(player)
  }

  #getStartDeckSettings() {
    const factory = this.#rulesFactory.getStartDeck()

    return factory.getSettings()
  }

  getPlayers() {
    return this.#players
  }

  removePlayer(player: Player) {
    this.#players = this.#players.filter(p => p !== player)
  }
}

export { Game }