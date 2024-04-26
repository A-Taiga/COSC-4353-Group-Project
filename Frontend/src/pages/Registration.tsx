import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useRegisterMutation } from "../api/apiSlice"
import FormTextInput, { IInput } from "../components/FormComponent"
import NavButton from "../components/NavButton"
import "../styles//Registration.css"
export default function Register() {
  const passwordExpression =
    "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$"
  const [register, { isSuccess, isLoading }] = useRegisterMutation()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")

  const [values, setValues] = React.useState({
    username: "",
    password: "",
    confirmPassword: "",
  })

  const submission_handler = async (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as HTMLFormElement
    e.preventDefault()
    const data = new FormData(target)
    // Remove the confirmPassword field from the FormData
    data.delete("confirmPassword")
    const credentials = Object.fromEntries(data.entries())

    try {
      const response = await register(credentials).unwrap()
      if (!isSuccess) {
        if (response.message === "Username Taken") {
          setErrorMessage("Username is already taken")
        } else {
          setErrorMessage("Registration failed")
        }
      } else navigate("/login")
    } catch (err) {
      console.error("Registration failed", err)
    }
  }

  const forms: IInput[] = [
    {
      id: "username",
      name: "username",
      type: "text",
      label: "Username",
      pattern: "^[A-Za-z0-9]{3,16}$",
      error:
        "Username must be 3-16 characters long and contain only letters and numbers",
      required: true,
    },
    {
      id: "password",
      name: "password",
      type: "password",
      label: "Password",
      pattern: passwordExpression,
      error:
        "Password must be 6-16 characters long and contain at least one number and one or more !@#$%^&*",
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
    },
  ]

  // for telling the user the patterns do not match
  const getValues = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setValues({ ...values, [target.name]: target.value })
  }
  return (
    <div id="registrationContainer">
      <div id="header">
        <h1>Register</h1>
      </div>
      <NavButton id="login" to="/login">
        X
      </NavButton>
      {errorMessage.length > 0 ? (
        <div className="text-red-600">{errorMessage}</div>
      ) : (
        <div />
      )}
      <form onSubmit={submission_handler}>
        {forms.map((form) => (
          <FormTextInput key={form.id} {...form} onChange={getValues} />
        ))}
        <div id="buttons">
          <button id="submit" disabled={isLoading}>
            {isLoading ? "Loading..." : "Register"}
          </button>
        </div>
      </form>
    </div>
  )
}
