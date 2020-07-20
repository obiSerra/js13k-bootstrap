function setState(state, key, value) {
  const newState = { ...state };
  newState[key] = value;
  return newState;
}

function updateState(state, updateFn) {
  return updateFn(state);
}

function getState(state, key, defaultValue = null) {
  return typeof state[key] !== "undefined" ? state[key] : defaultValue;
}
export default function createState(initialState = {}) {
  let stateData = initialState;

  // TODO add some special fields (status)
  const stateModel = {
    gameStatus: () => getState(stateData, "gameState"),
    updateGameStatus: (newGameState) => {
      stateData = setState(stateData, "gameState", newGameState);
      return stateModel;
    },
    setState: (key, val) => {
      stateData = setState(stateData, key, val);
      return stateModel;
    },
    getState: (key, ...rest) => getState.apply(null, [stateData, key, ...rest]),
    updateState: (updateFn) => {
      stateData = updateState(stateData, updateFn);
      return stateModel;
    },
  };
  return stateModel;
}
