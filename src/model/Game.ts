import { Deck } from './Deck.js'
import { HIDDEN } from './enums/playingcard/HIDDEN.js'
import { MOVE } from './enums/Rules/MOVE.js'
import { ListenNewCard } from './Observers/ListenNewCard.js'
import { Player } from './Player.js'
import { PlayingCard } from './PlayingCard.js'
import { RulesFactory } from './rules/RulesFactory.js'

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

  /**
   * Start the game. Will deal out cards to every player.
   */
  startGame() {
    this.#restartGame()

    this.#dealOutStartDeck()
  }

  #dealOutStartDeck() {
    const dealTableCards = this.#rulesFactory.getStartDeck()

    dealTableCards.dealStartDeck(this.#deck, this.#players)
  }

  /**
   * Play one round of the game with the current player.
   *
   * @param {Player} player - The current player whos turns it is to play.
   * @param {PlayingCard} cardToPlay - The cards to be played by the player.
   * @returns {MOVE} Return tha action of the move.
   */
  playRound(player: Player, cardToPlay: PlayingCard[]) {
    const gameRules = this.#rulesFactory.getGameRules()

    const action = gameRules.rules(this.#activePile, cardToPlay, player)

    switch (action) {
      case MOVE.NOT_VALID:
        return MOVE.NOT_VALID
      case MOVE.PICK_UP:
        this.#validPlayerMove(player, cardToPlay)
        this.#playerPickUpActivePile(player)
        this.#currentPlayer++
        return MOVE.PICK_UP
      case MOVE.TURNS:
        this.#validPlayerMove(player, cardToPlay)
        this.#resetActivePile()
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
    console.log('jag resettas')
    for (const card of this.#activePile) {
      this.#discardPile.push(card)
    }

    this.#activePile = []
  }

  #validPlayerMove(player: Player, cardToPlay: PlayingCard[]) {
    for (const card of cardToPlay) {
      if (card.rank === HIDDEN.HIDDEN) [
        console.log('HODDEN')
      ]
      if (!player.canCardBePlayed(card)) {
        console.log(`Card ${card.rank} ${card.suit} cannot be played.`)
        
      } else {
        console.log('CARD HAVE BEEN PLACED')
        player.playCard(card)

        
        console.log(this.#activePile[this.#activePile.length - 1])
        this.#activePile.push(card)
        console.log(this.#activePile[this.#activePile.length - 1])

        if (this.#isHandFull(player)) {
          if (!this.#isDeckEmpty()) {
            const cardFromDeck = this.#deck.dealCard()
            cardFromDeck.show(true)
            // player.addToHand(cardFromDeck)
          }
        }

        // this.#activePile = [...new Set(this.#activePile)]
      }
    }
  }

  #isHandFull(player: Player) {
    const FULL_HAND = 3
    return player.getHand().length < FULL_HAND
  }

  #isDeckEmpty() {
    return this.#deck.cardsLeft === 0
  }

  /**
   * Add a Player to the game.
   *
   * @param {string} name - The name of the player.
   */
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

  /**
   * Get all players in the game.
   *
   * @returns {Player[]} Returns an array of every player in the current game.
   */
  getPlayers() {
    return this.#players
  }

  /**
   * Remove a specific player from the game.
   *
   * @param {Player} player The player to remove from the game.
   */
  removePlayer(player: Player) {
    this.#players = this.#players.filter((p) => p !== player)
  }

  /**
   * Returns all of the players hand and table cards.
   *
   * @param {Player} player - The player to get the cards from.
   * @returns {object} All PlayingCards from a specific user.
   */
  getPlayerAllCards(player: Player) {
    return {
      hand: {
        cards: player.getHand(),
      },
      table: {
        cards: player.getTableCards(),
      },
    }
  }

  /**
   * Get the current player. When all players have played, its resets to the first player again.
   *
   * @returns {Player} The current players turn.
   */
  getCurrentPlayer() {
    this.#isNewRound()

    return this.#players[this.#currentPlayer]
  }

  #isNewRound() {
    if (this.#currentPlayer >= this.#players.length) {
      this.#currentPlayer = 0
    }
  }

  /**
   * Will controll if we have a winner in the game.
   *
   * @param {Player} player - The player to chech if he is the winner of the game.
   * @returns {Player || undefiend} - Will return the player if he won the game. Otherwise undefined.
   */
  doWeHaveAWinner(player: Player) {
    const winnerRules = this.#rulesFactory.getWinnerRules()

    return winnerRules.checkWinner(player)
  }

  /**
   * Get the last card of the active pile.
   *
   * @returns {PlayingCard || null} Tha last placed card in the active pile.
   * Null is when the active pile is empty.
   */
  getLastCard() {
    if (this.#activePile.length === 0) {
      return null
    }

    const arrayLength = this.#activePile.length - 1

    return this.#activePile[arrayLength]
  }

  /**
   * The current player want to chance to draw a card from the deck.
   *
   * @param {Player} player - The player who wants to gamble.
   * @returns {MOVE} - The validity of the move.
   */
  chanceFromDeck(player: Player) {
    const chanceCard = this.#deck.dealCard()
    chanceCard.show(true)
    player.addToHand(chanceCard)

    return chanceCard
  }

  cardsLeftInDeck(): number {
    return this.#deck.cardsLeft
  }

  #restartGame() {
    this.#initializeDeck()
  }
}

export { Game }
