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

      for (const c of hand) {
        console.log(c.rank, c.suit)
      }

      const card = hand[0]

      sut.removeFromHand(card)

      const actual = sut.getHand()

      for (const c of actual) {
        console.log(c.rank, c.suit)
      }

      expect(actual.length).toBe(2)
      expect(actual.some(c => c.rank === c1.rank && c.suit === c1.suit)).toBe(false);
      expect(actual.some(c => c.rank === c2.rank && c.suit === c2.suit)).toBe(true);
      expect(actual.some(c => c.rank === c3.rank && c.suit === c3.suit)).toBe(true);
    })
  })

  describe('Table Cards Management', () => {
    test('should add a card to the first available spot on the table', () => {
      const card1 = new PlayingCard(RANKS.ACE, SUITS.HEARTS)
      const card2 = new PlayingCard(RANKS.KING, SUITS.CLUBS)

      sut.addTableCards(card1)
      sut.addTableCards(card2)

      const tableCards = sut.getTableCards()

      expect(tableCards[0][0]).toEqual(card1)
      expect(tableCards[0][1]).toEqual(card2)
    })

    test('should not add a card if the table is full', () => {
      const cards = [
          new PlayingCard(RANKS.ACE, SUITS.HEARTS),
          new PlayingCard(RANKS.KING, SUITS.SPADES),
          new PlayingCard(RANKS.QUEEN, SUITS.DIAMONDS),
          new PlayingCard(RANKS.KNIGHT, SUITS.CLUBS),
          new PlayingCard(RANKS.TEN, SUITS.HEARTS),
          new PlayingCard(RANKS.NINE, SUITS.SPADES),
      ];

      cards.forEach(card => sut.addTableCards(card)) // Fill the table

      const newCard = new PlayingCard(RANKS.EIGHT, SUITS.DIAMONDS)
      sut.addTableCards(newCard)

      const tableCards = sut.getTableCards()

      expect(tableCards.flat().includes(newCard)).toBe(false) // Ensure new card was not added
    })

    test('should remove a card from the table if available and from the hand if matched', () => {
      const card1 = new PlayingCard(RANKS.ACE, SUITS.HEARTS)
      const card2 = new PlayingCard(RANKS.KING, SUITS.CLUBS)

      sut.addTableCards(card1)
      sut.addTableCards(card2)

      sut.removeTableCard(card1)

      const tableCards = sut.getTableCards()
      expect(tableCards[0][0]).toBeNull() // Card removed from table
    })

    test('should not remove a card if it is not available', () => {
      const card1 = new PlayingCard(RANKS.ACE, SUITS.HEARTS)
      const card2 = new PlayingCard(RANKS.KING, SUITS.CLUBS)

      sut.addTableCards(card1)
      sut.addTableCards(card2)

      const unavailableCard = new PlayingCard(RANKS.QUEEN, SUITS.DIAMONDS)
      sut.removeTableCard(unavailableCard)

      const tableCards = sut.getTableCards()
      expect(tableCards[0][0]).toEqual(card1)
      expect(tableCards[0][1]).toEqual(card2)
    })

    test('should return the current table cards', () => {
      const card1 = new PlayingCard(RANKS.ACE, SUITS.HEARTS)
      const card2 = new PlayingCard(RANKS.KING, SUITS.CLUBS)

        sut.addTableCards(card1)
        sut.addTableCards(card2)

        const tableCards = sut.getTableCards()
        expect(tableCards[0][0]).toEqual(card1)
        expect(tableCards[0][1]).toEqual(card2)
        expect(tableCards[0][2]).toBeNull() // Empty slot
    })
  })
})
