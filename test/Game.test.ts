import { HIDDEN } from '../src/model/enums/playingcard/HIDDEN'
import { Game } from '../src/model/Game'
import { Player } from '../src/model/Player'

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

  describe('Add Players to Game', () => {
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

      test('Each Player gets 6 cards on the table.', () => {
        sut.startGame()

        const players = sut.getPlayers()

        for (const player of players) {
          const cardOnHand = player.getHand().length

          expect(cardOnHand).toBe(3)
        }
      })
    })
  })
})