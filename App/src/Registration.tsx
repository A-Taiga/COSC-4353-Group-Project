import { useRef, useState } from "react";
import FormTextInput, { IInput} from "./Components/FormComponent";
import "./Registration.css";
export default function Registration()
{
let passwordExpression = "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$";

const username = useRef("");

  const [values, setValues] = useState({
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
        refer: username,
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


	const getValues = (e: any) =>
	{
		setValues({...values, [e.target.name]: e.target.value});
	}

	return(
		<div id = "container">
			<h2>Register</h2>
			<form onSubmit = {(submition_handler)}>
				{forms.map((forms) => <FormTextInput key = {forms.id} {...forms} onChange={getValues} />)}
			<div id = "buttons">
				<button id = "submit">Register</button>
				<button type = "button" id = "login">Login</button>
			</div>
			</form>
		</div>
	);
}

function submition_handler(e: any)
{
	e.preventDefault();
	const data = new FormData(e.target);
	console.log(data);
}