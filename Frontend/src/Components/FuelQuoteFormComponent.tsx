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

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // Predefined data for testing
  const testData = {
    gallonsRequested: 500, // Example gallons requested
    delivDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // Future date, 30 days from now
    delivAddress: "123 Nunya ln", // Hardcoded delivery address
    suggestedPrice: 2.5, // Hardcoded suggested price
    totalAmountDue: '1250', // Example calculated total, assuming 500 gallons * $2.5
  };

  try {
    const response = await fetch('/api/fuelQuote', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const responseData = await response.json();
    console.log('Success:', responseData);
  } catch (error) {
    console.error('Error:', error);
  }
};
