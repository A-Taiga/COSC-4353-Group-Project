import React from "react"
import { NavLink } from "react-router-dom"
import FormTextInput, { IInput } from "../components/FormComponent"
import { useLoginMutation } from "../features/api/apiSlice"
import "../styles/Login.css"

export default function Login() {
  const [login] = useLoginMutation()

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLFormElement
    e.preventDefault()
    const data = new FormData(target)
    // Convert FormData into a plain object
    const credentials = Object.fromEntries(data.entries())
    credentials.fingerprint = "randomfingerprint1234"
    console.log("credentials", credentials)

    try {
      // Execute the mutation
      const response = await login(credentials).unwrap()

      if(response.status !== 200)
        throw new Error()
      console.log("Login successful", response)
      // Handle success (e.g., navigate to a dashboard)
    } catch (err) {
      console.error("Login failed", err)
    }
  }

  const forms: IInput[] = [
    {
      id: "username",
      name: "username",
      type: "text",
      label: "Username",
      required: true,
    },
    {
      id: "password",
      name: "password",
      type: "password",
      label: "Password",
      required: true,
    },
  ]

  return (
    <div id="loginContainer">
      <h1>Login</h1>
      <form onSubmit={handleOnSubmit}>
        {forms.map((forms) => (
          <FormTextInput key={forms.id} {...forms} />
        ))}
        <div id="buttons">
          <button id="login">Login</button>
        </div>
      </form>
      <div id="divider"></div>
      <NavLink to="/register">Register Here</NavLink>
    </div>
  )
}
