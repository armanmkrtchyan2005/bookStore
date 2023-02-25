import React from "react";
import "./button.css";

export default function Button({
  value,
  disabled = false,
  type = "button",
  onClick = () => {},
}) {
  return (
    <button
      type={type}
      className="button"
      disabled={disabled}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
