import { useState, InputHTMLAttributes } from "react";
import "./FormComponent.css";

export interface IInput extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function FormTextInput(props: IInput) {
  const [isFocused, setIsFocused] = useState(false);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: any) => {
    setIsFocused(false);
    // If your input has an onBlur prop passed to it, call it
    if (props.onBlur) props.onBlur(e);
  };

  return (
    <div id="formTextContainer" className={isFocused ? 'focused' : ''}>
      <label htmlFor={props.id}>{props.label}</label>
      <input 
        {...props} // Spread the props first to correctly apply the onFocus, onBlur from props if provided
        onFocus={handleFocus}
        onBlur={handleBlur}
        // Remove the focused attribute since it's not valid for <input>
      />
      {props.error && <div style={{ color: 'red', marginTop: '5px' }}>{props.error}</div>}
    </div>
  );
}
