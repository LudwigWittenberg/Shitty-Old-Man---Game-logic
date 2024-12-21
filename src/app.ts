import { Deck } from "./Deck.js";
import { Player } from "./Player.js";

const d = new Deck()

d.shuffle()

const ludde = new Player('Ludde')
const hampus = new Player('Hampus')

const settings = [
  [false, false, false],
  [false, false, false]
]

ludde.setStartTableSettings(settings)
hampus.setStartTableSettings(settings)

for (let i = 0; i < 3; i++) {
  const luddeCard = d.dealCard()
  luddeCard.show(false)
  ludde.addTableCard(luddeCard)
  const hampusCard = d.dealCard()
  hampusCard.show(false)
  hampus.addTableCard(hampusCard)
}

for (let i = 0; i < 3; i++) {
  const luddeCard = d.dealCard()
  luddeCard.show(true)
  ludde.addTableCard(luddeCard)
  const hampusCard = d.dealCard()
  hampusCard.show(true)
  hampus.addTableCard(hampusCard)
}

const luddeCard = d.dealCard()
luddeCard.show(true)
ludde.addToHand(luddeCard)
const hampusCard = d.dealCard()
hampusCard.show(true)
hampus.addToHand(hampusCard)

console.log('Cards Left ' + d.cardsLeft)
console.log('Ludde')
for (const card of ludde.getHand()) {
  console.log(card.rank, ' ', card.suit)
}
console.log(ludde.getTableCards())

console.log('Hampus')
for (const card of hampus.getHand()) {
  console.log(card.rank, ' ', card.suit)
}

console.log(hampus.getTableCards())
