import React, { useRef } from "react";
import { useDispatch } from "react-redux";
import "./styles.css";

import { AppDispatch } from "./store";

type TimeInputProps = {
  id: string;
  selected: "hours" | "days" | "weeks";
  set: string;
};

export default function TimeInput(props: TimeInputProps) {
  let inputRef = useRef<HTMLInputElement>(null);
  let selectRef = useRef<HTMLSelectElement>(null);
  let dispatcher = useDispatch<AppDispatch>();

  let onChange = () => {
    dispatcher({
      type: "set",
      property: props.set,
      value: {
        value: inputRef.current?.valueAsNumber ?? NaN,
        units: selectRef.current?.value ?? ""
      }
    });
  };

  return (
    <div id={props.id}>
      <input onChange={onChange} type="number" ref={inputRef} />
      <select onChange={onChange} defaultValue={props.selected} ref={selectRef}>
        <option value="hours">hours</option>
        <option value="days">days</option>
        <option value="weeks">weeks</option>
      </select>
    </div>
  );
}
