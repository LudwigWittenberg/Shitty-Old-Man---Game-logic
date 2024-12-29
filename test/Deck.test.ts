import { Deck } from '../src/model/Deck'
import { PlayingCard } from '../src/model/PlayingCard'

jest.mock('')

describe('Create all cards ia a deck', () => {
  let sut: Deck

  beforeEach(() => {
    sut = new Deck()
  })

  test('Validate the deck have 52 cards', () => {
    expect(sut.cardsLeft).toEqual(52)
  })

  test('Validate the deck contains all unique cards', () => {
    const cards: PlayingCard[] = []
  
    for (let i = 0; i < 52; i++) {
      const card = sut.dealCard()
      card.show(true)
      cards.push(card)
    }
  
    const actual = [...new Set(cards)]
    expect(actual.length).toBe(52)
  })
})

describe('Deal out cards', () => {
  let sut: Deck

  beforeEach(() => {
    sut = new Deck()
  })

  test('The cards in the deck reduces', () => {
    sut.dealCard()
    sut.dealCard()
    sut.dealCard()
    
    expect(sut.cardsLeft).toEqual(49)
  })

  test('Should throw when no cards are left', () => {
    for (let i:number = 0; i < 52; i++) {
      sut.dealCard()
    }

    expect(() => sut.dealCard()).toThrow()
  })
})

describe('Should add discardPile to the new Deck', () => {
  let sut: Deck

  beforeEach(() => {
    sut = new Deck()
  })

  test('Should add cards to the deck', () => {
    const spy = jest.spyOn(sut, 'shuffle')

    let discardPile = [] as PlayingCard []
    
    for (let i:number = 0; i < 52; i++) {
      discardPile.push(sut.dealCard())
    }

    expect(sut.cardsLeft).toBe(0)

    for (const card of discardPile) {
      sut.add(card)
    }

    sut.shuffle()
    discardPile = []

    expect(spy).toHaveBeenCalled()
    expect(sut.shuffle).toHaveBeenCalled()

    sut.dealCard()
    sut.dealCard()
    sut.dealCard()

    expect(sut.cardsLeft).toBe(49)
  })
})

describe('Deck.shuffle', () => {
  let sut: Deck

  beforeEach(() => {
    sut = new Deck() // Create a new deck before each test
  })

  test('should not change the number of cards in the deck', () => {
    const initialCount = sut.cardsLeft
    sut.shuffle()
    expect(sut.cardsLeft).toBe(initialCount)
  })

  test('should contain all original cards after shuffling', () => {
    const originalCards = Array.from({ length: sut.cardsLeft }, (_, i) => sut.dealCard())
    originalCards.forEach(card => sut.add(card)) // Add them back to shuffle
    sut.shuffle()

    const shuffledCards = Array.from({ length: sut.cardsLeft }, (_, i) => sut.dealCard())
    shuffledCards.forEach(card => sut.add(card)) // Add them back

    expect(new Set(shuffledCards)).toEqual(new Set(originalCards))
  })

  test('should change the order of cards in the deck', () => {
    const originalOrder = Array.from({ length: sut.cardsLeft }, (_, i) => sut.dealCard())
    originalOrder.forEach(card => sut.add(card)) // Add them back to shuffle
    sut.shuffle()

    const shuffledOrder = Array.from({ length: sut.cardsLeft }, (_, i) => sut.dealCard())
    shuffledOrder.forEach(card => sut.add(card)) // Add them back

    const hasChanged = shuffledOrder.some((card, index) => card !== originalOrder[index])
    expect(hasChanged).toBe(true)
  })

  test('should handle an empty deck without errors', () => {
    const emptyDeck = new Deck()
    while (emptyDeck.cardsLeft > 0) {
        emptyDeck.dealCard()
    }
    expect(() => emptyDeck.shuffle()).not.toThrow()
    expect(emptyDeck.cardsLeft).toBe(0)
  })
})
