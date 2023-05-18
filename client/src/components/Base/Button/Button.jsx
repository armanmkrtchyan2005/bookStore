import React from "react";
import styles from "./button.module.css";

export default function Button({
  value,
  disabled = false,
  type = "button",
  onClick = () => {},
}) {
  return (
    <button
      type={type}
      className={styles.button}
      disabled={disabled}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
