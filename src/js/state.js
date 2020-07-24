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
  const defaultStateData = {
    entities: [],
    menus: {},
    ctrl: {},
  };

  let stateData = { ...defaultStateData, ...initialState };

  const removeCtrl = (name) => {
    if (typeof stateData.ctrls[name] !== "undefined") {
      if (typeof stateData.ctrls[name].onRemove === "function") {
        stateData.ctrls[name].onRemove(stateData.ctrls[name]);
      }
      delete stateData.ctrls[name];
    }
  };

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
    addCtrl: (name, ctrl) => {
      const newCtrl = {};
      newCtrl[name] = ctrl;
      stateData = { ...stateData, ctrls: { ...stateData.ctrls, ...newCtrl } };
    },
    removeCtrl,
    removeAllCtrls: () => {
      for (let k in stateData.ctrls) {
        if (stateData.ctrls.hasOwnProperty(k)) {
          removeCtrl(k);
        }
      }
    },
  };
  return stateModel;
}
