// Quiz state machine — useReducer pattern
// States: ONBOARD → PLAY → FEEDBACK → PLAY → ... → RESULTS

export const ACTIONS = {
  START: 'START',
  SELECT_ANSWER: 'SELECT_ANSWER',
  NEXT_QUESTION: 'NEXT_QUESTION',
  REPLAY: 'REPLAY',
}

export function createInitialState(scenarios, total) {
  return {
    phase: 'onboard',  // onboard | play | feedback | results
    scenarios,
    total,
    round: 0,
    correct: 0,
    picked: null,
    wrongAnswers: [],
    saved: false,
  }
}

export function quizReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START:
      return { ...state, phase: 'play' }

    case ACTIONS.SELECT_ANSWER: {
      if (state.picked !== null) return state
      const { index } = action
      const current = state.scenarios[state.round]
      const opt = current.options[index]
      const isCorrect = opt.correct
      const correctOpt = current.options.find(o => o.correct)

      return {
        ...state,
        phase: 'feedback',
        picked: index,
        correct: isCorrect ? state.correct + 1 : state.correct,
        wrongAnswers: isCorrect
          ? state.wrongAnswers
          : [...state.wrongAnswers, {
              type: current.type,
              quote: current.quote,
              youSaid: opt.script,
              shouldSay: correctOpt?.script || '',
              explanation: opt.explanation,
              correctExplanation: correctOpt?.explanation || '',
            }],
      }
    }

    case ACTIONS.NEXT_QUESTION: {
      if (state.round >= state.total - 1) {
        return { ...state, phase: 'results', picked: null }
      }
      return {
        ...state,
        phase: 'play',
        round: state.round + 1,
        picked: null,
      }
    }

    case ACTIONS.REPLAY:
      return createInitialState(action.scenarios, state.total)

    default:
      return state
  }
}
