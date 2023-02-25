import React from "react";
import "./input.css";

export default function Input({
  type,
  placeholder,
  value,
  onChange = (e) => {},
}) {
  return (
    <input
      value={value}
      onChange={onChange}
      type={type}
      placeholder={placeholder}
    />
  );
}
