import React, { InputHTMLAttributes, useState } from "react"
import "../styles/FormComponent.css"

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function FormTextInput(props: IInput) {
  const [isFocused, setIsFocused] = useState(false)
  const [patternMismatch, setPatternMismatch] = useState(false)

  const handleFocus = () => setIsFocused(true)

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false)
    setPatternMismatch(!e.target.validity.valid)

    // If your input has an onBlur prop passed to it, call it
    if (props.onBlur) props.onBlur(e)
  }

  return (
    <div id="formTextContainer" className={isFocused ? "focused" : ""}>
      <label htmlFor={props.id}>{props.label}</label>
      <input
        className="border-2 border-grey-300 rounded-md p-4"
        {...props} // Spread the props first to correctly apply the onFocus, onBlur from props if provided
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {patternMismatch && props.error && (
        <div style={{ color: "red", marginTop: "5px" }}>{props.error}</div>
      )}
    </div>
  )
}
