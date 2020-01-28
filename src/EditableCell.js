import React from "react";
import OutsideAlerter from "./OutsideAlerter";
// import "../RangeInput.css";

function EditableCell({ value, onChange }) {
  const [inputVisible, setInputVisible] = React.useState(false);
  const [localValue, setLocalValue] = React.useState(value);

  return (
    <OutsideAlerter
      onOutSideClick={_ => {
        setInputVisible(false);
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
        <input
          style={{ width: "100px" }}
          value={localValue}
          onChange={e => {
            setLocalValue(e.target.value);
            if (onChange !== undefined) onChange(e.target.value);
          }}
        />
      )}
    </OutsideAlerter>
  );
}

export default EditableCell;
