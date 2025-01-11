import { OrginalGameRules } from '../../src/model/rules/OrginalGameRules'
import { Player } from '../../src/model/Player'
import { PlayingCard } from '../../src/model/PlayingCard'
import { RANKS } from '../../src/model/enums/playingcard/RANKS'
import { SUITS } from '../../src/model/enums/playingcard/SUITS'
import { MOVE } from '../../src/model/enums/Rules/MOVE'

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
        [false, false, false],
      ]

      player.setStartTableSettings(settings)
    }
  })

  describe('Test Valid Move', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      addToActivePile(RANKS.THREE, SUITS.HEARTS, activePile)
    })

    test('Can place a KNIGHT HEARTS over THREE CLUBS.', () => {
      addCardToHand(RANKS.KNIGHT, SUITS.DIAMONDS, player1)

      const cards = player1.getHand()

      const action = sut.rules(activePile, cards, player1)

      expect(action).toEqual(MOVE.VALID)
    })

    test('Can place a THREE HEARTS over THREE CLUBS.', () => {
      addCardToHand(RANKS.THREE, SUITS.DIAMONDS, player1)

      const cards = player1.getHand()

      const action = sut.rules(activePile, cards, player1)

      expect(action).toEqual(MOVE.VALID)
    })

    test('Can place Ace over King', () => {
      addCardToHand(RANKS.THREE, SUITS.DIAMONDS, player1)

      addCardToHand(RANKS.ACE, SUITS.DIAMONDS, player1)

      activePile = []
      addToActivePile(RANKS.KING, SUITS.HEARTS, activePile)

      const handCards = player1.getHand()

      const cards = [handCards[0]]

      const actual = sut.rules(activePile, cards, player1)

      expect(actual).toEqual(MOVE.VALID)
    })

    test('Players can place every card because the activePile is empty', () => {
      addCardToHand(RANKS.THREE, SUITS.DIAMONDS, player1)

      addCardToTable(RANKS.EIGHT, SUITS.HEARTS, player1)

      activePile = []

      const handCards = player1.getHand()

      const cards = [handCards[0]]

      const actual = sut.rules(activePile, cards, player1)

      expect(actual).toEqual(MOVE.VALID)
    })
  })

  describe('Test Not Valid Move', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      addToActivePile(RANKS.FIVE, SUITS.HEARTS, activePile)
    })

    test('Can not place a FOUR HEARTS over FIVE CLUBS.', () => {
      addCardToHand(RANKS.FOUR, SUITS.DIAMONDS, player1)

      const cards = player1.getHand()

      const action = sut.rules(activePile, cards, player1)

      expect(action).toEqual(MOVE.PICK_UP)
    })

    test('Should return NOT_VALID when all cards are not the same', () => {
      addCardToHand(RANKS.FOUR, SUITS.DIAMONDS, player1)
      addCardToHand(RANKS.FIVE, SUITS.DIAMONDS, player1)

      const cards = player1.getHand()
      const action = sut.rules(activePile, cards, player1)

      expect(action).toEqual(MOVE.NOT_VALID)
    })

    test('Player 2 places ONE five and turns the ActivePile when 3 Fives exist', () => {
      const fiveHearts = new PlayingCard(RANKS.FIVE, SUITS.HEARTS)
      fiveHearts.show(true)
      const fiveClubs = new PlayingCard(RANKS.FIVE, SUITS.CLUBS)
      fiveClubs.show(true)
      const fiveDiamond = new PlayingCard(RANKS.FIVE, SUITS.DIAMONDS)
      fiveDiamond.show(true)

      activePile = [fiveHearts, fiveClubs, fiveDiamond]

      addCardToHand(RANKS.FIVE, SUITS.SPADES, player2)

      const handCards = player2.getHand()

      const cardToPlay = [handCards[0]]

      const actual = sut.rules(activePile, cardToPlay, player2)

      expect(actual).toEqual(MOVE.TURNS)
    })
  })

  describe('Lower The activlePile With TWO', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      addToActivePile(RANKS.FIVE, SUITS.HEARTS, activePile)
    })

    test('Players places Can place a Two on a Five', () => {
      addCardToHand(RANKS.THREE, SUITS.DIAMONDS, player1)

      addCardToTable(RANKS.TWO, SUITS.HEARTS, player1)

      const card = player1.getTableCards()

      activePile = []
      addToActivePile(RANKS.FIVE, SUITS.HEARTS, activePile)

      const cards = [card[0][0]]

      const actual = sut.rules(activePile, cards, player1)

      expect(actual).toEqual(MOVE.VALID)
    })
  })

  describe('Test Throw active Pile', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      addToActivePile(RANKS.QUEEN, SUITS.HEARTS, activePile)
    })

    test('Can place a TEN over QUEEN.', () => {
      addCardToHand(RANKS.TEN, SUITS.DIAMONDS, player1)
      addCardToHand(RANKS.KNIGHT, SUITS.DIAMONDS, player1)

      const cards = player1.getHand()

      const cardToPlay = [cards[0]]

      const action = sut.rules(activePile, cardToPlay, player1)

      expect(action).toEqual(MOVE.TURNS)
    })
  })

  describe('Multiple cards to place', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      addToActivePile(RANKS.THREE, SUITS.HEARTS, activePile)
    })

    test('Should return VALID when all cards are the same', () => {
      addCardToHand(RANKS.FOUR, SUITS.DIAMONDS, player1)

      addCardToHand(RANKS.FOUR, SUITS.DIAMONDS, player1)

      const cards = player1.getHand()
      const action = sut.rules(activePile, cards, player1)

      expect(action).toEqual(MOVE.VALID)
    })
  })

  describe('PICK_UP the pile', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      addToActivePile(RANKS.ACE, SUITS.HEARTS, activePile)
    })

    test('Player Can not place a Five over Ace', () => {
      addCardToHand(RANKS.THREE, SUITS.DIAMONDS, player1)

      addCardToHand(RANKS.FIVE, SUITS.HEARTS, player1)

      const handCards = player1.getHand()

      const cards = [handCards[1]]

      const actual = sut.rules(activePile, cards, player1)

      expect(actual).toEqual(MOVE.PICK_UP)
    })
  })

  describe('Turns the table with 4 cards of the same rank.', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      addToActivePile(RANKS.FOUR, SUITS.HEARTS, activePile)
    })

    test('Can turn the activepile with 4 EIGHTS', () => {
      addCardToHand(RANKS.EIGHT, SUITS.DIAMONDS, player1)
      addCardToHand(RANKS.EIGHT, SUITS.HEARTS, player1)
      addCardToHand(RANKS.EIGHT, SUITS.CLUBS, player1)
      addCardToHand(RANKS.EIGHT, SUITS.SPADES, player1)

      const cards = player1.getHand()
      const action = sut.rules(activePile, cards, player1)

      expect(action).toEqual(MOVE.TURNS)
    })

    test('Can not turn the activepile with 4 THREE', () => {
      addCardToHand(RANKS.THREE, SUITS.DIAMONDS, player1)
      addCardToHand(RANKS.THREE, SUITS.HEARTS, player1)
      addCardToHand(RANKS.THREE, SUITS.CLUBS, player1)
      addCardToHand(RANKS.THREE, SUITS.SPADES, player1)

      const cards = player1.getHand()
      const action = sut.rules(activePile, cards, player1)

      expect(action).toEqual(MOVE.PICK_UP)
    })

    test('Places 3 Fours and turns the activePile', () => {
      addCardToHand(RANKS.FOUR, SUITS.DIAMONDS, player1)
      addCardToHand(RANKS.FOUR, SUITS.CLUBS, player1)
      addCardToHand(RANKS.FOUR, SUITS.SPADES, player1)

      const cards = player1.getHand()
      const action = sut.rules(activePile, cards, player1)

      expect(action).toEqual(MOVE.TURNS)
    })

    test('Places 2 Fours and turns the activePile', () => {
      addToActivePile(RANKS.FOUR, SUITS.DIAMONDS, activePile)

      addCardToHand(RANKS.FOUR, SUITS.CLUBS, player1)
      addCardToHand(RANKS.FOUR, SUITS.SPADES, player1)

      const cards = player1.getHand()
      const action = sut.rules(activePile, cards, player1)

      expect(action).toEqual(MOVE.TURNS)
    })

    test('Places 1 Fours and turns the activePile', () => {
      addToActivePile(RANKS.FOUR, SUITS.DIAMONDS, activePile)
      addToActivePile(RANKS.FOUR, SUITS.CLUBS, player1)
      
      addCardToHand(RANKS.FOUR, SUITS.SPADES, player1)

      const cards = player1.getHand()
      const action = sut.rules(activePile, cards, player1)

      expect(action).toEqual(MOVE.TURNS)
    })
  })

  describe('Last Card to place', () => {
    let activePile: PlayingCard[]

    beforeEach(() => {
      activePile = []

      addToActivePile(RANKS.FOUR, SUITS.HEARTS, activePile)
    })

    test('Players Dosent have ace, two or ten as last card', () => {
      addCardToTable(RANKS.FIVE, SUITS.HEARTS, player1)

      activePile = []
      addToActivePile(RANKS.THREE, SUITS.HEARTS, activePile)

      const card = player1.getTableCards()

      const cards = [card[0][0]]

      const actual = sut.rules(activePile, cards, player1)

      expect(actual).toEqual(MOVE.VALID)
    })

    test('Players Have have ACE as last card', () => {
      addCardToTable(RANKS.ACE, SUITS.HEARTS, player1)

      activePile = []
      addToActivePile(RANKS.THREE, SUITS.HEARTS, activePile)

      const card = player1.getTableCards()

      const cards = [card[0][0]]

      const actual = sut.rules(activePile, cards, player1)

      expect(actual).toEqual(MOVE.NOT_VALID)
    })

    test('Players Have have TWO as last card', () => {
      addCardToTable(RANKS.TWO, SUITS.HEARTS, player1)

      activePile = []
      addToActivePile(RANKS.THREE, SUITS.HEARTS, activePile)

      const card = player1.getTableCards()

      const cards = [card[0][0]]

      const actual = sut.rules(activePile, cards, player1)

      expect(actual).toEqual(MOVE.NOT_VALID)
    })

    test('Players Have have TEN as last card', () => {
      addCardToTable(RANKS.TEN, SUITS.HEARTS, player1)

      activePile = []
      addToActivePile(RANKS.THREE, SUITS.HEARTS, activePile)

      const card = player1.getTableCards()

      const cards = [card[0][0]]

      const actual = sut.rules(activePile, cards, player1)

      expect(actual).toEqual(MOVE.NOT_VALID)
    })
  })
})

function addCardToHand(rank, suit, player) {
  const handCard = new PlayingCard(rank, suit)
  handCard.show(true)
  player.addToHand(handCard)
}

function addCardToTable(rank, suit, player) {
  const tableCard = new PlayingCard(rank, suit)
  tableCard.show(true)
  player.addTableCard(tableCard)
}

function addToActivePile(rank, suit, activePile) {
  const card = new PlayingCard(rank, suit)
  card.show(true)
  activePile.push(card)
}
