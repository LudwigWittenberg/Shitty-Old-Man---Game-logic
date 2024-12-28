import { RANKS } from '../enums/playingcard/RANKS.js'
import { SUITS } from '../enums/playingcard/SUITS.js'
import { MOVE } from '../enums/Rules/MOVE.js'
import { PlayingCard } from '../PlayingCard.js'
import { Rules } from './interfaces/Rules.js'

/**
 * The original game rules for the swedish game called Skit gubbe.
 */
class OrginalGameRules implements Rules {
  /**
   * Will determinate what the move is, and what do to with it.
   * 
   * @param {PlayingCard} activePile - Tha active pile with cards.
   * @param {PlayingCard} cardToPlay - The cards to be played.
   */
  rules(activePile: PlayingCard[], cardsToPlay: PlayingCard[]): MOVE {
    const lastCard = this.#findLastCard(activePile)

    if (!this.#isAllCardsSame(cardsToPlay)) {
      return MOVE.NOT_VALID
    }

    if (this.#fourCardsToTurn(cardsToPlay, lastCard)) {
      return MOVE.TURNS
    }

    for (const card of cardsToPlay) {
      if(this.#isTEN(card)) {
        return MOVE.TURNS
      }
  
      if (this.#isValidMove(lastCard, card)) {
        return MOVE.VALID
      }
  
      return MOVE.PICK_UP
    }
  }

  #isAllCardsSame(cardsToPlay: PlayingCard[]) {
    const cardOneRank = cardsToPlay[0].rank
    
    const result = cardsToPlay.every(card => card.rank === cardOneRank)

    return result
  }

  #findLastCard(activePile: PlayingCard[]) {
    const arrayLength = activePile.length - 1

    return activePile[arrayLength]
  }

  #fourCardsToTurn (cardsToPlay: PlayingCard[], lastCard: PlayingCard) {
    if (this.#isFourCards(cardsToPlay) && this.#isAllCardsSame(cardsToPlay)) {
      let action = false

      for (const card of cardsToPlay) {
        const valid = this.#isValidMove(lastCard, card)

        if (valid) {
          action = true
        } else {
          action = false
          break
        }
      }

      return action
    }
  }

  #isValidMove(lastCard: PlayingCard, card: PlayingCard) {
    return lastCard.valueOf() <= card.valueOf()
  }

  #isTEN(cardToPlay: PlayingCard) {
    return cardToPlay.rank === RANKS.TEN
  }

  #isFourCards(cardsToPlay: PlayingCard[]) {
    return cardsToPlay.length === 4
  }
}

export { OrginalGameRules }