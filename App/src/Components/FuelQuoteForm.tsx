import React from 'react';
import FormTextInput, { IInput} from "../Components/FormComponent";

// Fetch CLient Address Here (Server Side stuff)
const delivAddress = "123 Nunya ln";


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
		}
	];

	return(
		<div id = "fuelQuoteContainer">
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				{forms.map((field) => <FormTextInput key = {field.id} {...field} />)}
        <div id="delivAddress">Delivery Address: {delivAddress}</div>
			  <button type="submit">Submit Quote</button>
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