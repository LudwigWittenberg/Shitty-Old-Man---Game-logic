import { Deck } from "./Deck.js";
import { RANKS } from "./enums/playingcard/RANKS.js";
import { SUITS } from "./enums/playingcard/SUITS.js";
import { Player } from "./Player.js";
import { PlayingCard } from "./PlayingCard.js";

const deck = new Deck()
const ludde = new Player('Ludde')

const settings = [
  [false, false, false],
  [false, false, false]
]

ludde.setStartTableSettings(settings)

ludde.addTableCard(deck.dealCard())
ludde.addTableCard(deck.dealCard())
ludde.addTableCard(deck.dealCard())
ludde.addTableCard(deck.dealCard())
ludde.addTableCard(deck.dealCard())
ludde.addTableCard(deck.dealCard())

const card = new PlayingCard(RANKS.TEN, SUITS.HEARTS)
card.show(true)
ludde.addToHand(card)

const card2 = new PlayingCard(RANKS.ACE, SUITS.DIAMONDS)
card2.show(true)
ludde.addToHand(card2)

const luddesCards = ludde.getHand()

for (const card of luddesCards) {
  console.log(card.rank, ' ', card.suit)
}

const cardToRemove = new PlayingCard(RANKS.FIVE, SUITS.CLUBS)

console.log(cardToRemove)

ludde.playCard(cardToRemove)

const luddesCardsAfterPlayed = ludde.getHand()

for (const card of luddesCardsAfterPlayed) {
  console.log(card.rank, ' ', card.suit)
}