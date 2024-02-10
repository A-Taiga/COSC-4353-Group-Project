
import {useState, InputHTMLAttributes} from "react";
import "./FormComponent.css";

export interface IInput extends InputHTMLAttributes<HTMLInputElement>
{
	label?: string
	refer?: any,
	error?: string,
	focused?: string,
}

export default function FormTextInput(prop: IInput)
{
	let [focused, setFocused] = useState(false);
	const handleOnFocus = (e: any) => {setFocused(false);}
	const handleBlur = (e: any) => {setFocused(true);}
	return (
		
		<div id = "formTextContainer">
			<label htmlFor = {prop.id}>{prop.label}</label>
			<input 
			focused = {focused.toString()}
			{...prop}
			onBlur={handleBlur}
			onFocus={handleOnFocus}
			>
			</input>
			<span>{prop.error}</span>
		</div>
	)
}