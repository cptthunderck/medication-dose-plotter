import "./styles.css";

import { AppDispatch } from "./store";
import React, { useRef } from "react";
import { useDispatch } from "react-redux";

type DoseInputProps = {
  selected: "per_dose" | "per_hour" | "per_day" | "per_week";
  id: string;
  set: string;
};

export default function TimeInput(props: DoseInputProps) {
  let inputRef = useRef<HTMLInputElement>(null);
  let selectRef = useRef<HTMLSelectElement>(null);
  let dispatcher = useDispatch<AppDispatch>();
  
  let onChange = () => {
    dispatcher({
      type: "set",
      property: props.set,
      value: {
        value: inputRef.current?.valueAsNumber ?? NaN,
        doseType: selectRef.current?.value ?? ""
      }
    });
  };

  return (
    <div>
      <input onChange={onChange} id={props.id} type="number" ref={inputRef} />
      <select onChange={onChange} defaultValue={props.selected} ref={selectRef}>
        <option value="per_dose">per dose</option>
        <option value="per_hour">per hour</option>
        <option value="per_day">per day</option>
        <option value="per_week">per week</option>
      </select>
    </div>
  );
}
