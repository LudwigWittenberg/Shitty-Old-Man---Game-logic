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
        [false, false, false],
      ]

      player.setStartTableSettings(settings)
    }
  })

  test('should return Player2 is winner. Player1 have crads left in hand', () => {
    addCardToHand(RANKS.ACE, SUITS.CLUBS, player1)

    const actualWinner = sut.checkWinner(player2)

    expect(actualWinner).toStrictEqual(player2)
  })

  test('should return Player1 is winner. Player2 have cards left on deck', () => {
    addCardToHand(RANKS.ACE, SUITS.CLUBS, player2)

    const actualWinner = sut.checkWinner(player1)

    expect(actualWinner).toStrictEqual(player1)
  })

  test('should only return the winner else undefiend', () => {
    addCardToHand(RANKS.ACE, SUITS.CLUBS, player1)
    addCardToHand(RANKS.ACE, SUITS.DIAMONDS, player2)

    const actualWinner = sut.checkWinner(player1)

    expect(actualWinner).toBeUndefined()
  })

  test('Player1 have table cards left', () => {
    for (let i = 0; i < 5; i++) {
      addCardToTable(RANKS.FIVE, SUITS.CLUBS, player1)
    }

    addCardToHand(RANKS.ACE, SUITS.DIAMONDS, player2)

    const actualWinner = sut.checkWinner(player1)

    expect(actualWinner).toBeUndefined()
  })
})

function addCardToTable(rank, suit, player) {
  const tableCard = new PlayingCard(rank, suit)
  tableCard.show(true)
  player.addTableCard(tableCard)
}

function addCardToHand(rank, suit, player) {
  const handCard = new PlayingCard(rank, suit)
  handCard.show(true)
  player.addToHand(handCard)
}
