import { Player } from '../Player.js'
import { PlayingCard } from '../PlayingCard.js'

interface ListenNewCard {
  update(player: Player, card: PlayingCard)
}

export { ListenNewCard }
