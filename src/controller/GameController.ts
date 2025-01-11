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
        case '1':
          await this.#addPlayers()
          break
        case '2':
          await this.#start()
          break
        case '0':
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

      const cardToPlay = await this.#view.chooseCardToPlay(
        player,
        playerCards,
        lastCard,
        cardsLeft
      )

      // A very bad way. But the controller and view in only for test purpose.
      if (cardToPlay === 'chanceFromDeck') {
        validMove = this.#game.chanceFromDeck(player)
      } else {
        const cards = await this.#placeAllCards(player, cardToPlay)

        validMove = this.#game.playRound(player, cards)
      }
    }
    // show cards
    return validMove
  }

  async #placeAllCards(player, cardToPlay) {
    const playerHand = player.getHand()

    const cardsToPlay = await this.#selectMultipleCards(playerHand, cardToPlay)

    // TODO: Trying to get so multiple cards can work from the table combined with the hand.
    // if (this.#allCardsSame(playerHand, cardToPlay)) {
    //   const tableCards = player.getTableCards()
    //   const mathedTableCards = await this.#selectFromTable(tableCards[1], cardToPlay)

    //   for (const card of mathedTableCards) {
    //     cardsToPlay.push(card)
    //   }
    // }

    // add a check if the player have more cards on the table but only if the hand will be empty after the cards have been placed.

    return cardsToPlay
  }

  #allCardsSame(playerHand: PlayingCard[], cardToPlace: PlayingCard) {
    return playerHand.every(card => card.rank === cardToPlace.rank)
  }

  async #selectFromTable(tableCards: PlayingCard[], cardToPlay: PlayingCard) {
    let cards = [cardToPlay]
    // const tableCards = player.getTableCards()

    const cardsToPlay = await this.#selectMultipleCards(tableCards, cardToPlay)

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
    return array.filter((card) => card.rank === cardToPlay.rank)
  }
}

export { GameController }
