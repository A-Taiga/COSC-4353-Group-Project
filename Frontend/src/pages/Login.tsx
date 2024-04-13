import React, { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import FormTextInput, { IInput } from "../components/FormComponent"
import { useLoginMutation } from "../features/api/apiSlice"
import "../styles/Login.css"

export default function Login() {
  const [login, isSuccess] = useLoginMutation()
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const handleOnSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLFormElement
    e.preventDefault()
    const data = new FormData(target)
    // Convert FormData into a plain object
    const credentials = Object.fromEntries(data.entries())
    credentials.fingerprint = "randomfingerprint1234"

    try {
      // Execute the mutation
      const response = await login(credentials).unwrap()
      console.log(response)
      if (!isSuccess) {
        if (response.message === "Bad Request") {
          setErrorMessage("Bad Request")
        } else if (response.message === "Unauthorized") {
          setErrorMessage("Username or password is incorrect")
        }
      } else {
        console.log("Login successful", response)
        // navigate("/profile", { state: { from } })
        navigate("/profile")
      }
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
      {errorMessage.length > 0 ? (
        <div className="text-red-600">{errorMessage}</div>
      ) : (
        <div />
      )}
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
