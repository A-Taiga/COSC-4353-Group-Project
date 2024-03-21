import asyncHandler from '../middlewares/asyncHandler'
import { Request, Response } from 'express'



const profile = asyncHandler(async (req: Request, res: Response) => 
{
	const states = ["AL","AK","AZ","AR","CA","CO","CT","DE"
					,"FL","GA","HI","ID","IL","IN","IA","KS"
					,"KY","LA","ME","MD","MA","MI","MN","MS"
					,"MO","MT","NE","NV","NH","NJ","NM","NY"
					,"NC","ND","OH","OK","OR","PA","RI","SC"
					,"SD","TN","TX","UT","VT","VA","WA","WV"
					,"WI","WY",]

	let {fullName
			, address1
			, address2
			, city
			, state
			, zipcode} = req.body


	const zipCodePattern1: RegExp = /^\d{5}$/;
	const zipCodePattern2: RegExp = /^\d{5}-\d{4}$/;


	if (!fullName || !address1 || !city || !state || !zipcode)
	{
		res.status(400).json(
			{
				message: 'Some fields are missing.',
				fullName: fullName,
				address1: address1,
				address2: address2,
				city: city,
				state: state,
				zipcode: zipcode,
			}
		)
	}


	fullName = fullName.toLowerCase()

	const is = (s:string) =>
	{
		return s === state;
	};	

	if (!states.find(is))
	{
		res.status(400).json(
			{
				message: 'Not a valid state code',
				state: state,
			})
	}


	if (!zipCodePattern1.test(zipcode) && !zipCodePattern2.test(zipcode))
	{
		res.status(400).json(
			{
				message: 'Zipcode invalid',
				zipcode: zipcode,
		})
	}
	

	res.status(200).json({
		message: 'profile saved',
		fullName: fullName,
		address1: address1,
		address2: address2,
		city: city,
		state: state,
		zipcode: zipcode,
	})

});

export default profile