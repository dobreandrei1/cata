import React from "react";
import OutsideAlerter from "./OutsideAlerter";
// import "../RangeInput.css";

function EditableCell({ value, onChange }) {
  const [inputVisible, setInputVisible] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value);

  return (
    <OutsideAlerter
      onOutSideClick={_ => {
        if (inputVisible) {
          setInputVisible(false);
          // Delay parent update after this function render completes
          setTimeout(_ => {
            if (onChange !== undefined) onChange(localValue);
          }, 0);
        }
      }}
    >
      {!inputVisible ? (
        <div
          onClick={_ => {
            setInputVisible(true);
            // ref.current.click();
          }}
        >
          {localValue ? localValue : "-"}
        </div>
      ) : (
        <textarea
          style={{ width: "100px" }}
          value={localValue}
          onChange={e => {
            setLocalValue(e.target.value);
          }}
        />
      )}
    </OutsideAlerter>
  );
}

export default React.memo(
  EditableCell,
  (prev, next) => prev.value === next.value
);
