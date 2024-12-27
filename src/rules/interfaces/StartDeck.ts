import { Deck } from '../../Deck.js'
import { Player } from '../../Player.js'

interface StartDeck {
  /**
   * Deals out the start cards for each new round.
   * 
   * @param {Deck} deck - The deck that have all cards 
   * @param {Player} players - All players that want to play. 
   */
  dealStartDeck(deck: Deck, players: Player[])
}

export { StartDeck }