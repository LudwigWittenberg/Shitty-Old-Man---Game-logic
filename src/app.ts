import { GameController } from "./controller/GameController.js"
import { SwedishGameView } from "./view/SwedishGameView.js"

const view = new SwedishGameView()
const gameController = new GameController(view)

gameController.run()
