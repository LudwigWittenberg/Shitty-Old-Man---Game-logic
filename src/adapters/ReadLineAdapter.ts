import * as readline from 'node:readline/promises'
import { stdin as input, stdout as output } from 'node:process'

/**
 * An adapter for the readLine.
 * Will let the users enter a value to the application.
 */
class ReadLineAdapter {
  #rl
  
  constructor() {
    this.#createInterface()
  }

  #createInterface() {
    this.#rl = readline.createInterface({ input, output})
  }

  /**
   * Asks the user for input.
   * 
   * @returns {string} - The user input from the console.
   */
  async getUserInput(message: string) {
    if (!this.#rl) {
      this.#createInterface()
    }

    const answer = await this.#rl.question(message)

    return answer
  }

  /**
   * Closes the readline.
   */
  exitGame() {
    this.#rl.close()
  }
}

export { ReadLineAdapter }