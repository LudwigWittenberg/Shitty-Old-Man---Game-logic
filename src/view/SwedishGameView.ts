import { ReadLineAdapter } from '../adapters/ReadLineAdapter.js'
import { CHANCE } from '../enums/CHANCE.js'
import { MENU } from '../enums/MENU.js'
import { Player } from '../model/Player.js'
import { GameView } from './GameView.js'

class SwedishGameView implements GameView {
  #rl: ReadLineAdapter
  constructor() {
    this.#rl = new ReadLineAdapter()
  }

  async addPlayer(): Promise<string> {
    console.clear()
    return await this.#rl.getUserInput('Enter your Name: ')
  }

  exitGame() {
    this.#rl.exitGame()
  }

  async chooseCardToPlay(player, cards, activeCard, cardsLeft) {
    let menuLoop = true

    while (menuLoop) {
      // console.clear()
      if (activeCard) {
        console.log(`Last Card: ${activeCard.rank} ${activeCard.suit}`)
      } else {
        console.log('There is no active card.')
      }
      console.log()
      let index = 0
      const cardThatCanBePlayed = []
      console.log(player.name)

      console.log('Table Cards: ')
      for (const layer of cards.table.cards) {
        for (const card of layer) {
          if (card !== null) {
            if (cards.hand.cards.length <= 0) {
              console.log(`  ${index} ${card.rank} ${card.suit}`)
              cardThatCanBePlayed.push(card)
              index++
            } else {
              console.log(`    ${card.rank} ${card.suit}`)
            }
          }
        }
      }

      if (cards.hand.cards.length > 0) {
        console.log('Hand Cards: ')
        for (const card of cards.hand.cards) {
          console.log(`${index} ${card.rank} ${card.suit}`)
          cardThatCanBePlayed.push(card)
          index++
        }
      }

      console.log()
      if (cardsLeft > 0) {
        console.log('99. To Chance From Deck')
        console.log()
      }

      const input = await this.#rl.getUserInput(
        'Which card do you want to play? '
      )

      if (cardsLeft > 0) {
        if (input === '99') {
          return CHANCE.CHANCE
        }
      }

      const card = cardThatCanBePlayed[input]

      if (card) {
        menuLoop = false

        return card
      }
    }
  }

  async showWinner(player: Player) {
    console.clear()
    console.log(`${player.name} is the winner of this game!!!`)

    await this.#rl.getUserInput('Press enter to continue.')
  }

  async menu() {
    console.clear()

    console.log('1. Add Player')
    console.log('2. Start Shitty Old Man')
    console.log('0. Quit game!')

    const input = await this.#rl.getUserInput('Enter a choice: ')

    switch (input) {
      case '1':
        return MENU.ADD_PLAYER
      case '2':
        return MENU.START
      case '0':
        return MENU.EXIT
    }
  }

  async askAllCardsOfSameRank() {
    const respone = await this.#rl.getUserInput(
      'Do you want to play all cards of the same rank? y/n: '
    )

    if (respone === 'y' || respone === 'Y') {
      return true
    } else {
      return false
    }
  }

  // add a method that will listen to alla cards beeing added to a player. so the view can show that card
}

export { SwedishGameView }
