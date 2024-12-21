import { Player } from '../src/Player'
import { Deck } from '../src/Deck'
import { PlayingCard } from '../src/PlayingCard'
import { RANKS } from '../src/enums/playingcard/RANKS'
import { SUITS } from '../src/enums/playingcard/SUITS'
import { runMain } from 'module'

describe('Player under Tets', () => {
  let sut: Player
  let deck: Deck

  beforeEach(() => {
    sut = new Player('Player')
    deck = new Deck()
  })

  describe('Test Player name', () => {
    test('New Player Correct Name', () => {
      const player = new Player ('Player One')
      const actual = player.name
      const expected = 'Player One'
  
      expect(actual).toBe(expected)
    })
  
    test('New Player Not A Valid Name. To Throw', () => {
      expect(() => {
        new Player ('Player@1')
      }).toThrow()
    })
  
    test('New Player Valid Name. Not To Throw', () => {
      expect(() => {
        new Player ('Player 1')
      }).not.toThrow()
    })
  })

  describe('addToHand under test', () => {
    test('Should be able to add cards to the player hand', () => {
      sut.addToHand(deck.dealCard())
      sut.addToHand(deck.dealCard())
      sut.addToHand(deck.dealCard())

      const actual = sut.getHand()

      expect(actual.length).toBe(3)
    })

    test('Should remove card form hand', () => {
      const c1 = deck.dealCard()
      c1.show(true)
      const c2 = deck.dealCard()
      c2.show(true)
      const c3 = deck.dealCard()
      c3.show(true)
      
      sut.addToHand(c1)
      sut.addToHand(c2)
      sut.addToHand(c3)
      
      const hand = sut.getHand()

      const card = hand[0]

      sut.removeFromHand(card)

      const actual = sut.getHand()

      expect(actual.length).toBe(2)
      expect(actual.some(c => c.rank === c1.rank && c.suit === c1.suit)).toBe(false);
      expect(actual.some(c => c.rank === c2.rank && c.suit === c2.suit)).toBe(true);
      expect(actual.some(c => c.rank === c3.rank && c.suit === c3.suit)).toBe(true);
    })
  })

  describe('Tablecards under test initialize', () => {
   test('Set the table settings One Layer', () => {
      const settings = [
        [false, false, false],
        [false, false, false]
      ]

      sut.setStartTableSettings(settings)
      const actual = sut.getTableSettings()

      expect(actual).toEqual(settings)
    })

    test('When no cards is left in the hand the last layer will be set to true.', () => {
      const settings = [
        [false, false, false],
        [false, false, false]
      ]

      sut.setStartTableSettings(settings)

      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())

      sut.addToHand(new PlayingCard(RANKS.QUEEN, SUITS.HEARTS ))

      const hand = sut.getHand()

      sut.removeFromHand(hand[0])

      const actual = sut.getTableSettings()

      const expected = [
        [false, false, false],
        [true, true, true]
      ]

      expect(actual).toEqual(expected)
    })

    
    test('Should not remove an unavilbe card', () => {
      const settings = [
        [false, false, false],
        [false, false, false]
      ]

      sut.setStartTableSettings(settings)

      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())

      const tableCards = sut.getTableCards()
      
      sut.removeFromTable(tableCards[0][0])

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
        [true, true, true]
      ]

      sut.setStartTableSettings(settings)

      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())

      const tableCards = sut.getTableCards()
      sut.removeFromTable(tableCards[1][0])
      sut.removeFromTable(tableCards[1][1])
      sut.removeFromTable(tableCards[1][2])
      const actual = sut.getTableSettings()

      const expected = [
        [true, true, true],
        [true, true, true]
      ]

      expect(actual).toEqual(expected)
    })
  })

  describe('Player table cards under test'.replace, () => {
    beforeEach(() => {
      const settings = [
        [false, false, false],
        [false, false, false]
      ]

      sut.setStartTableSettings(settings)
    })

    test('Should add cards the table (player)', () => {
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
      sut.addTableCard(deck.dealCard())
  
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
})
