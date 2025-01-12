import { HIDDEN } from '../src/model/enums/playingcard/HIDDEN'
import { RANKS } from '../src/model/enums/playingcard/RANKS'
import { SUITS } from '../src/model/enums/playingcard/SUITS'
import { MOVE } from '../src/model/enums/Rules/MOVE'
import { Game } from '../src/model/Game'
import { Player } from '../src/model/Player'
import { PlayingCard } from '../src/model/PlayingCard'

describe('Game under test', () => {
  let sut: Game

  beforeEach(() => {
    sut = new Game()
  })

  describe('Players', () => {
    test('should add players', () => {
      sut.addPlayer('Ludde')
      sut.addPlayer('Hampus')

      const actual = sut.getPlayers()

      for (const player of actual) {
        expect(player).toBeInstanceOf(Player)
      }

      expect(actual.length).toBe(2)
    })

    test('should remove player', () => {
      sut.addPlayer('Ludde')
      sut.addPlayer('Hampus')

      const players = sut.getPlayers()

      sut.removePlayer(players[0])

      const actual = sut.getPlayers()

      expect(actual.length).toBe(1)
      expect(actual[0].name).toBe('Hampus')
    })
  })

  describe('playRound', () => {
    beforeEach(() => {
      sut.addPlayer('Ludde')
      sut.addPlayer('Hampus')
    })

    describe('Each Player should get the correct amount of start cards.', () => {
      test('Each Player gets 6 cards on the table.', () => {
        sut.startGame()

        const players = sut.getPlayers()

        for (const player of players) {
          const tableCards = player.getTableCards()

          let hiddenCards = 0
          let visibleCards = 0

          for (const layer of tableCards) {
            for (const card of layer) {
              if (card.rank !== HIDDEN.HIDDEN) {
                visibleCards++
              } else {
                hiddenCards++
              }
            }
          }

          expect(hiddenCards).toBe(3)
          expect(visibleCards).toBe(3)
          expect(hiddenCards + visibleCards).toBe(6)
        }
      })

      test('Each Player gets 3 cards on the hand.', () => {
        sut.startGame()

        const players = sut.getPlayers()

        for (const player of players) {
          const cardOnHand = player.getHand().length

          expect(cardOnHand).toBe(3)
        }
      })
    })

    describe('Validate that the deck have the correct amount of cards left', () => {
      test('cardsLeftInDeck should return the correct number of cards left in the deck', () => {
        const initialCardsLeft = sut.cardsLeftInDeck()
        expect(initialCardsLeft).toBe(52) // Assuming a standard deck of 52 cards

        // Draw a card from the deck
        sut.chanceFromDeck(sut.getCurrentPlayer())
        const cardsLeftAfterDraw = sut.cardsLeftInDeck()
        expect(cardsLeftAfterDraw).toBe(initialCardsLeft - 1)
      })
    })

    describe('Play rounds', () => {
      test('Player one makes a valid move', () => {
        const p = sut.getCurrentPlayer()

        const card = createCard(RANKS.FIVE, SUITS.DIAMONDS, p)

        createCard(RANKS.EIGHT, SUITS.HEARTS, p)

        const cardsToPlay = [card]

        const actual = sut.playRound(p, cardsToPlay)

        expect(actual).toEqual(MOVE.VALID)
      })

      test('Player one makes a not valid move', () => {
        const p = sut.getCurrentPlayer()

        const firstCard = createCard(RANKS.NINE, SUITS.DIAMONDS, p)

        const c = [firstCard]

        sut.playRound(p, c)

        createCard(RANKS.FIVE, SUITS.DIAMONDS, p)

        createCard(RANKS.EIGHT, SUITS.HEARTS, p)

        const cardsToPlay = p.getHand()

        const actual = sut.playRound(p, cardsToPlay)

        expect(actual).toEqual(MOVE.NOT_VALID)
      })

      test('Player one makes a Pick Up move', () => {
        const p = sut.getCurrentPlayer()

        const firstCard = createCard(RANKS.NINE, SUITS.DIAMONDS, p)

        const c = [firstCard]

        sut.playRound(p, c)

        const card = createCard(RANKS.FIVE, SUITS.DIAMONDS, p)

        const cardsToPlay = [card]

        const actual = sut.playRound(p, cardsToPlay)

        expect(actual).toEqual(MOVE.PICK_UP)
      })

      test('Player one makes a TURNS move', () => {
        const p = sut.getCurrentPlayer()

        const firstCard = createCard(RANKS.NINE, SUITS.DIAMONDS, p)

        const c = [firstCard]

        sut.playRound(p, c)

        const card = createCard(RANKS.TEN, SUITS.SPADES, p)

        createCard(RANKS.EIGHT, SUITS.HEARTS, p)

        const cardsToPlay = [card]

        const actual = sut.playRound(p, cardsToPlay)

        expect(actual).toEqual(MOVE.TURNS)
      })

      test('Player one makes a not valid move', () => {
        const p = sut.getCurrentPlayer()

        const card = createCard(RANKS.FIVE, SUITS.DIAMONDS, p)

        const card2 = createCard(RANKS.EIGHT, SUITS.DIAMONDS, p)

        const cardsToPlay = [card, card2]

        const actual = sut.getPlayerAllCards(p)

        expect(actual.hand.cards).toEqual(cardsToPlay)
      })

      test('change player turns', () => {
        const p1 = sut.getCurrentPlayer()

        const card = createCard(RANKS.FIVE, SUITS.DIAMONDS, p1)

        createCard(RANKS.FIVE, SUITS.DIAMONDS, p1)

        const cardToPlay = [card]

        const p1ValidMove = sut.playRound(p1, cardToPlay)

        expect(p1ValidMove).toEqual(MOVE.VALID)

        const p2 = sut.getCurrentPlayer()

        expect(p2.name).not.toBe(p1.name)

        const cardp2 = createCard(RANKS.THREE, SUITS.DIAMONDS, p2)

        createCard(RANKS.EIGHT, SUITS.DIAMONDS, p2)

        const cToPlay = [cardp2]

        const p2ValidMove = sut.playRound(p2, cToPlay)

        expect(p2ValidMove).toEqual(MOVE.PICK_UP)

        expect(sut.getCurrentPlayer()).toEqual(p1)
      })

      test('Player One winns the game', () => {
        const p1 = sut.getCurrentPlayer()

        const actual = sut.doWeHaveAWinner(p1)

        expect(actual).toEqual(p1)
      })

      test('Get the last card in the activePile', () => {
        const player = sut.getCurrentPlayer()

        const c = createCard(RANKS.QUEEN, SUITS.DIAMONDS, player)

        const cardToPlay = [c]

        sut.playRound(player, cardToPlay)

        const actual = sut.getLastCard()

        expect(actual).toEqual(c)
      })

      test('Should return null if the activePile is empty', () => {
        const actual = sut.getLastCard()

        expect(actual).toBeNull()
      })

      test('A player can chance from the deck if he wants to.', () => {
        const player = sut.getCurrentPlayer()

        const card = sut.chanceFromDeck(player)

        const cardsToPlay = [card]

        const actualMove = sut.playRound(player, cardsToPlay)

        expect([
          MOVE.NOT_VALID,
          MOVE.PICK_UP,
          MOVE.TURNS,
          MOVE.VALID,
        ]).toContain(actualMove)
      })
    })
  })
})

function createCard(rank, suit, player) {
  const card = new PlayingCard(rank, suit)
  card.show(true)

  player.addToHand(card)

  return card
}
