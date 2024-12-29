import { Deck } from "./Deck.js"
import { MOVE } from "./enums/Rules/MOVE.js"
import { Player } from "./Player.js"
import { PlayingCard } from "./PlayingCard.js"
import { RulesFactory } from "./rules/RulesFactory.js"


class Game {
  #players: Player[]
  #deck: Deck
  #discardPile: PlayingCard[]
  #activePile: PlayingCard[]
  #rulesFactory: RulesFactory
  #currentPlayer: number

  constructor() {
    this.#players = []
    this.#discardPile = []
    this.#activePile = []
    this.#currentPlayer = 0

    this.#initializeDeck()
    this.#rulesFactory = new RulesFactory()
  }

  #initializeDeck() {
    this.#deck = new Deck()

    this.#deck.shuffle()
  }

  startGame() {
    this.#dealOutStartDeck()
  }

  #dealOutStartDeck() {
    const dealTableCards = this.#rulesFactory.getStartDeck()

    dealTableCards.dealStartDeck(this.#deck, this.#players)
  }

  playRound(player: Player, cardToPlay: PlayingCard[]) {
    let validMove = false
    const gameRules = this.#rulesFactory.getGameRules()

    const action = gameRules.rules(this.#activePile, cardToPlay)

    console.log('ACTION ', action)

    switch (action) {
      case MOVE.NOT_VALID:
        validMove = false
        return MOVE.NOT_VALID
      case MOVE.PICK_UP:
        this.#playerPickUpActivePile(player)
        validMove = true
        this.#currentPlayer++
        return MOVE.PICK_UP
      case MOVE.TURNS:
        this.#validPlayerMove(player, cardToPlay)
        this.#resetActivePile()
        this.#currentPlayer++
        return MOVE.TURNS
      case MOVE.VALID:
        this.#validPlayerMove(player, cardToPlay)
        this.#currentPlayer++
        return MOVE.VALID
    }
  }

  #playerPickUpActivePile(player: Player) {
    for (const card of this.#activePile) {
      player.addToHand(card)
    }

    this.#activePile = []
  }

  #resetActivePile() {
    for (const card of this.#activePile) {
      this.#discardPile.push(card)
    }

    this.#activePile = []
  }

  #validPlayerMove(player: Player, cardToPlay: PlayingCard[]) {
    for (const card of cardToPlay) {
      player.playCard(card)
      this.#activePile.push(card)

      if (player.getHand().length < 3) {
        if (this.#deck.cardsLeft !== 0) {
          const cardFromDeck = this.#deck.dealCard()
          cardFromDeck.show(true)
          player.addToHand(cardFromDeck)
        }
      }
    }
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

  getPlayerAllCards(player: Player) {
    return {
      hand: {
        cards: player.getHand()
      },
      table: {
        cards: player.getTableCards()
      }
    }
  }

  getCurrentPlayer() {
    this.#isNewRound()

    return this.#players[this.#currentPlayer]
  }

  #isNewRound() {
    if (this.#currentPlayer >= this.#players.length) {
      this.#currentPlayer = 0
    }
  }

  doWeHaveAWinner(player: Player) {
    const winnerRules = this.#rulesFactory.getWinnerRules()

    return winnerRules.checkWinner(player)
  }

  getLastCard() {
    if (this.#activePile.length === 0) {
      return null;
    }

    const arrayLength = this.#activePile.length - 1

    return this.#activePile[arrayLength]
  }
}

export { Game }