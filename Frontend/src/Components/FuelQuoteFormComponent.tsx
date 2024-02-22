import React, { useState } from "react"
import FormTextInput, { IInput } from "./FormComponent"
import "../styles/FuelQuoteFormComponent.css"

// Replace with fetched CLient Address Here (Server Side stuff)
const delivAddress = "123 Nunya ln"
// Replace with pricing module calculations
const suggestedPrice = 2.5

export default function FuelQuoteForm(props: any) {
  const [gallonsRequested, setGallonsRequested] = useState("")
  const [totalAmountDue, setTotalAmountDue] = useState("")

  // Calculates in real time as user inputs gallons requested
  const handleGallonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const gallons = e.target.value
    setGallonsRequested(gallons)
    const total = gallons ? parseFloat(gallons) * suggestedPrice : 0
    setTotalAmountDue(total.toFixed(2))
  }

  const forms: IInput[] = [
    {
      id: "gallonsRequested",
      name: "gallonsRequested",
      type: "number",
      label: "Gallons Requested",
      required: true,
      min: 1,
      max: 10000,
      onChange: handleGallonChange,
    },
    {
      id: "delivDate",
      name: "delivDate",
      type: "date",
      label: "Delivery Date",
      required: true,
      // Prevents user from picking past and present dates
      min: new Date().toISOString().split("T")[0],
    },
    {
      id: "delivAddress",
      name: "delivAddress",
      type: "text",
      label: "Delivery Address",
      value: delivAddress,
      disabled: true,
    },
    {
      id: "suggestedPrice",
      name: "suggestedPrice",
      type: "text",
      label: "Suggested Price",
      value: suggestedPrice,
      disabled: true,
    },
    {
      id: "totalAmount",
      name: "totalAmount",
      type: "text",
      label: "Total Amount Due",
      value: totalAmountDue ? `$${totalAmountDue}` : "",
      disabled: true,
    },
  ]

  return (
    <div id="fuelQuoteContainer">
      <h1>Fuel Quote Form</h1>
      <form id="fuelQuoteForm" onSubmit={handleSubmit}>
        {forms.map((field) => (
          <FormTextInput key={field.id} {...field} />
        ))}
        <button id="submitQuote" type="submit">
          Submit Quote
        </button>
      </form>
    </div>
  )
}

const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const target = e.target as HTMLFormElement
  const data = new FormData(target)
  // Added because "disabled" didnt pass these values through to console.log
  data.append("delivAddress", delivAddress)
  data.append("suggestedPrice", suggestedPrice.toFixed(2))
  // REMOVE BEFORE FINAL
  console.log(Object.fromEntries(data.entries()))
  // Implemenent saving to database for fuel quote history
}
