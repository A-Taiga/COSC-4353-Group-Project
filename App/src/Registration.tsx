import React from "react";
import FormTextInput, { IInput} from "./Components/FormComponent";
import "./Registration.css";

export default function Registration(props: any)
{
let passwordExpression = "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$";

  const [values, setValues] = React.useState
  ({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const forms: IInput[] =
    [
      {
        id: "username",
        name: "username",
        type: "text",
        label: "Username",
        pattern: "^[A-Za-z0-9]{3,16}$",
        error: "Username must be 3-16 characters long and contain only letters and numbers",
        required: true,
      },
      {
        id: "password",
        name: "password",
        type: "password",
        label: "Password",
        pattern: passwordExpression,
        error: "Password must be 6-16 characters long and contain at least one number and one or more !@#$%^&*",
        required: true,
      },
      {
        id: "confirmPassword",
        name: "confirmPassword",
        type: "password",
        label: "Confirm Password",
        pattern: values.password,
        error: "Passwords do not match",
        required: true,
      }
    ]

  // for telling the user the patterns do not match
	const getValues = (e: React.FormEvent<HTMLInputElement>) =>
  {
    const target = e.target as HTMLInputElement;
    setValues({...values, [target.name]: target.value});
  }

	return(
		<div id = "registrationContainer">
      <div id = "header">
        <h1>Register</h1>
        <button type = "button" id = "login" onClick={e =>  props.set("login")}>X</button>
      </div>
			<form onSubmit = {(submition_handler)}>
				{forms.map((forms) => <FormTextInput key = {forms.id} {...forms} onChange={getValues} />)}
			<div id = "buttons">
				<button id = "submit">Register</button>
			</div>
			</form>
		</div>
	);
}

function submition_handler(e: React.FormEvent<HTMLFormElement>)
{
	e.preventDefault();
  const target = e.target as HTMLFormElement;
	const data = new FormData(target);
	console.log(data);
}