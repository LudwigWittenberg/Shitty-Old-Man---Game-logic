import { ReadLineAdapter } from '../adapters/ReadLineAdapter.js'
import { MENU } from '../enums/MENU.js'
import { GameView } from './GameView.js'

class SwedishGameView implements GameView {
  #rl: ReadLineAdapter

  constructor() {
    this.#rl = new ReadLineAdapter()
  }

  async showGameRules(): Promise<void> {
    console.log('--------------Welocme-To-Shitty-Old-Man--------------')
    console.log('----------------------GameRules----------------------')
    console.log('Describe the game rules')

    await this.#rl.getUserInput('Press Enter to continue')
  }

  async mainMenu(): Promise<MENU> {
    console.clear()
    console.log('--------------Welocme-To-Shitty-Old-Man--------------')
    console.log('1. Gamerules')
    console.log('2. Add Player')
    console.log('3. Start Game')
    console.log('0. Exit Game')

    const value = await this.#rl.getUserInput('Enter your choice: ')

    switch(value) {
      case '1':
        return MENU.GAMERULES
      case '2':
        return MENU.ADD_PLAYER
      case '3':
        return MENU.START
      case '0':
        return MENU.EXIT
    }
  }

  async addPlayer(): Promise<string> {
    console.clear()
    return await this.#rl.getUserInput('Enter your Name: ')
  }

  exitGame() {
    this.#rl.exitGame()
  }

  }

export { SwedishGameView }
