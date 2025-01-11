import { Deck } from '../../src/model/Deck'
import { HIDDEN } from '../../src/model/enums/playingcard/HIDDEN'
import { Player } from '../../src/model/Player'
import { PlayingCard } from '../../src/model/PlayingCard'
import { OneLayerDeck } from '../../src/model/rules/OneLayerDeck'

describe('OneLayerDeck under test', () => {
  let sut: OneLayerDeck

  beforeAll(() => {
    sut = new OneLayerDeck()
  })

  describe('Each Player should get the correct amount of cards', () => {
    let deck: Deck
    let player1: Player
    let player2: Player
    let players: Player[]

    beforeEach(() => {
      deck = new Deck()
      deck.shuffle()

      player1 = new Player('Player1')
      player2 = new Player('Player2')

      players = [player1, player2]

      for (const player of players) {
        const settings = [
          [false, false, false],
          [false, false, false],
        ]

        player.setStartTableSettings(settings)
      }
    })

    test('Each player get 6 cards on their table', () => {
      sut.dealStartDeck(deck, players)

      for (const player of players) {
        let actual = 0
        const tableCards = player.getTableCards()

        for (const layer of tableCards) {
          for (const card of layer) {
            actual++
            expect(card).toBeInstanceOf(PlayingCard)
          }
        }

        expect(actual).toBe(6)
      }
    })

    test('The last layer will be visible to the players', () => {
      sut.dealStartDeck(deck, players)

      for (const player of players) {
        let showCards = 0
        let hiddenCards = 0

        const tableCards = player.getTableCards()

        for (const layer of tableCards) {
          for (const card of layer) {
            if (card.rank !== HIDDEN.HIDDEN && card.suit !== HIDDEN.HIDDEN) {
              showCards++
              expect(card.rank).toBeDefined()
              expect(card.suit).toBeDefined()
              expect(card.valueOf()).toBeDefined()
            } else {
              hiddenCards++
              expect(card.rank).toEqual(HIDDEN.HIDDEN)
              expect(card.suit).toEqual(HIDDEN.HIDDEN)
              expect(card.valueOf()).toEqual(HIDDEN.HIDDEN)
            }
          }
        }
        expect(showCards).toBe(3)
        expect(hiddenCards).toBe(3)
      }
    })

    test('Each Player gets 3 visible cards to the player on hand.', () => {
      sut.dealStartDeck(deck, players)

      for (const player of players) {
        const actual = player.getHand()

        for (const card of actual) {
          expect(card).toBeInstanceOf(PlayingCard)
        }

        expect(actual.length).toBe(3)
      }
    })
  })
})
