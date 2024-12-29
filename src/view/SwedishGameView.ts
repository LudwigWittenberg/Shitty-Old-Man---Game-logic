import { ReadLineAdapter } from "../adapters/ReadLineAdapter.js";
import { Player } from "../model/Player.js";
import { GameView } from "./GameView.js";

class SwedishGameView implements GameView {
  #rl: ReadLineAdapter
  constructor() {
    this.#rl = new ReadLineAdapter()
  }

  async addPlayer(): Promise<String> {
    console.clear()
    return await this.#rl.getUserInput('Enter your Name: ')
  }

  exitGame() {
    this.#rl.exitGame()
  }

  async chooseCardToPlay(player, cards, activeCard) {
    console.clear()
    if(activeCard) {
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
        if (cards.hand.cards.length < 0) {
          console.log(`${index} ${card.rank} ${card.suit}`)
          cardThatCanBePlayed.push(card)
          index++
        } else {
          console.log(`${card.rank} ${card.suit}`)
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

    const input = await this.#rl.getUserInput('Which card do you want to play?')

    const card = cardThatCanBePlayed[input]

    return card
  }

  showWinner(player: Player) {
    console.clear()
    console.log(`${player.name} is the winner of this game!!!`)
  }

}

export { SwedishGameView }