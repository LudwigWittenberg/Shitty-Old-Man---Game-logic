import { CHANCE } from '../enums/CHANCE.js'
import { MENU } from '../enums/MENU.js'
import { Game } from '../model/Game.js'
import { Player } from '../model/Player.js'
import { PlayingCard } from '../model/PlayingCard.js'
import { GameView } from '../view/GameView.js'

class GameController {
  #game: Game
  #view: GameView

  constructor(view: GameView) {
    this.#game = new Game()
    this.#view = view
  }

  async run() {
    await this.#menu()
  }

  async #menu() {
    let menuLoop = true

    while (menuLoop) {
      let menuChoice = await this.#view.menu()

      switch (menuChoice) {
        case MENU.ADD_PLAYER:
          await this.#addPlayers()
          break
        case MENU.START:
          await this.#start()
          break
        case MENU.EXIT:
          menuLoop = false
          await this.#view.exitGame()
          break
      }
    }
  }

  async #start() {
    await this.#startGame()
  }

  async #addPlayers() {
    const name = await this.#view.addPlayer()

    this.#game.addPlayer(name.toString())
  }

  async #startGame() {
    this.#game.startGame()

    let winner

    do {
      winner = await this.#playerTurn()
    } while (!winner)

    await this.#view.showWinner(winner)
  }

  async #playerTurn() {
    const player = this.#game.getCurrentPlayer()

    await this.#playRound(player)

    return this.#game.doWeHaveAWinner(player)
  }

  async #playRound(player: Player) {
    let validMove

    while (!validMove) {
      const playerCards = this.#game.getPlayerAllCards(player)
      const lastCard = this.#game.getLastCard()
      const cardsLeft = this.#game.cardsLeftInDeck()

      let cardToPlay = await this.#view.chooseCardToPlay(
        player,
        playerCards,
        lastCard,
        cardsLeft
      )

      if (cardToPlay === CHANCE.CHANCE) {
        cardToPlay = this.#game.chanceFromDeck(player)
      }

      const cards = await this.#placeAllCards(player, cardToPlay)

      console.log(cardToPlay)

      validMove = this.#game.playRound(player, cards)
    }
    // show cards
    return validMove
  }

  async #placeAllCards(player, cardToPlay) {
    const playerHand = player.getHand()
    let cardsToPlay = []

    if (playerHand.length > 0) {
      cardsToPlay = await this.#selectMultipleCards(playerHand, cardToPlay)
    }

    if (this.#allCardsSame(playerHand, cardToPlay) && playerHand.length > 0) {
      const mathedTableCards = await this.#selectFromTable(player, cardToPlay)

      for (const card of mathedTableCards) {
        cardsToPlay.push(card)
      }

      // cardsToPlay = [...new Set(cardsToPlay)]
    }

    // Look only on the table cards.
    if (cardsToPlay.length === 0) {
      cardsToPlay = await this.#selectFromTable(player, cardToPlay)
    }

    return cardsToPlay
  }

  #allCardsSame(playerHand: PlayingCard[], cardToPlace: PlayingCard) {
    return playerHand.every((card) => card.rank === cardToPlace.rank)
  }

  async #selectFromTable(player: Player, cardToPlay: PlayingCard) {
    let cards = [cardToPlay]
    const tableCards = player.getTableCards()

    let amountOfCards = 0
    let cardsToPlay = []

    const seccondLayer = tableCards[1]

    for (const card of seccondLayer) {
      if (card !== null && card.rank === cardToPlay.rank) {
        amountOfCards++
      }
    }

    if (amountOfCards >= 1) {
      const respone = await this.#view.askAllCardsOfSameRank()

      if (respone) {
        cardsToPlay = this.#findAllMatchedCards(seccondLayer, cardToPlay)
      } else {
        cardsToPlay = [cardToPlay]
      }
    } else {
      cardsToPlay = [cardToPlay]
    }

    for (const card of cardsToPlay) {
      cards.push(card)
    }

    return cards
  }

  async #selectMultipleCards(
    arrayOfCards: PlayingCard[],
    cardToPlay: PlayingCard
  ) {
    let amountOfCards = 0
    let cardsToPlay = []

    for (const card of arrayOfCards) {
      if (card.rank === cardToPlay.rank) {
        amountOfCards++
      }
    }

    if (amountOfCards >= 2) {
      const respone = await this.#view.askAllCardsOfSameRank()

      if (respone) {
        cardsToPlay = this.#findAllMatchedCards(arrayOfCards, cardToPlay)
      } else {
        cardsToPlay = [cardToPlay]
      }
    } else {
      cardsToPlay = [cardToPlay]
    }

    return cardsToPlay
  }

  #findAllMatchedCards(array: PlayingCard[], cardToPlay: PlayingCard) {
    return array.filter(
      (card) => card !== null && card.rank === cardToPlay.rank
    )
  }
}

export { GameController }
