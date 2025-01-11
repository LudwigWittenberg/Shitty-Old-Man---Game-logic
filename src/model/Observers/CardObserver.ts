import { PlayingCard } from '../PlayingCard.js'
import { ListenNewCard } from './ListenNewCard.js'

interface CardObserver {
  subscribers: ListenNewCard[]

  addObserver(observer: ListenNewCard)

  removeObserver(observer: ListenNewCard)

  notifyObservers(card: PlayingCard)
}

export { CardObserver }
