import { Player } from '../../Player.js'

interface DeterminateWinner {
  /**
   * Will determinate who the winner is.
   * 
   * @param {Player} players - All players in the game.
   */
  checkWinner(players: Player): Player
}

export { DeterminateWinner }