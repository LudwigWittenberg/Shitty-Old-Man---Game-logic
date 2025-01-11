import { MOVE } from '../../enums/Rules/MOVE.js'
import { Player } from '../../Player.js'
import { PlayingCard } from '../../PlayingCard.js'

interface Rules {
  /**
   * Will determinate what the move is, and what do to with it.
   *
   * @param {PlayingCard} activePile - Tha active pile with cards.
   * @param {PlayingCard} cardToPlay - The cards to be played.
   */
  rules(
    activePile: PlayingCard[],
    cardToPlay: PlayingCard[],
    player: Player
  ): MOVE
}

export { Rules }
