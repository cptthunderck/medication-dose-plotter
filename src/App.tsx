import "./styles.css";
import TimeInput from "./TimeInput";
import DoseInput from "./DoseInput";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  convertDose,
  fromInternalTime,
  f_Ke,
  f_tMax,
  f_tMax_prime,
  newtonRaphson,
  toInternalTime
} from "./utils";
import { AppDispatch, RootState } from "./store";
import React from "react";
import Plot from "react-plotly.js";

export default function App() {
  let selectRef = useRef<HTMLSelectElement>(null);
  let state = useSelector((state: RootState) => state);
  let dispatcher = useDispatch<AppDispatch>();

  let onClick = () => {
    console.log(state);

    let tEnd = toInternalTime(state.tEnd.value, state.tEnd.units);
    let tDose = toInternalTime(state.tDose.value, state.tDose.units);
    let interval = toInternalTime(state.interval.value, state.interval.units);

    let dose = convertDose(state.dose.value, interval, state.dose.doseType);

    let tHalf = toInternalTime(state.tHalf.value, state.tHalf.units);
    let tMax = toInternalTime(state.tMax.value, state.tMax.units);

    let Ke = f_Ke(tHalf);

    let Ka = newtonRaphson(
      (x: number) => f_tMax(x, Ke) - tMax,
      (x: number) => f_tMax_prime(x, Ke),
      1,
      Number.EPSILON,
      Number.MAX_VALUE,
      tMax * 1e-4
    );

    console.log(`Ke: ${Ke}`);
    console.log(`Ka: ${Ka}`);

    class Dose {
      offset: number;

      constructor(offset: number) {
        this.offset = offset;
      }

      f(
        t: number,
        Ka: number,
        Ke: number,
        dose: number,
        bioavailability: number,
        Vd: number
      ) {
        t = t - this.offset;
        return (
          ((bioavailability * dose * Ka) / (Vd * (Ka - Ke))) *
          (Math.exp(-Ke * t) - Math.exp(-Ka * t))
        );
      }
    }

    let data = {
      x: new Array<number>(),
      y: new Array<number>(),
      mode: "lines"
    };

    let dt = tEnd / 10000;
    let doses: Dose[] = [];
    const timeScale = fromInternalTime(1, selectRef.current?.value ?? "" );

    for (let i = 0, t = 0; t < tEnd; i++) {
      t = dt * i;

      if (t >= interval * doses.length && t < tDose) {
        doses.push(new Dose(t));
      }

      let y = 0;

      for (let j = 0; j < doses.length; j++) {
        y += doses[j].f(t, Ka, Ke, dose, 1, 1);
      }

      data.x.push(t * timeScale);
      data.y.push(y);
    }

    dispatcher({
      type: "set",
      property: "data",
      value: data
    });

    dispatcher({
      type: "set",
      property: "message",
      value: !isNaN(dose)
        ? `Dosing ${dose.toPrecision(4)} every ${state.interval.value} ${
            state.interval.units
          }`
        : ""
    });
  };

  return (
    <div className="App">
      <h1>Medication Dose Plotter</h1>
      <label htmlFor="tEnd">Time to plot</label>
      <TimeInput id="tEnd" set="tEnd" selected="weeks" />

      <label htmlFor="tDose">Time to dose</label>
      <TimeInput id="tDose" set="tDose" selected="weeks" />

      <label htmlFor="interval">Time between doses</label>
      <TimeInput id="interval" set="interval" selected="days" />

      <label htmlFor="dose">Dose (any units)</label>
      <DoseInput id="dose" set="dose" selected="per_dose" />

      <label htmlFor="tHalf">Half-life</label>
      <TimeInput id="tHalf" set="tHalf" selected="days" />

      <label htmlFor="tMax">Time to maximum concentration</label>
      <TimeInput id="tMax" set="tMax" selected="days" />

      <button onClick={onClick}>Plot</button>
      <select defaultValue="days" ref={selectRef}>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
        <option value="weeks">Weeks</option>
      </select>
      <p>{state.message}</p>
      <Plot
        style={{ width: "100%", height: "100%" }}
        useResizeHandler
        data={[state.data]}
        layout={{ autosize: true }}
      />
    </div>
  );
}
