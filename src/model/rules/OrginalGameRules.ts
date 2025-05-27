import { RANKS } from '../enums/playingcard/RANKS.js'
import { MOVE } from '../enums/Rules/MOVE.js'
import { Player } from '../Player.js'
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
  rules(
    activePile: PlayingCard[],
    cardsToPlay: PlayingCard[],
    player: Player
  ): MOVE {
    // this.#changeAllToVisible(cardsToPlay)

    // Look if the last card of the player is a not valid move.
    if (this.#isLastCard(player, cardsToPlay)) {
      for (const card of cardsToPlay) {
        if (this.#isAce(card) || this.#isTwo(card) || this.#isTEN(card)) {
          return MOVE.NOT_VALID
        }
      }
    }

    const lastCard = this.#findLastCard(activePile)

    if (!this.#isAllCardsSame(cardsToPlay)) {
      return MOVE.NOT_VALID
    }

    if (this.#fourCardsToTurn(cardsToPlay, lastCard)) {
      return MOVE.TURNS
    }

    if (this.#sameCard(cardsToPlay, activePile)) {
      return MOVE.TURNS
    }

    for (const card of cardsToPlay) {
      if (this.#isTEN(card)) {
        return MOVE.TURNS
      }

      if (this.#isTwo(card)) {
        return MOVE.VALID
      }

      if (this.#isValidMove(lastCard, card)) {
        return MOVE.VALID
      }

      return MOVE.PICK_UP
    }
  }

  #changeAllToVisible(cardsToPlay: PlayingCard[]) {
    for (const card of cardsToPlay) {
      card.show(true)
    }
  }

  #isLastCard(player: Player, cardsToPlay: PlayingCard[]) {
    let amountOfCards: number = 0

    const playerHand = player.getHand()
    const tableCards = player.getTableCards()

    for (const card of playerHand) {
      if (!this.#isNull(card)) {
        amountOfCards++
      }
    }

    for (const layer of tableCards) {
      for (const card of layer) {
        if (!this.#isNull(card)) {
          amountOfCards++
        }
      }
    }

    return amountOfCards === cardsToPlay.length
  }

  #isAllCardsSame(cardsToPlay: PlayingCard[]) {
    const cardOneRank = cardsToPlay[0].rank

    const result = cardsToPlay.every((card) => card.rank === cardOneRank)

    return result
  }

  #sameCard(cardsToPlay: PlayingCard[], activePile: PlayingCard[]) {
    const lastCard = this.#findLastCard(activePile)
    const firstCardToBePlayed = cardsToPlay[0]

    if (this.#isSameCard(lastCard, firstCardToBePlayed)) {
      const seccondCard = this.#secondLastCard(activePile)
      const thiredCard = this.#thiredLastCard(activePile)

      // Turns if we place 3 FOURS on 1 FOUR
      if (this.#isAmountOfCardsPlaced(cardsToPlay, 3) && this.#isAllCardsSame(cardsToPlay)) {
        return true
      }

      // Turns if we place 2 FOURS on 2 FOURS
      if (
        this.#isAllCardsSame(cardsToPlay) &&
        this.#isSameCard(seccondCard, firstCardToBePlayed) &&
        this.#isAmountOfCardsPlaced(cardsToPlay, 2)
      ) {
        return true
      }

      // Turns if we place 1 Four on 3 Fours
      if (
        this.#isSameCard(seccondCard, firstCardToBePlayed) &&
        this.#isSameCard(thiredCard, firstCardToBePlayed) &&
        this.#isAmountOfCardsPlaced(cardsToPlay, 1)
      ) {
        return true
      }
    }

    return false
  }

  #isAmountOfCardsPlaced(cardsToPlay: PlayingCard[], amount: number) {
    return cardsToPlay.length === amount
  }

  #isSameCard(cardToCheck: PlayingCard, card: PlayingCard) {
    if (this.#isNull(cardToCheck)) {
      return false
    }

    return cardToCheck.rank === card.rank
  }

  #secondLastCard(activePile: PlayingCard[]) {
    return this.#findCard(activePile, 2)
  }

  #thiredLastCard(activePile: PlayingCard[]) {
    return this.#findCard(activePile, 3)
  }

  #findCard(activePile: PlayingCard[], place: number) {
    const arrayLength = activePile.length - place

    const card = activePile[arrayLength]

    if (!card) {
      return null
    } else {
      return card
    }
  }

  #findLastCard(activePile: PlayingCard[]) {
    if (this.#isEmpty(activePile)) {
      return null
    }

    const arrayLength = activePile.length - 1

    return activePile[arrayLength]
  }

  #isEmpty(activePile: PlayingCard[]) {
    const EMPTY = 0

    return activePile.length === EMPTY
  }

  #fourCardsToTurn(cardsToPlay: PlayingCard[], lastCard: PlayingCard) {
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

  #isValidMove(lastCard: PlayingCard, card: PlayingCard): boolean {
    if (this.#isNull(lastCard)) {
      return true // If there is no last card, any move is valid.
    }

    if (card.rank === RANKS.ACE) {
      const aceValue = this.#changeAceValue(card)
      return Number(lastCard.valueOf()) <= aceValue
    }

    if (lastCard.rank === RANKS.ACE) {
      const aceValue = this.#changeAceValue(lastCard)
      return aceValue <= Number(card.valueOf())
    }

    return lastCard.valueOf() <= card.valueOf()
  }

  #changeAceValue(card: PlayingCard) {
    return Number(card.valueOf()) + 13
  }

  #isNull(card: PlayingCard): boolean {
    return card === null
  }

  #isTwo(card) {
    return card.rank === RANKS.TWO
  }

  #isAce(card) {
    return card.rank === RANKS.ACE
  }

  #isTEN(cardToPlay: PlayingCard) {
    return cardToPlay.rank === RANKS.TEN
  }

  #isFourCards(cardsToPlay: PlayingCard[]) {
    return cardsToPlay.length === 4
  }
}

export { OrginalGameRules }
