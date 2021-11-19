import { createStore } from "redux";

let defaultValue = {
  value: NaN,
  units: ""
};

let initialState = {
  tEnd: defaultValue,
  tDose: defaultValue,
  interval: defaultValue,
  tHalf: defaultValue,
  tMax: defaultValue,
  dose: { value: NaN, doseType: "" },
  data: {
    x: new Array<number>(),
    y: new Array<number>()
  },
  message: ""
};

export type MyAction = {
  type: "set";
  property: string;
  value: any;
};

function reducer(state = initialState, action: MyAction) {
  console.log(action);

  let stateCopy = { ...state };

  if (action.type === "set") {
    (stateCopy as {[key: string]: any})[action.property] = action.value;
  }

  return stateCopy;
}

const store = createStore(reducer);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
