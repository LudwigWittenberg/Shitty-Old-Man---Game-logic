import { GameWinner } from '../../src/rules/GameWinner'
import { OneLayerDeck } from '../../src/rules/OneLayerDeck'
import { OrginalGameRules } from '../../src/rules/OrginalGameRules'
import { RulesFactory } from '../../src/rules/RulesFactory'

describe('RuleFactory Under test', () => {
  let sut: RulesFactory

  beforeEach(() => {
    sut = new RulesFactory()
  })

  test('The startDeck is an instace of StartDeck', () => {
    const actual = sut.getStartDeck()

    expect(actual).toBeInstanceOf(OneLayerDeck)
  })

  test('The GameRules is an instace of Rules', () => {
    const actual = sut.getGameRules()

    expect(actual).toBeInstanceOf(OrginalGameRules)
  })

  test('The WinnerRules is an instace of DeterminitateWinner', () => {
    const actual = sut.getWinnerRules()

    expect(actual).toBeInstanceOf(GameWinner)
  })
})