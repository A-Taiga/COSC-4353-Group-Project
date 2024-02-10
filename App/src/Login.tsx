
import React from 'react';
import FormTextInput, { IInput} from "./Components/FormComponent";
import "./Login.css";

export default function Login() {


	let username = "";
	let passowrd = "";

	const forms: IInput[] =
	[
		{
			id: "username",
			name: "username",
			type: "text",
			label: "Username",
		},
		{
			id: "password",
			name: "passowrd",
			type: "password",
			label: "Password",
		}
	]

	const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) =>
	{
		const target = e.target as HTMLButtonElement;
	}

	const getValues = (e: React.FormEvent<HTMLInputElement>) =>
	{
		const target = e.target as HTMLInputElement;
		if(target.id === "username")
			username = target.value;
		else if(target.id == "password")
			passowrd = target.value;
	}

	return(
		<div id = "container">
			<h1>Login</h1>
			<form onSubmit={e => e.preventDefault()}>
			{forms.map((forms) => <FormTextInput key = {forms.id} {...forms} onChange={getValues}/>)}
			<div id = "buttons">
				<button id = "login" onClick={handleSubmit}>Login</button>
				<button id = "register" onClick={handleSubmit}>Register</button>
			</div>
			</form>
		</div>
	)
}