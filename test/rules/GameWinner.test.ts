import { RANKS } from '../../src/model/enums/playingcard/RANKS'
import { SUITS } from '../../src/model/enums/playingcard/SUITS'
import { Player } from '../../src/model/Player'
import { PlayingCard } from '../../src/model/PlayingCard'
import { GameWinner } from '../../src/model/rules/GameWinner'

describe('GameWinner under Test', () => {
  let sut: GameWinner
  let player1: Player
  let player2: Player
  let players: Player[]

  beforeEach(() => {
    sut = new GameWinner()

    player1 = new Player('Player1')
    player2 = new Player('Player2')

    players = [player1, player2]

    for (const player of players) {
      const settings = [
        [false, false, false],
        [false, false, false]
      ]

      player.setStartTableSettings(settings)
    }
  })

  test('should return Player2 is winner. Player1 have crads left in hand', () => {
    player1.addToHand(new PlayingCard(RANKS.ACE, SUITS.CLUBS))

    const actualWinner = sut.checkWinner(players)

    expect(actualWinner).toStrictEqual(player2)
  })

  test('should return Player1 is winner. Player2 have cards left on deck', () => {
    player2.addTableCard(new PlayingCard(RANKS.ACE, SUITS.CLUBS))

    const actualWinner = sut.checkWinner(players)

    expect(actualWinner).toStrictEqual(player1)
  })

  test('should only return the winner else undefiend', () => {
    player1.addToHand(new PlayingCard(RANKS.ACE, SUITS.CLUBS))
    player2.addToHand(new PlayingCard(RANKS.ACE, SUITS.DIAMONDS))

    const actualWinner = sut.checkWinner(players)

    expect(actualWinner).toBeUndefined()
  })
})