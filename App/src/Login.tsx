
import React from 'react';
import FormTextInput, { IInput} from "./Components/FormComponent";

export default function Login() {


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

	return(
		<div id = "container">
			<h1>Login</h1>
			<form>
			{forms.map((forms) => <FormTextInput key = {forms.id} {...forms} />)}
			<div id = "buttons">
				<button id = "login">Login</button>
				<button id = "submit">Register</button>
			</div>
			</form>
		</div>
	)
}