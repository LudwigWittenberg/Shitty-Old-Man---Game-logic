import { RANKS } from '../src/model/enums/playingcard/RANKS'
import { SUITS } from '../src/model/enums/playingcard/SUITS'
import { PlayingCard } from '../src/model/PlayingCard'
import { getValueByName, VALUES } from '../src/model/enums/playingcard/VALUES'
import { HIDDEN } from '../src/model/enums/playingcard/HIDDEN'

describe('Create all correct instances of the playing card.', () => {
  let cards: PlayingCard[]

  beforeEach(() => {
    cards = [] as PlayingCard[]
  })

  const setup = (suit) => {
    for (const rank of Object.values(RANKS)) {
      const sut = new PlayingCard(rank, suit)
      sut.show(true)
      cards.push(sut)
    }

    const expectedRanks = [] as PlayingCard[]

    for (const rank of Object.values(RANKS)) {
      const card = new PlayingCard(rank, suit)
      card.show(true)
      expectedRanks.push(card)
    }

    expect(cards).toEqual(expectedRanks)
    for (const card of cards) {
      expect(card.suit).toEqual(suit)
    }
    expect(cards.every(card => card.rank)).toBe(true)
    expect(cards.length).toBe(13)
  }

  test('Create all Hearts cards', () => {
    setup(SUITS.HEARTS)
  })

  test('Create all DIAMONDS cards', () => {
    setup(SUITS.DIAMONDS)
  })

  test('Create all SPADES cards', () => {
    setup(SUITS.SPADES)
  })

  test('Create all CLUBS cards', () => {
    setup(SUITS.CLUBS)
  })
})

describe('Expect all cards to have correct values', () => {
  let cards: PlayingCard[]

  beforeEach(() => {
    cards = []
  })

  const setup = (suit) => {
    for (const rank of Object.values(RANKS)) {
      const card = new PlayingCard(rank, suit)
      card.show(true)
      cards.push(card)
    }

    for(let i:number = 0; i < cards.length; i++) {
      const card = cards[i]
      card.show(true)
      const expectedValue = getValueByName(card.rank!)
      expect(card.valueOf()).toEqual(expectedValue)
    }
  }

  test('Check all correct values of each rank', () => {
    setup(SUITS.HEARTS)
  })

  test('Check all correct values of each rank', () => {
    setup(SUITS.DIAMONDS)
  })

  test('Check all correct values of each rank', () => {
    setup(SUITS.SPADES)
  })

  test('Check all correct values of each rank', () => {
    setup(SUITS.CLUBS)
  })
})

describe('PlayingCard Class', () => {
  let card: PlayingCard

  beforeEach(() => {
    card = new PlayingCard(RANKS.ACE, SUITS.HEARTS)
  })

  test('should create a card with the correct rank and suit', () => {
    expect(card.rank).toEqual(HIDDEN.HIDDEN) // Initially hidden
    expect(card.suit).toEqual(HIDDEN.HIDDEN)// Initially hidden
    card.show(true)
    expect(card.rank).toBe(RANKS.ACE)
    expect(card.suit).toBe(SUITS.HEARTS)
  })

  test('should set the correct value for the card', () => {
    card.show(true)
    expect(card.valueOf()).toBe(getValueByName(RANKS.ACE))
  })

  test('should hide and show the card correctly', () => {
    expect(card.rank).toEqual(HIDDEN.HIDDEN)
    expect(card.suit).toEqual(HIDDEN.HIDDEN)
    expect(card.valueOf()).toEqual(HIDDEN.HIDDEN)

    card.show(true)
    expect(card.rank).toBe(RANKS.ACE)
    expect(card.suit).toBe(SUITS.HEARTS)
    expect(card.valueOf()).toBe(getValueByName(RANKS.ACE))

    card.show(false)
    expect(card.rank).toEqual(HIDDEN.HIDDEN)
    expect(card.suit).toEqual(HIDDEN.HIDDEN)
    expect(card.valueOf()).toEqual(HIDDEN.HIDDEN)
  })

  test('should create all cards for a suit correctly', () => {
    const cards: PlayingCard[] = []
    for (const rank of Object.values(RANKS)) {
      const card = new PlayingCard(rank, SUITS.HEARTS)
      card.show(true)
      cards.push(card)
    }

    expect(cards.length).toBe(13);
    for (const card of cards) {
      expect(card.suit).toBe(SUITS.HEARTS)
      expect(card.valueOf()).toBe(getValueByName(card.rank!))
    }
  })
})
