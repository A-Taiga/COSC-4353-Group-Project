import React from 'react';
import FormTextInput, { IInput} from "./FormComponent";
import "./FuelQuoteFormComponent.css"

// Replace with fetched CLient Address Here (Server Side stuff)
const delivAddress = "123 Nunya ln";
// Replace with pricing module calculations
const suggestedPrice = "$200,000,000"


export default function FuelQuoteForm(props: any) {


	const forms: IInput[] =
	[
		{
			id: "gallonsRequested",
			name: "gallonsRequested",
			type: "text",
			label: "Gallons Requested",
			required: true,
		},
		{
			id: "delivDate",
			name: "delivDate",
			type: "date",
			label: "Delivery Date",
			required: true,
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
		}
	];

	return(
		<div id = "fuelQuoteContainer">
			<h1>Fuel Quote Form</h1>
			<form id="fuelQuoteForm" onSubmit={handleSubmit}>
				{forms.map((field) => <FormTextInput key = {field.id} {...field} />)}
			  <button id="submitQuote" type="submit">Submit Quote</button>
			</form>
		</div>
	);
}




const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
	e.preventDefault();
	const target = e.target as HTMLFormElement
	const data = new FormData(target);
  // Console log is for testing only (should not be returned in final pub)
	console.log(Object.fromEntries(data.entries()));
  // Implemenent saving to database for fuel quote history 
};