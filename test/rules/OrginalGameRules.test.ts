import { OrginalGameRules } from '../../src/rules/OrginalGameRules'
import { Player } from '../../src/Player'
import { PlayingCard } from '../../src/PlayingCard'
import { RANKS } from '../../src/enums/playingcard/RANKS'
import { SUITS } from '../../src/enums/playingcard/SUITS'
import { MOVE } from '../../src/enums/Rules/MOVE'

describe('OrginalGameRules under test', () => {
  let sut: OrginalGameRules
  let player1: Player
  let player2: Player
  let players: Player[]

  beforeEach(() => {
    sut = new OrginalGameRules()

    player1 = new Player('player1')
    player2 = new Player('player2')

    players = [player1, player2]

    for (const player of players) {
      const settings = [
        [false, false, false],
        [false, false, false]
      ]

      player.setStartTableSettings(settings)
    }
  })

  describe('Test Valid Move', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      const card = new PlayingCard(RANKS.THREE, SUITS.CLUBS)
      card.show(true)
      activePile.push(card)
    })

    test('Can place a KNIGHT HEARTS over THREE CLUBS.', () => {
      const cardToPlace = new PlayingCard(RANKS.KNIGHT, SUITS.HEARTS)
      cardToPlace.show(true)
      const cards = [cardToPlace]
      const action = sut.rules(activePile, cards)

      expect(action).toEqual(MOVE.VALID)
    })

    test('Can place a THREE HEARTS over THREE CLUBS.', () => {
      const cardToPlace = new PlayingCard(RANKS.THREE, SUITS.HEARTS)
      cardToPlace.show(true)
      const cards = [cardToPlace]
      const action = sut.rules(activePile, cards)

      expect(action).toEqual(MOVE.VALID)
    })
  })

  describe('Test Not Valid Move', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      const card = new PlayingCard(RANKS.FIVE, SUITS.CLUBS)
      card.show(true)
      activePile.push(card)
    })

    test('Can not place a FOUR HEARTS over FIVE CLUBS.', () => {
      const cardToPlace = new PlayingCard(RANKS.FOUR, SUITS.HEARTS)
      cardToPlace.show(true)
      const cards = [cardToPlace]
      const action = sut.rules(activePile, cards)

      expect(action).toEqual(MOVE.PICK_UP)
    })
  })

  describe('Test Throw active Pile', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      const card = new PlayingCard(RANKS.QUEEN, SUITS.CLUBS)
      card.show(true)
      activePile.push(card)
    })

    test('Can place a TEN HEARTS over QUEEN CLUBS.', () => {
      const cardToPlace = new PlayingCard(RANKS.TEN, SUITS.HEARTS)
      cardToPlace.show(true)
      const cards = [cardToPlace]
      const action = sut.rules(activePile, cards)

      expect(action).toEqual(MOVE.TURNS)
    })
  })

  describe('Multiple cards', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      const card = new PlayingCard(RANKS.THREE, SUITS.CLUBS)
      card.show(true)
      activePile.push(card)
    })

    test('Should return NOT_VALID when all cards are not the same', () => {
      const cardToPlace = new PlayingCard(RANKS.FOUR, SUITS.HEARTS)
      cardToPlace.show(true)

      const cardToPlace2 = new PlayingCard(RANKS.FIVE, SUITS.DIAMONDS)
      cardToPlace2.show(true)

      const cards = [cardToPlace, cardToPlace2]
      const action = sut.rules(activePile, cards)

      expect(action).toEqual(MOVE.NOT_VALID)
    })

    test('Should return NOT_VALID when all cards are not the same', () => {
      const cardToPlace = new PlayingCard(RANKS.FOUR, SUITS.HEARTS)
      cardToPlace.show(true)

      const cardToPlace2 = new PlayingCard(RANKS.FOUR, SUITS.DIAMONDS)
      cardToPlace2.show(true)

      const cards = [cardToPlace, cardToPlace2]
      const action = sut.rules(activePile, cards)

      expect(action).toEqual(MOVE.VALID)
    })
  })

  describe('Turns the table with 4 cards of the same rank.', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      const card = new PlayingCard(RANKS.FOUR, SUITS.CLUBS)
      card.show(true)
      activePile.push(card)
    })

    test('Can turn the activepile with 4 EIGHTS', () => {
      const cardToPlace = new PlayingCard(RANKS.EIGHT, SUITS.HEARTS)
      cardToPlace.show(true)

      const cardToPlace2 = new PlayingCard(RANKS.EIGHT, SUITS.DIAMONDS)
      cardToPlace2.show(true)

      const cardToPlace3 = new PlayingCard(RANKS.EIGHT, SUITS.CLUBS)
      cardToPlace3.show(true)

      const cardToPlace4 = new PlayingCard(RANKS.EIGHT, SUITS.SPADES)
      cardToPlace4.show(true)

      const cards = [cardToPlace, cardToPlace2, cardToPlace3, cardToPlace4]
      const action = sut.rules(activePile, cards)

      expect(action).toEqual(MOVE.TURNS)
    })

    test('Can not turn the activepile with 4 THREE', () => {
      const cardToPlace = new PlayingCard(RANKS.THREE, SUITS.HEARTS)
      cardToPlace.show(true)

      const cardToPlace2 = new PlayingCard(RANKS.THREE, SUITS.DIAMONDS)
      cardToPlace2.show(true)

      const cardToPlace3 = new PlayingCard(RANKS.THREE, SUITS.CLUBS)
      cardToPlace3.show(true)

      const cardToPlace4 = new PlayingCard(RANKS.THREE, SUITS.SPADES)
      cardToPlace4.show(true)

      const cards = [cardToPlace, cardToPlace2, cardToPlace3, cardToPlace4]
      const action = sut.rules(activePile, cards)

      expect(action).toEqual(MOVE.PICK_UP)
    })
  })
})