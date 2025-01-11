import { Player } from '../src/model/Player'
import { Deck } from '../src/model/Deck'
import { PlayingCard } from '../src/model/PlayingCard'
import { RANKS } from '../src/model/enums/playingcard/RANKS'
import { SUITS } from '../src/model/enums/playingcard/SUITS'
import { ListenNewCard } from '../src/model/Observers/ListenNewCard'

describe('Player under Tets', () => {
  let sut: Player
  let deck: Deck

  beforeEach(() => {
    sut = new Player('Player')
    deck = new Deck()
  })

  describe('Test Player name', () => {
    test('New Player Correct Name', () => {
      const player = new Player('Player One')
      const actual = player.name
      const expected = 'Player One'

      expect(actual).toBe(expected)
    })

    test('New Player Not A Valid Name. To Throw', () => {
      expect(() => {
        new Player('Player@1')
      }).toThrow()
    })

    test('New Player Valid Name. Not To Throw', () => {
      expect(() => {
        new Player('Player 1')
      }).not.toThrow()
    })
  })

  describe('addToHand under test', () => {
    beforeEach(() => {
      const settings = [
        [false, false, false],
        [false, false, false],
      ]

      sut.setStartTableSettings(settings)

      addTableCards(sut, deck)
    })

    test('Should be able to add cards to the player hand', () => {
      sut.addToHand(deck.dealCard())
      sut.addToHand(deck.dealCard())
      sut.addToHand(deck.dealCard())

      const actual = sut.getHand()

      expect(actual.length).toBe(3)
    })

    test('Should remove card form hand', () => {
      const c1 = new PlayingCard(RANKS.TWO, SUITS.HEARTS)
      c1.show(true)
      const c2 = new PlayingCard(RANKS.THREE, SUITS.HEARTS)
      c2.show(true)
      const c3 = new PlayingCard(RANKS.KING, SUITS.HEARTS)
      c3.show(true)

      sut.addToHand(c1)
      sut.addToHand(c2)
      sut.addToHand(c3)

      const hand = sut.getHand()

      const card = hand[2]

      sut.playCard(card)

      const actual = sut.getHand()

      expect(actual.length).toBe(2)
      expect(actual.some((c) => c.rank === c1.rank && c.suit === c1.suit)).toBe(
        true
      )
      expect(actual.some((c) => c.rank === c2.rank && c.suit === c2.suit)).toBe(
        true
      )
      expect(actual.some((c) => c.rank === c3.rank && c.suit === c3.suit)).toBe(
        false
      )
    })

    test('should trow if the card is not found', () => {
      const card = new PlayingCard(RANKS.TEN, SUITS.HEARTS)
      card.show(true)
      sut.addToHand(card)

      const cardToRemove = new PlayingCard(RANKS.FIVE, SUITS.CLUBS)

      expect(() => {
        sut.playCard(cardToRemove)
      }).toThrow()
    })
  })

  describe('Tablecards under test initialize', () => {
    test('Set the table settings One Layer', () => {
      const settings = [
        [false, false, false],
        [false, false, false],
      ]

      sut.setStartTableSettings(settings)
      const actual = sut.getTableSettings()

      expect(actual).toEqual(settings)
    })

    test('When no cards is left in the hand the last layer will be set to true.', () => {
      const settings = [
        [false, false, false],
        [false, false, false],
      ]

      sut.setStartTableSettings(settings)

      addTableCards(sut, deck)

      sut.addToHand(new PlayingCard(RANKS.QUEEN, SUITS.HEARTS))

      const hand = sut.getHand()

      sut.playCard(hand[0])

      const actual = sut.getTableSettings()

      const expected = [
        [false, false, false],
        [true, true, true],
      ]

      expect(actual).toEqual(expected)
    })

    test('Should not remove an unavilbe card', () => {
      const settings = [
        [false, false, false],
        [false, false, false],
      ]

      sut.setStartTableSettings(settings)

      addTableCards(sut, deck)

      const tableCards = sut.getTableCards()

      sut.playCard(tableCards[0][0])

      expect(tableCards[0][0]).toBeInstanceOf(PlayingCard)

      let actual = 0
      for (const layer of tableCards) {
        for (const card of layer) {
          expect(card).toBeInstanceOf(PlayingCard)
          actual++
        }
      }

      expect(actual).toBe(6)
    })

    test('When no cards is left in layer one the bottom layer will be set to true.', () => {
      const settings = [
        [false, false, false],
        [true, true, true],
      ]

      sut.setStartTableSettings(settings)

      addTableCards(sut, deck)

      const tableCards = sut.getTableCards()
      sut.playCard(tableCards[1][0])
      sut.playCard(tableCards[1][1])
      sut.playCard(tableCards[1][2])
      const actual = sut.getTableSettings()

      const expected = [
        [true, true, true],
        [true, true, true],
      ]

      expect(actual).toEqual(expected)
    })

    test('Should set table card unavilbe when cards get picked up to hand', () => {
      const settings = [
        [false, false, false],
        [false, false, false],
      ]

      sut.setStartTableSettings(settings)

      addTableCards(sut, deck)

      const card = deck.dealCard()
      card.show(true)

      sut.addToHand(card)

      sut.playCard(card)

      const actualOne = sut.getTableSettings()

      const expectedOne = [
        [false, false, false],
        [true, true, true],
      ]

      expect(actualOne).toEqual(expectedOne)

      const card2 = deck.dealCard()
      card2.show(true)

      sut.addToHand(card2)

      const actual = sut.getTableSettings()

      const expected = [
        [false, false, false],
        [false, false, false],
      ]

      expect(actual).toEqual(expected)
    })
  })

  describe('Player table cards under test'.replace, () => {
    beforeEach(() => {
      const settings = [
        [false, false, false],
        [false, false, false],
      ]

      sut.setStartTableSettings(settings)
    })

    test('Should add cards the table (player)', () => {
      addTableCards(sut, deck)

      const tableCards = sut.getTableCards()

      let actual = 0

      for (const layer of tableCards) {
        for (const card of layer) {
          expect(card).toBeInstanceOf(PlayingCard)
          actual++
        }
      }

      expect(actual).toBe(6)
    })
  })

  describe('Test to add observs', () => {
    let spy

    beforeEach(() => {
      const settings = [
        [false, false, false],
        [false, false, false],
      ]

      sut.setStartTableSettings(settings)

      addTableCards(sut, deck)

      const stub = new ViewStub()

      spy = jest.spyOn(stub, 'update')

      sut.addObserver(stub)
    })

    test('Add Observer', () => {
      const stub2 = new ViewStub()

      sut.addObserver(stub2)

      expect(sut.subscribers.length).toBe(2)
    })

    test('Remove Observer', () => {
      const stub2 = new ViewStub()

      sut.addObserver(stub2)

      sut.removeObserver(stub2)

      expect(sut.subscribers.length).toBe(1)
    })

    test('notify all observs Observer', () => {
      const stub2 = new ViewStub()

      const spyStub2 = jest.spyOn(stub2, 'update')

      sut.addObserver(stub2)

      const card = new PlayingCard(RANKS.TEN, SUITS.DIAMONDS)
      card.show(true)
      sut.addToHand(card)

      expect(spy).toHaveBeenCalled()
      expect(spyStub2).toHaveBeenCalled()

      expect(stub2.update).toHaveBeenCalled()
    })
  })
})

class ViewStub implements ListenNewCard {
  update(player, card) {
    return {
      player,
      card,
    }
  }
}

function addTableCards(sut, deck) {
  sut.addTableCard(deck.dealCard())
  sut.addTableCard(deck.dealCard())
  sut.addTableCard(deck.dealCard())
  sut.addTableCard(deck.dealCard())
  sut.addTableCard(deck.dealCard())
  sut.addTableCard(deck.dealCard())
}
