import { GameWinner } from './GameWinner.js'
import { DeterminateWinner } from './interfaces/DeterminateWinner.js'
import { Rules } from './interfaces/Rules.js'
import { StartDeck } from './interfaces/StartDeck.js'
import { OneLayerDeck } from './OneLayerDeck.js'
import { OrginalGameRules } from './OrginalGameRules.js'

class RulesFactory {
  /**
   * Returns tha active start deck.
   * 
   * @returns The start deck to use.
   */
  getStartDeck(): StartDeck {
    return new OneLayerDeck()
  }

  /**
   * Returns the game rules to the game.
   * 
   * @returns GameRules.
   */
  getGameRules(): Rules {
    return new OrginalGameRules()
  }

  /**
   * Determitates how a player can win the game.
   * 
   * @returns The game winner rules.
   */
  getWinnerRules(): DeterminateWinner {
    return new GameWinner()
  }
}

export { RulesFactory }